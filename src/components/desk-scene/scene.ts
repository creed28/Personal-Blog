import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'

import { SEAT_HEIGHT, createCharacter } from './character'
import { createDiary } from './diary'
import { clamp, damp, lerp } from './helpers'
import { createMaterials } from './materials'
import { createRoom } from './room'
import { CHAIR_Z, DESK_HEIGHT, createStudy } from './study'

export type SceneTheme = 'light' | 'dark'

export type DeskSceneOptions = {
  theme: SceneTheme
  reducedMotion: boolean
}

export type DeskSceneController = {
  setTheme: (theme: SceneTheme) => void
  dispose: () => void
}

const REST_AZIMUTH = -Math.PI / 4
const MIN_AZIMUTH = -Math.PI / 2 + 0.22
const MAX_AZIMUTH = -0.22
const ELEVATION = 0.56
const INTRO_SPIN = 0.7
const LOOK_TARGET = new THREE.Vector3(0, 0.95, 0)

type Rig = {
  sky: THREE.Color
  ground: THREE.Color
  hemisphere: number
  key: number
  keyColor: THREE.Color
  keyFrom: THREE.Vector3
  fill: number
  environment: number
  lamp: number
  exposure: number
}

const DAY: Rig = {
  sky: new THREE.Color(0xfff3e2),
  ground: new THREE.Color(0xb39478),
  hemisphere: 1.1,
  key: 2.6,
  keyColor: new THREE.Color(0xfff0dc),
  keyFrom: new THREE.Vector3(-3.2, 5.6, 4.4),
  fill: 0.7,
  environment: 0.55,
  lamp: 0,
  exposure: 1
}

const NIGHT: Rig = {
  sky: new THREE.Color(0x7383c0),
  ground: new THREE.Color(0x2e2836),
  hemisphere: 0.5,
  key: 0.7,
  keyColor: new THREE.Color(0x9fb2ff),
  keyFrom: new THREE.Vector3(5, 4.4, -0.8),
  fill: 0.18,
  environment: 0.16,
  lamp: 1,
  exposure: 1.1
}

export async function createDeskScene(
  container: HTMLElement,
  { theme, reducedMotion }: DeskSceneOptions
): Promise<DeskSceneController> {
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.NeutralToneMapping
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFShadowMap

  const canvas = renderer.domElement
  canvas.setAttribute('aria-hidden', 'true')
  Object.assign(canvas.style, {
    display: 'block',
    width: '100%',
    height: '100%',
    cursor: 'grab',
    touchAction: 'pan-y'
  })
  container.appendChild(canvas)

  const scene = new THREE.Scene()
  const pmrem = new THREE.PMREMGenerator(renderer)
  const studio = new RoomEnvironment()
  const environment = pmrem.fromScene(studio, 0.04).texture
  studio.dispose()
  pmrem.dispose()
  scene.environment = environment

  const materials = createMaterials()
  const room = createRoom(materials)
  const study = createStudy(materials)
  study.group.position.set(-0.12, 0, 0.2)
  study.group.rotation.y = -0.32
  room.group.add(study.group)

  const character = createCharacter(materials)
  character.root.position.set(0, SEAT_HEIGHT, CHAIR_Z)
  study.group.add(character.root)

  const diary = createDiary(materials, renderer.capabilities.getMaxAnisotropy())
  diary.group.position.set(-0.04, DESK_HEIGHT, 0.29)
  diary.group.rotation.y = Math.PI + 0.12
  study.group.add(diary.group)
  scene.add(room.group)

  const hemisphere = new THREE.HemisphereLight()
  const key = new THREE.DirectionalLight()
  key.target.position.copy(LOOK_TARGET)
  key.castShadow = true
  key.shadow.mapSize.set(2048, 2048)
  Object.assign(key.shadow.camera, {
    left: -2.8,
    right: 2.8,
    top: 2.8,
    bottom: -2.8,
    near: 0.5,
    far: 16
  })
  key.shadow.bias = -0.0004
  key.shadow.normalBias = 0.02
  key.shadow.radius = 3
  const fill = new THREE.DirectionalLight(0xdce8ff)
  fill.position.set(4, 3, -1)
  scene.add(hemisphere, key, key.target, fill)

  let mix = theme === 'dark' ? 1 : 0
  let mixTarget = mix

  function applyLighting(t: number) {
    hemisphere.color.lerpColors(DAY.sky, NIGHT.sky, t)
    hemisphere.groundColor.lerpColors(DAY.ground, NIGHT.ground, t)
    hemisphere.intensity = lerp(DAY.hemisphere, NIGHT.hemisphere, t)
    key.color.lerpColors(DAY.keyColor, NIGHT.keyColor, t)
    key.intensity = lerp(DAY.key, NIGHT.key, t)
    key.position.lerpVectors(DAY.keyFrom, NIGHT.keyFrom, t).add(LOOK_TARGET)
    fill.intensity = lerp(DAY.fill, NIGHT.fill, t)
    scene.environmentIntensity = lerp(DAY.environment, NIGHT.environment, t)
    renderer.toneMappingExposure = lerp(DAY.exposure, NIGHT.exposure, t)

    const lamp = lerp(DAY.lamp, NIGHT.lamp, t)
    study.spot.intensity = lamp * 2.2
    study.glow.intensity = lamp * 0.9
    study.spot.shadow.autoUpdate = lamp > 0.01
    materials.bulb.emissiveIntensity = lamp * 3
    room.nightSky.opacity = t
  }
  applyLighting(mix)

  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 40)
  const view = {
    azimuth: REST_AZIMUTH + (reducedMotion ? 0 : INTRO_SPIN),
    target: REST_AZIMUTH
  }

  function placeCamera(azimuth: number) {
    const distance = 14
    camera.position.set(
      LOOK_TARGET.x + distance * Math.sin(azimuth) * Math.cos(ELEVATION),
      LOOK_TARGET.y + distance * Math.sin(ELEVATION),
      LOOK_TARGET.z + distance * Math.cos(azimuth) * Math.cos(ELEVATION)
    )
    camera.lookAt(LOOK_TARGET)
    camera.updateMatrixWorld()
  }

  placeCamera(REST_AZIMUTH)
  scene.updateMatrixWorld(true)
  const box = new THREE.Box3().setFromObject(room.group)
  const frame = new THREE.Box3()
  const corner = new THREE.Vector3()
  for (let i = 0; i < 8; i++) {
    corner.set(
      i & 1 ? box.max.x : box.min.x,
      i & 2 ? box.max.y : box.min.y,
      i & 4 ? box.max.z : box.min.z
    )
    frame.expandByPoint(corner.applyMatrix4(camera.matrixWorldInverse))
  }

  function resize() {
    const { clientWidth: width, clientHeight: height } = container
    if (!width || !height) return
    renderer.setSize(width, height, false)
    const padding = 1.04
    let halfWidth = ((frame.max.x - frame.min.x) / 2) * padding
    let halfHeight = ((frame.max.y - frame.min.y) / 2) * padding
    const aspect = width / height
    if (halfWidth / halfHeight > aspect) halfHeight = halfWidth / aspect
    else halfWidth = halfHeight * aspect
    const centerX = (frame.max.x + frame.min.x) / 2
    const centerY = (frame.max.y + frame.min.y) / 2
    camera.left = centerX - halfWidth
    camera.right = centerX + halfWidth
    camera.top = centerY + halfHeight
    camera.bottom = centerY - halfHeight
    camera.updateProjectionMatrix()
    invalidate()
  }

  let clock = 0
  let lastInteraction = -Infinity
  let drag: { id: number; x: number; azimuth: number } | null = null

  const onPointerDown = (event: PointerEvent) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    drag = { id: event.pointerId, x: event.clientX, azimuth: view.target }
    canvas.setPointerCapture(event.pointerId)
    canvas.style.cursor = 'grabbing'
    invalidate()
  }
  const onPointerMove = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return
    view.target = clamp(
      drag.azimuth - (event.clientX - drag.x) * 0.006,
      MIN_AZIMUTH,
      MAX_AZIMUTH
    )
    invalidate()
  }
  const onPointerUp = (event: PointerEvent) => {
    if (!drag || event.pointerId !== drag.id) return
    drag = null
    lastInteraction = clock
    canvas.style.cursor = 'grab'
  }
  canvas.addEventListener('pointerdown', onPointerDown)
  canvas.addEventListener('pointermove', onPointerMove)
  canvas.addEventListener('pointerup', onPointerUp)
  canvas.addEventListener('pointercancel', onPointerUp)

  const penTip = new THREE.Vector3()
  const restingHand = new THREE.Vector3()
  let glance = 0
  let nextGlance = 5 + Math.random() * 5

  function animateCharacter(dt: number) {
    if (drag) glance = Math.max(glance, 1)
    if (glance > 0) {
      glance -= dt
    } else {
      nextGlance -= dt
      if (nextGlance <= 0 && diary.isPenLifted()) {
        glance = 2.2
        nextGlance = 8 + Math.random() * 8
      }
    }
    const lookingUp = glance > 0

    diary.update(dt, lookingUp)
    diary.getPenTip(penTip)
    diary.getRestingHand(restingHand)
    character.update(dt, clock, {
      penTip,
      leftHand: restingHand,
      lookAt: lookingUp ? camera.position : penTip,
      focus: lookingUp ? 0 : 1
    })
    study.update(clock)
  }

  function step(dt: number) {
    clock += dt
    if (!drag && clock - lastInteraction > 2.5) view.target = REST_AZIMUTH
    view.azimuth += (view.target - view.azimuth) * damp(drag ? 12 : 2.4, dt)
    placeCamera(view.azimuth)

    if (mix !== mixTarget) {
      mix += (mixTarget - mix) * damp(5, dt)
      if (Math.abs(mixTarget - mix) < 0.002) mix = mixTarget
      applyLighting(mix)
    }
    if (!reducedMotion) animateCharacter(dt)
  }

  const isSettled = () =>
    !drag && mix === mixTarget && Math.abs(view.target - view.azimuth) < 1e-4

  let frameId = 0
  let lastTime = 0
  let visible = true
  let disposed = false

  function loop(now: number) {
    const dt = lastTime ? Math.min((now - lastTime) / 1000, 1 / 20) : 1 / 60
    lastTime = now
    step(dt)
    renderer.render(scene, camera)
    frameId = reducedMotion && isSettled() ? 0 : requestAnimationFrame(loop)
  }

  function invalidate() {
    if (frameId || !visible || disposed) return
    lastTime = 0
    frameId = requestAnimationFrame(loop)
  }

  const resizeObserver = new ResizeObserver(resize)
  const visibility = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting
    if (!visible) {
      cancelAnimationFrame(frameId)
      frameId = 0
    } else invalidate()
  })

  diary.getPenTip(penTip)
  diary.getRestingHand(restingHand)
  for (let i = 0; i < 90; i++) {
    character.update(1 / 30, i / 30, {
      penTip,
      leftHand: restingHand,
      lookAt: penTip,
      focus: 1
    })
  }
  placeCamera(view.azimuth)
  await renderer.compileAsync(scene, camera)

  resize()
  renderer.render(scene, camera)
  resizeObserver.observe(container)
  visibility.observe(container)
  invalidate()

  function setTheme(next: SceneTheme) {
    mixTarget = next === 'dark' ? 1 : 0
    if (reducedMotion) {
      mix = mixTarget
      applyLighting(mix)
    }
    invalidate()
  }

  function dispose() {
    if (disposed) return
    disposed = true
    cancelAnimationFrame(frameId)
    resizeObserver.disconnect()
    visibility.disconnect()
    canvas.removeEventListener('pointerdown', onPointerDown)
    canvas.removeEventListener('pointermove', onPointerMove)
    canvas.removeEventListener('pointerup', onPointerUp)
    canvas.removeEventListener('pointercancel', onPointerUp)

    const disposables = new Set<{ dispose: () => void }>()
    scene.traverse(object => {
      if (object instanceof THREE.Mesh) disposables.add(object.geometry)
      if (object instanceof THREE.Mesh || object instanceof THREE.Sprite) {
        for (const material of [object.material].flat()) {
          disposables.add(material)
          for (const value of Object.values(material)) {
            if (value instanceof THREE.Texture) disposables.add(value)
          }
        }
      } else if (object instanceof THREE.Light) {
        disposables.add(object)
      }
    })
    disposables.forEach(item => item.dispose())
    environment.dispose()
    renderer.dispose()
    renderer.forceContextLoss()
    canvas.remove()
  }

  return { setTheme, dispose }
}

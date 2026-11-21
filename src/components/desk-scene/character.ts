import * as THREE from 'three';
import { mergeVertices } from 'three/examples/jsm/utils/BufferGeometryUtils.js';

import {
  capsule,
  clamp,
  damp,
  ellipsoid,
  joinMeshes,
  lerp,
  mesh,
  roundedBox,
  smoothstep,
  solveTwoBoneIK,
  spanBetween,
  taperedTube
} from './helpers';
import { COLORS, type Materials } from './materials';

export const SEAT_HEIGHT = 0.46

const HEAD_RADIUS = 0.25
const HEAD_DEPTH = 0.92
const UPPER_ARM = 0.25
const FOREARM = 0.25
const PEN_LENGTH = 0.15

const X_AXIS = new THREE.Vector3(1, 0, 0)
const Y_AXIS = new THREE.Vector3(0, 1, 0)
const Z_AXIS = new THREE.Vector3(0, 0, 1)
const ORIGIN = new THREE.Vector3()

const stretchY = (y: number) => (y >= 0 ? y * 1.06 : y * (1 - 0.22 * y))
const unstretchY = (y: number) =>
  y >= 0 ? y / 1.06 : (1 - Math.sqrt(1 - 0.88 * y)) / 0.44

function headWidth(y: number) {
  const cheeks = 0.05 * Math.exp(-((y + 0.4) ** 2) / 0.06)
  const jaw = 0.05 * smoothstep(-0.55, -1, y)
  return 1 + cheeks - jaw
}

function shapeHead(direction: THREE.Vector3, out: THREE.Vector3) {
  const width = headWidth(direction.y)
  return out.set(
    direction.x * width,
    stretchY(direction.y),
    direction.z * width * HEAD_DEPTH
  )
}

function frontOfFace(x: number, y: number) {
  const sy = unstretchY(y)
  const width = headWidth(sy)
  const sx = x / width
  const sz = Math.sqrt(Math.max(0, 1 - sx * sx - sy * sy))
  return new THREE.Vector3(x, y, sz * width * HEAD_DEPTH)
}

function facePoint(x: number, y: number, lift = 0) {
  const position = frontOfFace(x, y)
  const dx = frontOfFace(x + 0.01, y).sub(position)
  const dy = frontOfFace(x, y + 0.01).sub(position)
  const normal = new THREE.Vector3().crossVectors(dx, dy).normalize()
  position.addScaledVector(normal, lift)
  return { position, normal }
}

function onFace<T extends THREE.Object3D>(
  object: T,
  x: number,
  y: number,
  lift = 0
) {
  const { position, normal } = facePoint(x, y, lift)
  object.position.copy(position)
  object.quaternion.setFromUnitVectors(Z_AXIS, normal)
  return object
}

function weldedSphere(widthSegments: number, heightSegments: number) {
  const sphere = new THREE.SphereGeometry(1, widthSegments, heightSegments)
  sphere.deleteAttribute('normal')
  sphere.deleteAttribute('uv')
  return mergeVertices(sphere)
}

const blushAt = (p: THREE.Vector3, x: number) =>
  0.55 * Math.exp(-((p.x - x) ** 2 + 1.8 * (p.y + 0.4) ** 2) / 0.05)

function buildSkull(m: Materials) {
  const geometry = weldedSphere(72, 56)
  const position = geometry.getAttribute('position')
  const colors = new Float32Array(position.count * 3)
  const skin = new THREE.Color(COLORS.skin)
  const blush = new THREE.Color(COLORS.blush)
  const color = new THREE.Color()
  const direction = new THREE.Vector3()
  const point = new THREE.Vector3()

  for (let i = 0; i < position.count; i++) {
    direction.fromBufferAttribute(position, i)
    shapeHead(direction, point)
    position.setXYZ(i, point.x, point.y, point.z)

    const cheek =
      point.z > 0 ? Math.max(blushAt(point, 0.5), blushAt(point, -0.5)) : 0
    color.lerpColors(skin, blush, cheek).toArray(colors, i * 3)
  }

  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))
  geometry.computeVertexNormals()
  return mesh(geometry, m.face)
}

function buildEye(m: Materials, side: number) {
  const eye = onFace(new THREE.Group(), side * 0.42, -0.03, -0.02)

  const lid = new THREE.Group()
  lid.add(mesh(ellipsoid(0.175, 0.15, 0.07), m.eyeWhite, 'none'))

  const iris = mesh(ellipsoid(0.105, 0.118, 0.05, 24), m.iris, 'none')
  iris.position.z = 0.04
  const glint = mesh(ellipsoid(0.03, 0.03, 0.012, 12), m.glint, 'none')
  glint.position.set(-0.035, 0.045, 0.048)
  iris.add(glint)
  lid.add(iris)
  eye.add(lid)
  return { eye, lid, iris }
}

function buildBrow(m: Materials, side: number) {
  const points = [
    [0.14, 0.44],
    [0.36, 0.47],
    [0.58, 0.465],
    [0.78, 0.42]
  ].map(([x, y]) => facePoint(side * x, y, 0.025).position)
  const geometry = taperedTube(
    points,
    t => 0.06 * (1 - 0.5 * t) * Math.min(1, 0.45 + t * 5),
    { center: ORIGIN, flatten: 0.45, segments: 18, radial: 10 }
  )
  return mesh(geometry, m.brow, 'none')
}

function buildMouth(m: Materials) {
  const mouth = new THREE.Group()
  mouth.add(
    onFace(
      mesh(ellipsoid(0.14, 0.05, 0.03, 24), m.lips, 'none'),
      0,
      -0.68,
      -0.016
    )
  )

  const smile = [
    [-0.12, -0.662],
    [0, -0.69],
    [0.12, -0.662]
  ].map(([x, y]) => facePoint(x, y, 0.012).position)
  mouth.add(
    mesh(
      taperedTube(
        smile,
        t => 0.014 * Math.sin(Math.PI * (0.08 + 0.84 * t)) ** 0.5,
        { center: ORIGIN, flatten: 0.6, segments: 16, radial: 8 }
      ),
      m.mouth,
      'none'
    )
  )
  return mouth
}

function buildEars(m: Materials) {
  const ears = new THREE.Group()
  for (const side of [-1, 1]) {
    const ear = mesh(ellipsoid(0.07, 0.18, 0.12, 20), m.skin)
    ear.position.set(side * 1.0, -0.2, -0.05)
    ear.rotation.set(0.05, side * -0.3, side * -0.1)
    ears.add(ear)
  }
  return ears
}


const LENS = { x: 0.47, y: -0.03, halfWidth: 0.4, top: 0.27, bottom: 0.28 }
const glassesZ = (x: number) => 0.98 - 0.16 * (x / 0.88) ** 2

function lensOutline(centerX: number) {
  const outline: THREE.Vector2[] = []
  for (let i = 0; i < 64; i++) {
    const t = (i / 64) * Math.PI * 2
    const c = Math.cos(t)
    const s = Math.sin(t)

    const n = s > 0 ? 4.2 : 2.7
    outline.push(
      new THREE.Vector2(
        centerX + LENS.halfWidth * Math.sign(c) * Math.abs(c) ** (2 / n),
        LENS.y +
          (s > 0 ? LENS.top : LENS.bottom) *
            Math.sign(s) *
            Math.abs(s) ** (2 / n)
      )
    )
  }
  return outline
}

function buildGlasses(m: Materials) {
  const glasses = new THREE.Group()
  for (const side of [-1, 1]) {
    const outline = lensOutline(side * LENS.x)
    const rim = new THREE.CatmullRomCurve3(
      outline.map(p => new THREE.Vector3(p.x, p.y, glassesZ(p.x))),
      true
    )
    glasses.add(
      mesh(new THREE.TubeGeometry(rim, 120, 0.042, 10, true), m.frame, 'cast')
    )

    const lens = new THREE.ShapeGeometry(new THREE.Shape(outline), 2)
    const position = lens.getAttribute('position')
    for (let i = 0; i < position.count; i++) {
      position.setZ(i, glassesZ(position.getX(i)) - 0.008)
    }
    lens.computeVertexNormals()
    glasses.add(mesh(lens, m.lens, 'none'))

    const temple = [
      new THREE.Vector3(side * 0.86, 0.09, glassesZ(0.86) - 0.02),
      new THREE.Vector3(side * 1.0, 0.08, 0.3),
      new THREE.Vector3(side * 1.04, 0.04, -0.25)
    ]
    glasses.add(
      mesh(
        taperedTube(temple, () => 0.028, { segments: 12, radial: 8 }),
        m.frame,
        'cast'
      )
    )
  }

  const bridge = [
    new THREE.Vector3(-0.08, 0.06, glassesZ(0.08)),
    new THREE.Vector3(0, 0.1, glassesZ(0) + 0.01),
    new THREE.Vector3(0.08, 0.06, glassesZ(0.08))
  ]
  glasses.add(
    mesh(
      taperedTube(bridge, () => 0.032, { segments: 12, radial: 8 }),
      m.frame,
      'cast'
    )
  )
  return glasses
}

const HAIRLINE: [number, number][] = [
  [0, 0.52],
  [0.4, 0.6],
  [0.8, 0.9],
  [1.1, 1.25],
  [1.25, 1.62],
  [1.36, 1.6],
  [1.46, 1.3],
  [1.75, 1.3],
  [2.25, 1.8],
  [Math.PI, 2.12]
]

function hairline(azimuth: number) {
  const a = Math.abs(azimuth)
  for (let i = 1; i < HAIRLINE.length; i++) {
    const [a1, p1] = HAIRLINE[i]
    if (a <= a1) {
      const [a0, p0] = HAIRLINE[i - 1]
      return lerp(p0, p1, smoothstep(0, 1, (a - a0) / (a1 - a0)))
    }
  }
  return HAIRLINE[HAIRLINE.length - 1][1]
}

function hairThickness(d: THREE.Vector3) {
  const top = smoothstep(0.1, 0.95, d.y)
  const front = smoothstep(-0.3, 0.75, d.z)
  const swept = smoothstep(0.3, -0.7, d.x)
  return 0.07 + top * (0.16 + 0.12 * front + 0.05 * swept)
}

function buildHairShell(m: Materials) {
  const columns = 96
  const rows = 36
  const positions: number[] = []
  const index: number[] = []
  const d = new THREE.Vector3()
  const p = new THREE.Vector3()

  for (let i = 0; i <= columns; i++) {
    const azimuth = -Math.PI + (i / columns) * Math.PI * 2
    const maxPolar = hairline(azimuth)
    for (let j = 0; j <= rows; j++) {
      const v = j / rows
      const polar = v * maxPolar
      d.set(
        Math.sin(polar) * Math.sin(azimuth),
        Math.cos(polar),
        Math.sin(polar) * Math.cos(azimuth)
      )

      const thickness = lerp(hairThickness(d), -0.015, smoothstep(0.82, 1, v))
      shapeHead(d, p).multiplyScalar(1 + thickness)
      positions.push(p.x, p.y, p.z)
    }
  }

  const stride = rows + 1
  for (let i = 0; i < columns; i++) {
    for (let j = 0; j < rows; j++) {
      const a = i * stride + j
      const b = (i + 1) * stride + j
      index.push(a, a + 1, b, b, a + 1, b + 1)
    }
  }

  const shell = new THREE.BufferGeometry()
  shell.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3))
  shell.setIndex(index)
  const geometry = mergeVertices(shell)
  geometry.computeVertexNormals()
  return mesh(geometry, m.hair)
}

type ClumpPoint = [number, number, number, number]

const CLUMPS: { points: ClumpPoint[]; radius: number }[] = [
  {
    radius: 0.2,
    points: [
      [0.5, 0.82, 0.3, 1],
      [0.15, 0.85, 0.5, 1],
      [-0.15, 0.72, 0.68, 0.9],
      [-0.32, 0.52, 0.8, 0.35],
      [-0.4, 0.38, 0.83, 0]
    ]
  },
  {
    radius: 0.22,
    points: [
      [0.6, 0.75, 0.15, 1],
      [0.2, 0.92, 0.35, 1],
      [-0.25, 0.85, 0.48, 1],
      [-0.6, 0.62, 0.48, 0.85],
      [-0.78, 0.45, 0.4, 0.6]
    ]
  },
  {
    radius: 0.22,
    points: [
      [0.62, 0.75, -0.1, 1],
      [0.2, 0.97, 0.05, 1],
      [-0.3, 0.9, 0.15, 1],
      [-0.7, 0.62, 0.2, 1],
      [-0.88, 0.4, 0.15, 0.85]
    ]
  },
  {
    radius: 0.2,
    points: [
      [0.6, 0.72, -0.4, 1],
      [0.15, 0.9, -0.35, 1],
      [-0.35, 0.82, -0.3, 1],
      [-0.75, 0.55, -0.2, 1]
    ]
  },
  {
    radius: 0.15,
    points: [
      [0.45, 0.85, 0.3, 1],
      [0.7, 0.65, 0.35, 1],
      [0.85, 0.42, 0.35, 0.9]
    ]
  },
  {
    radius: 0.15,
    points: [
      [0.5, 0.8, -0.2, 1],
      [0.78, 0.55, -0.15, 1],
      [0.92, 0.3, -0.12, 1]
    ]
  },
  {
    radius: 0.2,
    points: [
      [0.3, 0.85, -0.5, 1],
      [0, 0.6, -0.8, 1],
      [-0.1, 0.25, -0.95, 1]
    ]
  }
]

function buildHairClumps(m: Materials) {
  const clumps = new THREE.Group()
  const d = new THREE.Vector3()
  for (const [i, { points, radius }] of CLUMPS.entries()) {
    const flatten = i === 0 ? 0.5 : 0.38
    const sink = i === 0 ? 0 : radius * flatten * 0.45
    const curve = points.map(([x, y, z, onShell]) => {
      d.set(x, y, z).normalize()
      const lift = onShell * (hairThickness(d) - sink) + (1 - onShell) * 0.035
      return shapeHead(d, new THREE.Vector3()).multiplyScalar(1 + lift)
    })
    const geometry = taperedTube(
      curve,
      t => radius * Math.sin(Math.PI * (0.12 + 0.88 * t)) ** 0.7,
      { center: ORIGIN, flatten, segments: 28, radial: 12 }
    )
    clumps.add(mesh(geometry, m.hair))
  }
  return clumps
}

function buildHead(m: Materials) {
  const head = new THREE.Group()
  head.scale.setScalar(HEAD_RADIUS)
  const features = joinMeshes(
    new THREE.Group().add(
      buildSkull(m),
      buildHairShell(m),
      buildHairClumps(m),
      buildGlasses(m),
      onFace(mesh(ellipsoid(0.105, 0.085, 0.085, 24), m.skin), 0, -0.3, -0.005),
      buildMouth(m),
      buildBrow(m, -1),
      buildBrow(m, 1),
      buildEars(m)
    )
  )
  const eyes = [-1, 1].map(side => buildEye(m, side))
  head.add(features, ...eyes.map(e => e.eye))
  return { head, eyes }
}

const TORSO_PROFILE = [
  [0, 0],
  [0.19, 0],
  [0.205, 0.04],
  [0.215, 0.14],
  [0.225, 0.26],
  [0.22, 0.33],
  [0.2, 0.385],
  [0.155, 0.425],
  [0.09, 0.447],
  [0, 0.452]
]

function buildTorso(m: Materials) {
  const torso = new THREE.Group()
  const lathe = new THREE.LatheGeometry(
    TORSO_PROFILE.map(([r, y]) => new THREE.Vector2(r, y)),
    48
  )
  lathe.deleteAttribute('normal')
  lathe.deleteAttribute('uv')
  const body = mergeVertices(lathe)
  body.scale(1.15, 1, 0.74)
  body.computeVertexNormals()

  const collar = mesh(
    new THREE.CylinderGeometry(0.108, 0.122, 0.12, 32),
    m.sweater
  )
  collar.position.y = 0.47
  collar.scale.z = 0.88
  const roll = mesh(new THREE.TorusGeometry(0.104, 0.03, 12, 32), m.sweater)
  roll.rotation.x = Math.PI / 2
  roll.position.y = 0.53
  roll.scale.y = 0.88
  torso.add(
    joinMeshes(new THREE.Group().add(mesh(body, m.sweater), collar, roll))
  )

  const neck = new THREE.Group()
  neck.position.set(0, 0.52, 0.01)
  neck.rotation.order = 'YXZ'
  torso.add(neck)

  const shoulders = [-1, 1].map(side => {
    const anchor = new THREE.Object3D()
    anchor.position.set(side * 0.2, 0.37, 0)
    torso.add(anchor)
    return anchor
  })
  return { torso, neck, shoulders }
}

function buildLegs(m: Materials) {
  const legs = new THREE.Group()
  const floor = -SEAT_HEIGHT
  for (const side of [-1, 1]) {
    const hip = new THREE.Vector3(side * 0.1, 0.075, 0.02)
    const knee = new THREE.Vector3(side * 0.11, 0.07, 0.34)
    const ankle = new THREE.Vector3(side * 0.115, floor + 0.11, 0.37)
    const thigh = mesh(capsule(0.088, hip.distanceTo(knee)), m.jeans)
    spanBetween(thigh, hip, knee)
    const shin = mesh(capsule(0.075, knee.distanceTo(ankle)), m.jeans)
    spanBetween(shin, knee, ankle)
    const shoe = mesh(roundedBox(0.12, 0.085, 0.22, 0.04), m.sneaker)
    shoe.position.set(ankle.x, floor + 0.0725, ankle.z + 0.04)
    const sole = mesh(roundedBox(0.128, 0.03, 0.228, 0.012), m.sole)
    sole.position.set(ankle.x, floor + 0.015, ankle.z + 0.04)
    legs.add(thigh, shin, shoe, sole)
  }
  return joinMeshes(legs)
}

function buildArm(m: Materials, side: number) {
  const upper = mesh(capsule(0.064, UPPER_ARM), m.sweater)
  const lower = mesh(capsule(0.057, FOREARM), m.sweater)
  const hand = new THREE.Group()
  const palm = mesh(ellipsoid(0.052, 0.034, 0.062, 20), m.skin)
  palm.position.set(0, -0.005, 0.045)
  const thumb = mesh(capsule(0.017, 0.035, 10), m.skin)
  thumb.position.set(-side * 0.04, 0, 0.04)
  thumb.rotation.set(Math.PI / 2, 0, -side * 0.6)
  hand.add(palm, thumb)
  return {
    upper,
    lower,
    hand,
    elbow: new THREE.Vector3(),
    wrist: new THREE.Vector3()
  }
}

function buildPen(m: Materials) {
  const pen = new THREE.Group()
  const nib = mesh(new THREE.ConeGeometry(0.008, 0.022, 12), m.metal, 'none')
  nib.rotation.x = Math.PI
  nib.position.y = 0.011
  const body = mesh(
    new THREE.CylinderGeometry(0.009, 0.0085, PEN_LENGTH - 0.022, 12),
    m.pen
  )
  body.position.y = 0.022 + (PEN_LENGTH - 0.022) / 2
  const cap = mesh(
    new THREE.CylinderGeometry(0.0095, 0.0095, 0.02, 12),
    m.metal
  )
  cap.position.y = PEN_LENGTH - 0.01
  pen.add(nib, body, cap)
  return pen
}

export type CharacterPose = {
  penTip: THREE.Vector3
  leftHand: THREE.Vector3
  lookAt: THREE.Vector3
  focus: number
}

export function createCharacter(m: Materials) {
  const root = new THREE.Group()
  const { torso, neck, shoulders } = buildTorso(m)
  const { head, eyes } = buildHead(m)
  head.position.set(0, 0.3, 0.03)
  neck.add(head)

  const right = buildArm(m, -1)
  const left = buildArm(m, 1)
  const pen = buildPen(m)
  root.add(
    torso,
    buildLegs(m),
    right.upper,
    right.lower,
    right.hand,
    left.upper,
    left.lower,
    left.hand,
    pen
  )

  const state = { yaw: 0, pitch: 0.3, focus: 1, blinkIn: 2.5, blink: 0 }
  const v = {
    look: new THREE.Vector3(),
    neck: new THREE.Vector3(),
    shoulder: new THREE.Vector3(),
    tip: new THREE.Vector3(),
    target: new THREE.Vector3(),
    pole: new THREE.Vector3(),
    forward: new THREE.Vector3(),
    side: new THREE.Vector3(),
    up: new THREE.Vector3(),
    basis: new THREE.Matrix4()
  }

  function orientHand(hand: THREE.Object3D, forward: THREE.Vector3) {
    v.side.crossVectors(Y_AXIS, forward)
    if (v.side.lengthSq() < 1e-6) v.side.copy(X_AXIS)
    v.side.normalize()
    v.up.crossVectors(forward, v.side)
    v.basis.makeBasis(v.side, v.up, forward)
    hand.quaternion.setFromRotationMatrix(v.basis)
  }

  function solveArm(
    arm: ReturnType<typeof buildArm>,
    shoulder: THREE.Object3D,
    target: THREE.Vector3,
    poleOffset: THREE.Vector3
  ) {
    v.shoulder.copy(shoulder.position).applyMatrix4(torso.matrix)
    v.pole.copy(v.shoulder).add(poleOffset)
    solveTwoBoneIK(
      v.shoulder,
      target,
      UPPER_ARM,
      FOREARM,
      v.pole,
      arm.elbow,
      arm.wrist
    )
    spanBetween(arm.upper, v.shoulder, arm.elbow)
    spanBetween(arm.lower, arm.elbow, arm.wrist)
    arm.hand.position.copy(arm.wrist)
  }

  const rightPole = new THREE.Vector3(-0.4, -0.35, -0.1)
  const leftPole = new THREE.Vector3(0.4, -0.35, -0.1)
  const gripOffset = new THREE.Vector3(-0.03, 0.075, -0.07)

  function update(dt: number, time: number, pose: CharacterPose) {
    state.focus += (pose.focus - state.focus) * damp(4, dt)

    const breath = Math.sin(time * 1.6)
    torso.scale.set(1 + breath * 0.006, 1 + breath * 0.01, 1 + breath * 0.006)
    torso.rotation.x = lerp(0.04, 0.12, state.focus)
    torso.updateMatrix()
    root.updateWorldMatrix(true, false)

    v.look.copy(pose.lookAt)
    root.worldToLocal(v.look)
    v.neck.copy(neck.position).applyMatrix4(torso.matrix)
    v.look.sub(v.neck)
    const yaw = clamp(Math.atan2(v.look.x, v.look.z), -0.7, 0.7)
    const pitch =
      clamp(Math.atan2(-v.look.y, Math.hypot(v.look.x, v.look.z)), -0.35, 0.4) -
      torso.rotation.x
    const turn = damp(5, dt)
    state.yaw += (yaw - state.yaw) * turn
    state.pitch += (pitch - state.pitch) * turn
    neck.rotation.set(state.pitch, state.yaw, -state.yaw * 0.12)

    state.blinkIn -= dt
    if (state.blinkIn <= 0) {
      state.blink = 1
      state.blinkIn = 2 + Math.random() * 3.5
    }
    state.blink = Math.max(0, state.blink - dt / 0.16)
    const lids =
      lerp(1, 0.86, state.focus) * (1 - Math.sin(state.blink * Math.PI) * 0.92)
    for (const { lid, iris } of eyes) {
      lid.scale.y = lids
      iris.position.y = -0.022 * state.focus
    }

    v.tip.copy(pose.penTip)
    root.worldToLocal(v.tip)
    v.target.copy(v.tip).add(gripOffset)
    solveArm(right, shoulders[0], v.target, rightPole)
    v.forward
      .subVectors(right.wrist, right.elbow)
      .normalize()
      .lerp(v.side.subVectors(v.tip, right.wrist).normalize(), 0.45)
      .normalize()
    orientHand(right.hand, v.forward)

    v.forward.subVectors(right.wrist, v.tip).normalize()
    pen.position.copy(v.tip)
    pen.quaternion.setFromUnitVectors(Y_AXIS, v.forward)

    v.target.copy(pose.leftHand)
    root.worldToLocal(v.target)
    solveArm(left, shoulders[1], v.target, leftPole)
    v.forward.subVectors(left.wrist, left.elbow).setY(0).normalize()
    orientHand(left.hand, v.forward)
  }

  return { root, update }
}

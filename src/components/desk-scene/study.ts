import * as THREE from 'three'

import { SEAT_HEIGHT } from './character'
import {
  canvasTexture,
  ellipsoid,
  joinMeshes,
  mesh,
  roundedBox,
  spanBetween
} from './helpers'
import { COLORS, type Materials } from './materials'

export const DESK_HEIGHT = 0.72
export const CHAIR_Z = -0.16

function leg(
  top: THREE.Vector3,
  bottom: THREE.Vector3,
  material: THREE.Material,
  radius = 0.024
) {
  const geometry = new THREE.CylinderGeometry(
    radius,
    radius * 0.7,
    top.distanceTo(bottom),
    14
  )
  const result = mesh(geometry, material)
  spanBetween(result, bottom, top)
  return result
}

function buildDesk(m: Materials) {
  const desk = new THREE.Group()
  const top = mesh(roundedBox(1.24, 0.045, 0.62, 0.016), m.walnut)
  top.position.set(0, DESK_HEIGHT - 0.0225, 0.3)
  const back = mesh(roundedBox(1.08, 0.07, 0.022, 0.006), m.walnut)
  back.position.set(0, DESK_HEIGHT - 0.08, 0.56)
  desk.add(top, back)
  for (const sx of [-1, 1]) {
    const end = mesh(roundedBox(0.022, 0.07, 0.5, 0.006), m.walnut)
    end.position.set(sx * 0.54, DESK_HEIGHT - 0.08, 0.3)
    desk.add(end)
    for (const sz of [-1, 1]) {
      desk.add(
        leg(
          new THREE.Vector3(sx * 0.54, DESK_HEIGHT - 0.045, 0.3 + sz * 0.24),
          new THREE.Vector3(sx * 0.58, 0, 0.3 + sz * 0.28),
          m.walnut
        )
      )
    }
  }
  return desk
}

function buildChair(m: Materials) {
  const chair = new THREE.Group()
  chair.position.z = CHAIR_Z
  const seat = mesh(roundedBox(0.46, 0.05, 0.44, 0.02), m.oak)
  seat.position.y = SEAT_HEIGHT - 0.025
  chair.add(seat)
  for (const sx of [-1, 1]) {
    for (const sz of [-1, 1]) {
      chair.add(
        leg(
          new THREE.Vector3(sx * 0.19, SEAT_HEIGHT - 0.05, sz * 0.18),
          new THREE.Vector3(sx * 0.21, 0, sz * 0.2),
          m.oak,
          0.02
        )
      )
    }
    chair.add(
      leg(
        new THREE.Vector3(sx * 0.19, SEAT_HEIGHT + 0.44, -0.235),
        new THREE.Vector3(sx * 0.19, SEAT_HEIGHT - 0.02, -0.19),
        m.oak,
        0.018
      )
    )
  }
  const backrest = mesh(roundedBox(0.46, 0.13, 0.035, 0.015), m.oak)
  backrest.position.set(0, SEAT_HEIGHT + 0.36, -0.225)
  backrest.rotation.x = -0.08
  chair.add(backrest)
  return chair
}

function buildLamp(m: Materials) {
  const lamp = new THREE.Group()
  const base = new THREE.Vector3(0.5, DESK_HEIGHT, 0.1)
  const elbow = new THREE.Vector3(0.55, DESK_HEIGHT + 0.33, 0.05)
  const head = new THREE.Vector3(0.27, DESK_HEIGHT + 0.4, 0.27)
  const aim = new THREE.Vector3(-0.02, DESK_HEIGHT, 0.31)

  const foot = mesh(new THREE.CylinderGeometry(0.07, 0.078, 0.024, 28), m.lamp)
  foot.position.set(base.x, base.y + 0.012, base.z)
  lamp.add(
    foot,
    leg(elbow, base.clone().setY(DESK_HEIGHT + 0.02), m.lamp, 0.012),
    leg(head, elbow, m.lamp, 0.011)
  )
  for (const joint of [elbow, head]) {
    const ball = mesh(new THREE.SphereGeometry(0.02, 16, 12), m.lamp)
    ball.position.copy(joint)
    lamp.add(ball)
  }

  const shade = new THREE.Group()
  shade.position.copy(head)
  shade.quaternion.setFromUnitVectors(
    new THREE.Vector3(0, -1, 0),
    aim.clone().sub(head).normalize()
  )
  const profile = [
    [0.014, 0.012],
    [0.03, 0],
    [0.052, -0.03],
    [0.068, -0.07],
    [0.074, -0.095]
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const bell = new THREE.MeshStandardMaterial({
    color: COLORS.lamp,
    roughness: 0.4,
    side: THREE.DoubleSide
  })
  shade.add(mesh(new THREE.LatheGeometry(profile, 32), bell))
  const bulb = mesh(new THREE.SphereGeometry(0.026, 16, 12), m.bulb, 'none')
  bulb.position.y = -0.05
  shade.add(bulb)
  lamp.add(shade)
  lamp.updateMatrixWorld(true)

  const bulbPosition = bulb.getWorldPosition(new THREE.Vector3())
  const spot = new THREE.SpotLight(0xffc27a, 0, 0, 0.85, 0.75, 2)
  spot.position.copy(bulbPosition)
  spot.target.position.copy(aim)
  spot.castShadow = true
  spot.shadow.mapSize.set(1024, 1024)
  spot.shadow.camera.near = 0.05
  spot.shadow.camera.far = 3
  spot.shadow.bias = -0.0006
  spot.shadow.normalBias = 0.01
  spot.shadow.radius = 4
  const glow = new THREE.PointLight(0xffb36b, 0, 2.6, 2)
  glow.position.copy(bulbPosition)
  lamp.add(spot, spot.target, glow)
  return { lamp, spot, glow }
}

function buildMug(m: Materials) {
  const mug = new THREE.Group()
  const profile = [
    [0, 0],
    [0.042, 0],
    [0.047, 0.004],
    [0.047, 0.098],
    [0.044, 0.1],
    [0.041, 0.096],
    [0.041, 0.012],
    [0, 0.012]
  ].map(([x, y]) => new THREE.Vector2(x, y))
  const coffee = mesh(new THREE.CircleGeometry(0.041, 24), m.coffee, 'receive')
  coffee.rotation.x = -Math.PI / 2
  coffee.position.y = 0.078
  const handle = mesh(
    new THREE.TorusGeometry(0.028, 0.008, 8, 20, Math.PI),
    m.mug
  )
  handle.position.set(0.047, 0.052, 0)
  handle.rotation.z = -Math.PI / 2
  mug.add(mesh(new THREE.LatheGeometry(profile, 32), m.mug), coffee, handle)

  const puffTexture = canvasTexture(64, 64, (ctx, width, height) => {
    const puff = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    puff.addColorStop(0, 'rgba(255, 255, 255, 1)')
    puff.addColorStop(1, 'rgba(255, 255, 255, 0)')
    ctx.fillStyle = puff
    ctx.fillRect(0, 0, width, height)
  })
  const steam = Array.from({ length: 4 }, (_, i) => {
    const puff = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: puffTexture,
        transparent: true,
        opacity: 0,
        depthWrite: false
      })
    )
    puff.userData.phase = i / 4
    mug.add(puff)
    return puff
  })
  return { mug, steam }
}

function flatBook(
  width: number,
  thickness: number,
  depth: number,
  color: number,
  m: Materials
) {
  const book = new THREE.Group()
  const board = 0.005
  const cover = m.bookCover(color)
  for (const y of [board / 2, thickness - board / 2]) {
    const plate = mesh(roundedBox(width, board, depth, 0.002), cover)
    plate.position.y = y
    book.add(plate)
  }
  const spine = mesh(roundedBox(board * 1.6, thickness, depth, 0.002), cover)
  spine.position.set(-width / 2 + board * 0.8, thickness / 2, 0)
  const pages = mesh(
    new THREE.BoxGeometry(width - 0.012, thickness - board * 2, depth - 0.01),
    m.pageEdge
  )
  pages.position.set(0.002, thickness / 2, 0)
  book.add(spine, pages)
  return book
}

function buildSucculent(m: Materials) {
  const plant = new THREE.Group()
  const pot = mesh(new THREE.CylinderGeometry(0.045, 0.034, 0.065, 20), m.pot)
  pot.position.y = 0.0325
  const soil = mesh(new THREE.CircleGeometry(0.04, 20), m.coffee, 'receive')
  soil.rotation.x = -Math.PI / 2
  soil.position.y = 0.063
  plant.add(pot, soil)
  for (let i = 0; i < 9; i++) {
    const angle = (i / 9) * Math.PI * 2 + (i % 2) * 0.3
    const inner = i % 3 === 0
    const leaf = mesh(
      ellipsoid(0.016, 0.042, 0.011, 12),
      inner ? m.leafLight : m.leaf
    )
    leaf.position.set(
      Math.cos(angle) * (inner ? 0.008 : 0.022),
      0.088,
      Math.sin(angle) * (inner ? 0.008 : 0.022)
    )
    leaf.rotation.set(0, -angle, inner ? 0.25 : 0.75)
    leaf.rotation.order = 'YXZ'
    plant.add(leaf)
  }
  return plant
}

export function createStudy(m: Materials) {
  const group = new THREE.Group()
  const { lamp, spot, glow } = buildLamp(m)
  const { mug, steam } = buildMug(m)
  mug.position.set(-0.43, DESK_HEIGHT, 0.3)
  mug.rotation.y = 0.4

  const books = new THREE.Group()
  books.position.set(0.42, DESK_HEIGHT, 0.5)
  let y = 0
  for (const [w, t, d, color, turn] of [
    [0.24, 0.042, 0.17, COLORS.books[2], 0.05],
    [0.21, 0.036, 0.155, COLORS.books[1], -0.1],
    [0.2, 0.03, 0.15, COLORS.books[4], 0.16]
  ]) {
    const book = flatBook(w, t, d, color, m)
    book.position.y = y
    book.rotation.y = turn
    books.add(book)
    y += t
  }

  const succulent = buildSucculent(m)
  succulent.position.set(-0.47, DESK_HEIGHT, 0.52)

  const rug = new THREE.Group()
  rug.position.set(0, 0, 0.12)
  rug.scale.z = 0.82
  const outer = mesh(
    new THREE.CylinderGeometry(1.02, 1.02, 0.014, 72),
    m.rug,
    'receive'
  )
  outer.position.y = 0.007
  const inner = mesh(
    new THREE.CylinderGeometry(0.84, 0.84, 0.016, 72),
    m.rugInner,
    'receive'
  )
  inner.position.y = 0.008
  const center = mesh(
    new THREE.CylinderGeometry(0.68, 0.68, 0.018, 72),
    m.rug,
    'receive'
  )
  center.position.y = 0.009
  rug.add(outer, inner, center)

  group.add(
    joinMeshes(
      new THREE.Group().add(
        buildDesk(m),
        buildChair(m),
        lamp,
        mug,
        books,
        succulent,
        rug
      )
    )
  )

  function update(time: number) {
    for (const puff of steam) {
      const phase: number = puff.userData.phase
      const p = (time * 0.28 + phase) % 1
      puff.position.set(
        Math.sin(p * 5 + phase * 9) * 0.016,
        0.11 + p * 0.22,
        Math.cos(p * 4 + phase * 7) * 0.012
      )
      puff.scale.setScalar(0.04 + p * 0.07)
      puff.material.opacity = Math.sin(p * Math.PI) * 0.5
    }
  }

  return { group, spot, glow, update }
}

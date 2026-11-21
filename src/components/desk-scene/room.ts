import * as THREE from 'three'

import {
  canvasTexture,
  joinMeshes,
  mesh,
  random,
  roundedBox,
  taperedTube
} from './helpers'
import { COLORS, type Materials } from './materials'

const ROOM = { half: 1.35, height: 2.05, wall: 0.12, slab: 0.2 }

function plankTexture() {
  return canvasTexture(512, 512, (ctx, width, height) => {
    const rand = random(11)
    const planks = 8
    const plankWidth = width / planks
    for (let i = 0; i < planks; i++) {
      let y = -rand() * height * 0.6
      while (y < height) {
        const length = height * (0.45 + rand() * 0.4)
        ctx.fillStyle = `hsl(${28 + rand() * 6}, ${46 + rand() * 8}%, ${64 + rand() * 7}%)`
        ctx.fillRect(i * plankWidth, y, plankWidth, length)
        ctx.strokeStyle = 'rgba(110, 70, 38, 0.12)'
        ctx.lineWidth = 1.5
        for (let g = 0; g < 5; g++) {
          const x = i * plankWidth + 6 + rand() * (plankWidth - 12)
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.bezierCurveTo(
            x + 4,
            y + length / 3,
            x - 4,
            y + (2 * length) / 3,
            x,
            y + length
          )
          ctx.stroke()
        }
        ctx.fillStyle = 'rgba(90, 55, 30, 0.35)'
        ctx.fillRect(i * plankWidth, y, plankWidth, 2)
        y += length
      }
      ctx.fillStyle = 'rgba(90, 55, 30, 0.4)'
      ctx.fillRect(i * plankWidth, 0, 2, height)
    }
  })
}

function skyTexture(night: boolean) {
  return canvasTexture(256, 256, (ctx, width, height) => {
    const rand = random(night ? 5 : 3)
    const sky = ctx.createLinearGradient(0, 0, 0, height)
    sky.addColorStop(0, night ? '#0e1736' : '#7dbdf0')
    sky.addColorStop(1, night ? '#2c3d70' : '#d6edfb')
    ctx.fillStyle = sky
    ctx.fillRect(0, 0, width, height)

    if (night) {
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < 60; i++) {
        ctx.globalAlpha = 0.4 + rand() * 0.6
        ctx.beginPath()
        ctx.arc(
          rand() * width,
          rand() * height * 0.75,
          0.6 + rand() * 1.3,
          0,
          Math.PI * 2
        )
        ctx.fill()
      }
      ctx.globalAlpha = 1
      ctx.fillStyle = '#fff6d8'
      ctx.beginPath()
      ctx.arc(width * 0.68, height * 0.28, 26, 0, Math.PI * 2)
      ctx.fill()
      ctx.fillStyle = '#16224a'
      ctx.beginPath()
      ctx.arc(width * 0.68 + 12, height * 0.28 - 8, 23, 0, Math.PI * 2)
      ctx.fill()
    } else {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      for (const [cx, cy, s] of [
        [0.3, 0.25, 1],
        [0.75, 0.42, 0.75]
      ]) {
        for (const [dx, dy, r] of [
          [-28, 6, 18],
          [0, 0, 26],
          [26, 6, 18],
          [12, -12, 18]
        ]) {
          ctx.beginPath()
          ctx.arc(
            cx * width + dx * s,
            cy * height + dy * s,
            r * s,
            0,
            Math.PI * 2
          )
          ctx.fill()
        }
      }
    }

    for (const [base, color] of [
      [0.78, night ? '#1d2c48' : '#a9d39b'],
      [0.88, night ? '#16223a' : '#86bd7c']
    ] as const) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, height)
      for (let x = 0; x <= width; x += 8) {
        ctx.lineTo(
          x,
          height * base - Math.sin(x / 38 + base * 20) * 10 - rand() * 2
        )
      }
      ctx.lineTo(width, height)
      ctx.fill()
    }
  })
}

function artTexture() {
  return canvasTexture(192, 240, (ctx, width, height) => {
    ctx.fillStyle = '#f1e6d2'
    ctx.fillRect(0, 0, width, height)
    ctx.fillStyle = '#e59f63'
    ctx.beginPath()
    ctx.arc(width * 0.62, height * 0.36, 30, 0, Math.PI * 2)
    ctx.fill()
    for (const [base, amplitude, color] of [
      [0.62, 26, '#9fbfa0'],
      [0.74, 18, '#5d8a76'],
      [0.86, 12, '#3f6b5c']
    ] as const) {
      ctx.fillStyle = color
      ctx.beginPath()
      ctx.moveTo(0, height)
      for (let x = 0; x <= width; x += 6) {
        ctx.lineTo(x, height * base - Math.sin(x / 30 + base * 9) * amplitude)
      }
      ctx.lineTo(width, height)
      ctx.fill()
    }
  })
}

function buildWindow(m: Materials) {
  const { half } = ROOM
  const group = new THREE.Group()
  group.position.set(half, 1.3, -0.3)
  const width = 0.82
  const height = 0.8

  const pane = (texture: THREE.Texture, opacity: number, inset: number) => {
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      opacity,
      toneMapped: false
    })
    const plane = mesh(new THREE.PlaneGeometry(width, height), material, 'none')
    plane.rotation.y = -Math.PI / 2
    plane.position.x = -inset
    group.add(plane)
    return material
  }
  pane(skyTexture(false), 1, 0.004)
  const night = pane(skyTexture(true), 0, 0.007)

  const bar = (
    x: number,
    y: number,
    z: number,
    d: number,
    h: number,
    w: number
  ) => {
    const part = mesh(roundedBox(d, h, w, Math.min(d, h, w) * 0.3), m.trim)
    part.position.set(x, y, z)
    group.add(part)
  }
  bar(-0.03, height / 2 + 0.025, 0, 0.06, 0.05, width + 0.1)
  bar(-0.03, -height / 2 - 0.025, 0, 0.06, 0.05, width + 0.1)
  for (const side of [-1, 1])
    bar(-0.03, 0, side * (width / 2 + 0.025), 0.06, height, 0.05)
  bar(-0.02, 0, 0, 0.04, height, 0.03)
  bar(-0.02, 0.06, 0, 0.04, 0.03, width)
  bar(-0.07, -height / 2 - 0.065, 0, 0.14, 0.03, width + 0.18)
  return { group, night }
}

function buildArt(m: Materials) {
  const { half } = ROOM
  const art = new THREE.Group()
  art.position.set(0.72, 1.4, -half)
  const frame = mesh(roundedBox(0.44, 0.54, 0.03, 0.008), m.walnut)
  frame.position.z = 0.015
  const print = mesh(
    new THREE.PlaneGeometry(0.36, 0.46),
    new THREE.MeshStandardMaterial({ map: artTexture(), roughness: 0.9 }),
    'receive'
  )
  print.position.z = 0.032
  art.add(frame, print)
  return art
}

function standingBook(
  m: Materials,
  thickness: number,
  height: number,
  depth: number,
  color: number
) {
  const book = new THREE.Group()
  const cover = mesh(
    roundedBox(thickness, height, depth, 0.004),
    m.bookCover(color)
  )
  cover.position.y = height / 2
  const pages = mesh(
    new THREE.BoxGeometry(thickness * 0.78, 0.003, depth * 0.9),
    m.pageEdge,
    'receive'
  )
  pages.position.set(0, height + 0.0005, -depth * 0.03)
  book.add(cover, pages)
  return book
}

function buildShelf(m: Materials) {
  const { half } = ROOM
  const shelf = new THREE.Group()
  shelf.position.set(-0.6, 0, -half)
  const rand = random(23)
  const width = 0.9

  for (const y of [1.12, 1.55]) {
    const plank = mesh(roundedBox(width, 0.035, 0.22, 0.008), m.oak)
    plank.position.set(0, y, 0.11)
    shelf.add(plank)
    for (const side of [-1, 1]) {
      const bracket = mesh(roundedBox(0.025, 0.09, 0.16, 0.006), m.trim)
      bracket.position.set(side * width * 0.38, y - 0.06, 0.08)
      shelf.add(bracket)
    }

    let x = -width / 2 + 0.05
    const end = width / 2 - (y > 1.4 ? 0.24 : 0.06)
    while (x < end) {
      const thickness = 0.03 + rand() * 0.028
      const height = 0.16 + rand() * 0.1
      const color = COLORS.books[Math.floor(rand() * COLORS.books.length)]
      const book = standingBook(
        m,
        thickness,
        height,
        0.15 + rand() * 0.03,
        color
      )
      book.position.set(x + thickness / 2, y + 0.0175, 0.11)
      if (rand() < 0.12 && x > -width / 2 + 0.2) {
        book.rotation.z = -0.32
        book.position.x += height * 0.16
        x += height * 0.32
      }
      shelf.add(book)
      x += thickness + 0.003
    }
  }

  const pot = mesh(new THREE.CylinderGeometry(0.06, 0.045, 0.1, 20), m.pot)
  pot.position.set(width / 2 - 0.12, 1.55 + 0.0675, 0.11)
  shelf.add(pot)
  for (let i = 0; i < 6; i++) {
    const angle = (i / 6) * Math.PI * 2
    const vine = taperedTube(
      [
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(
          Math.cos(angle) * 0.06,
          0.04,
          Math.sin(angle) * 0.05 + 0.02
        ),
        new THREE.Vector3(
          Math.cos(angle) * 0.09,
          -0.08 - (i % 3) * 0.05,
          Math.sin(angle) * 0.07 + 0.04
        )
      ],
      t => 0.018 * Math.sin(Math.PI * (0.1 + 0.9 * t)) ** 0.6,
      { flatten: 0.35, segments: 14, radial: 8 }
    )
    const leaf = mesh(vine, i % 2 ? m.leaf : m.leafLight)
    leaf.position.set(pot.position.x, pot.position.y + 0.05, pot.position.z)
    shelf.add(leaf)
  }
  return shelf
}

function buildFloorPlant(m: Materials) {
  const { half } = ROOM
  const plant = new THREE.Group()
  plant.position.set(-half + 0.28, 0, -half + 0.3)
  const profile = [
    [0, 0],
    [0.11, 0],
    [0.125, 0.02],
    [0.15, 0.28],
    [0.165, 0.3],
    [0.165, 0.33],
    [0.145, 0.33],
    [0.14, 0.31],
    [0, 0.31]
  ].map(([x, y]) => new THREE.Vector2(x, y))
  plant.add(mesh(new THREE.LatheGeometry(profile, 32), m.pot))

  const rand = random(31)
  for (let i = 0; i < 10; i++) {
    const angle = (i / 10) * Math.PI * 2 + rand() * 0.4
    const lean = 0.04 + rand() * 0.12
    const tall = 0.45 + rand() * 0.35
    const out = new THREE.Vector3(Math.cos(angle), 0, Math.sin(angle))
    const blade = taperedTube(
      [
        new THREE.Vector3(0, 0.3, 0).addScaledVector(out, 0.03),
        new THREE.Vector3(0, 0.3 + tall * 0.5, 0).addScaledVector(
          out,
          lean * 0.6
        ),
        new THREE.Vector3(0, 0.3 + tall, 0).addScaledVector(out, lean * 1.6)
      ],
      t => 0.035 * Math.sin(Math.PI * (0.06 + 0.94 * t)) ** 0.8,
      { flatten: 0.22, up: out, segments: 16, radial: 8 }
    )
    plant.add(mesh(blade, i % 3 ? m.leaf : m.leafLight))
  }
  return plant
}

export function createRoom(m: Materials) {
  const { half, height, wall, slab } = ROOM
  const group = new THREE.Group()

  const floorTop = new THREE.MeshStandardMaterial({
    map: plankTexture(),
    roughness: 0.7
  })
  const floor = mesh(
    new THREE.BoxGeometry(2 * half + wall, slab, 2 * half + wall),
    [m.slab, m.slab, floorTop, m.slab, m.slab, m.slab],
    'receive'
  )
  floor.position.set(wall / 2, -slab / 2, -wall / 2)

  const { wall: paint, slab: cut } = m
  const back = mesh(
    new THREE.BoxGeometry(2 * half + wall, height, wall),
    [paint, cut, cut, paint, paint, paint],
    'receive'
  )
  back.position.set(wall / 2, height / 2, -half - wall / 2)
  const right = mesh(
    new THREE.BoxGeometry(wall, height, 2 * half),
    [paint, paint, cut, paint, cut, paint],
    'receive'
  )
  right.position.set(half + wall / 2, height / 2, 0)

  const skirtBack = mesh(roundedBox(2 * half, 0.08, 0.025, 0.006), m.skirting)
  skirtBack.position.set(0, 0.04, -half + 0.0125)
  const skirtRight = mesh(roundedBox(0.025, 0.08, 2 * half, 0.006), m.skirting)
  skirtRight.position.set(half - 0.0125, 0.04, 0)

  const windowFrame = buildWindow(m)
  group.add(
    floor,
    back,
    right,
    skirtBack,
    skirtRight,
    windowFrame.group,
    buildArt(m),
    buildShelf(m),
    buildFloorPlant(m)
  )
  joinMeshes(group)
  return { group, nightSky: windowFrame.night }
}

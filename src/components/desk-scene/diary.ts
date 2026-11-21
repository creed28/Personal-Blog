import * as THREE from 'three'

import { mesh, random, roundedBox, taperedTube } from './helpers'
import type { Materials } from './materials'

const PAGE_W = 0.22
const PAGE_H = 0.3
const COVER = 0.008
const LINES = 8
const BASELINES = Array.from({ length: LINES }, (_, i) => 0.16 + i * 0.096)
const TEX_W = 256
const TEX_H = 352
const WRITE_SPEED = 0.1
const TRAVEL_SPEED = 0.28
const FLIP_TIME = 1.3
const PEN_LIFT = 0.014

function pageHeight(s: number) {
  const rise = 1 - (1 - Math.min(1, s / 0.28)) ** 2
  return 0.004 + 0.013 * rise - 0.004 * s * s
}

type PenPoint = { u: number; v: number; down: boolean }

function scriptLine(rand: () => number, line: number): PenPoint[] {
  const baseline = BASELINES[line]
  const end = line === LINES - 1 ? 0.5 + rand() * 0.25 : 0.8 + rand() * 0.1
  const points: PenPoint[] = []
  let u = line === 0 ? 0.16 : 0.1

  while (u < end) {
    const letters = 2 + Math.floor(rand() * 5)
    for (let k = 0; k < letters; k++) {
      const width = 0.028 + rand() * 0.016
      const kind = rand()
      const height =
        kind < 0.16 ? 0.07 : kind < 0.26 ? -0.055 : 0.032 + rand() * 0.012
      const loop = kind < 0.26 ? 1.15 : 0.35 + rand() * 0.75
      for (let s = k === 0 ? 0 : 1; s <= 12; s++) {
        const t = (s / 12) * Math.PI * 2
        const rise = (height * (1 - Math.cos(t))) / 2
        points.push({
          u:
            u +
            (width * t) / (Math.PI * 2) +
            loop * width * 0.28 * Math.sin(t) +
            rise * 0.3,
          v: baseline - rise,
          down: true
        })
      }
      u += width
    }
    u += 0.03 + rand() * 0.025
    points.push({ u, v: baseline, down: false })
  }
  return points
}

function createPaper(anisotropy: number, spine: 'left' | 'right') {
  const canvas = document.createElement('canvas')
  canvas.width = TEX_W
  canvas.height = TEX_H
  const ctx = canvas.getContext('2d')!
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  texture.anisotropy = anisotropy

  const clear = () => {
    ctx.fillStyle = '#f8f2e4'
    ctx.fillRect(0, 0, TEX_W, TEX_H)
    const from = spine === 'left' ? 0 : TEX_W
    const gutter = ctx.createLinearGradient(
      from,
      0,
      from + (spine === 'left' ? 1 : -1) * TEX_W * 0.3,
      0
    )
    gutter.addColorStop(0, 'rgba(120, 92, 60, 0.3)')
    gutter.addColorStop(1, 'rgba(120, 92, 60, 0)')
    ctx.fillStyle = gutter
    ctx.fillRect(0, 0, TEX_W, TEX_H)
    ctx.fillStyle = '#c3d2e6'
    for (const v of BASELINES)
      ctx.fillRect(TEX_W * 0.06, v * TEX_H, TEX_W * 0.88, 1.5)
    texture.needsUpdate = true
  }
  clear()
  ctx.strokeStyle = '#1f2a5c'
  ctx.lineWidth = 2.6
  ctx.lineCap = 'round'
  ctx.lineJoin = 'round'
  const ink = { dirty: false }
  return { canvas, ctx, texture, clear, ink }
}

type Paper = ReturnType<typeof createPaper>

const paperMaterial = (paper: Paper, side: THREE.Side = THREE.FrontSide) =>
  new THREE.MeshStandardMaterial({ map: paper.texture, roughness: 0.92, side })

function pageSurface(side: -1 | 1, material: THREE.Material) {
  const geometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 24, 1)
  geometry.rotateX(-Math.PI / 2)
  geometry.translate((side * PAGE_W) / 2, 0, 0)
  const position = geometry.getAttribute('position')
  for (let i = 0; i < position.count; i++) {
    const s = Math.abs(position.getX(i)) / PAGE_W
    position.setY(i, COVER + pageHeight(s) + 0.0006)
  }
  geometry.computeVertexNormals()
  return mesh(geometry, material, 'receive')
}

function pageBlock(side: -1 | 1, material: THREE.Material) {
  const shape = new THREE.Shape()
  shape.moveTo(0, 0)
  for (let i = 0; i <= 20; i++) {
    const s = i / 20
    shape.lineTo(side * s * PAGE_W, pageHeight(s))
  }
  shape.lineTo(side * PAGE_W, 0)
  shape.closePath()
  const geometry = new THREE.ExtrudeGeometry(shape, {
    depth: PAGE_H,
    bevelEnabled: false
  })
  geometry.translate(0, COVER, -PAGE_H / 2)
  return mesh(geometry, material)
}

export function createDiary(m: Materials, anisotropy: number) {
  const group = new THREE.Group()
  const rand = random(1987)

  const pages = [
    createPaper(anisotropy, 'right'),
    createPaper(anisotropy, 'left')
  ]
  const leafFront = createPaper(anisotropy, 'left')
  const leafBack = createPaper(anisotropy, 'left')

  for (const side of [-1, 1] as const) {
    const cover = mesh(
      roundedBox(PAGE_W + 0.014, COVER, PAGE_H + 0.02, 0.003),
      m.diary
    )
    cover.position.set(side * (PAGE_W / 2 + 0.005), COVER / 2, 0)
    group.add(
      cover,
      pageBlock(side, m.pageEdge),
      pageSurface(side, paperMaterial(pages[side < 0 ? 0 : 1]))
    )
  }
  const spine = mesh(
    roundedBox(0.024, COVER * 0.9, PAGE_H + 0.02, 0.003),
    m.diary
  )
  spine.position.y = COVER * 0.45

  const ribbon = mesh(
    taperedTube(
      [
        new THREE.Vector3(0.012, COVER + pageHeight(0.05) + 0.002, -0.06),
        new THREE.Vector3(
          0.02,
          COVER + pageHeight(0.09) + 0.002,
          -PAGE_H / 2 + 0.005
        ),
        new THREE.Vector3(0.026, COVER + 0.004, -PAGE_H / 2 - 0.018),
        new THREE.Vector3(0.03, 0.002, -PAGE_H / 2 - 0.065)
      ],
      () => 0.0075,
      { flatten: 0.18, segments: 20, radial: 8 }
    ),
    m.ribbon
  )
  group.add(spine, ribbon)

  const leafGeometry = new THREE.PlaneGeometry(PAGE_W, PAGE_H, 24, 1)
  leafGeometry.rotateX(-Math.PI / 2)
  leafGeometry.translate(PAGE_W / 2, 0, 0)
  const leafPosition = leafGeometry.getAttribute('position')
  const restX = Float32Array.from({ length: leafPosition.count }, (_, i) =>
    leafPosition.getX(i)
  )
  const leaf = new THREE.Group()
  leaf.add(
    mesh(leafGeometry, paperMaterial(leafFront), 'receive'),
    mesh(leafGeometry, paperMaterial(leafBack, THREE.BackSide), 'receive')
  )
  leaf.visible = false
  group.add(leaf)

  const leafPoint = (
    s: number,
    z: number,
    angle: number,
    out: THREE.Vector3
  ) => {
    const a = angle - 0.6 * Math.sin(angle) * s ** 1.5
    const r = s * PAGE_W
    return out.set(
      r * Math.cos(a),
      r * Math.sin(a) + COVER + pageHeight(s) + 0.0015,
      z
    )
  }

  const bent = new THREE.Vector3()
  function bendLeaf(angle: number) {
    for (let i = 0; i < leafPosition.count; i++) {
      leafPoint(restX[i] / PAGE_W, leafPosition.getZ(i), angle, bent)
      leafPosition.setXYZ(i, bent.x, bent.y, bent.z)
    }
    leafPosition.needsUpdate = true
    leafGeometry.computeVertexNormals()
    leafGeometry.computeBoundingSphere()
  }

  let page = 1
  let line = 0
  let script: PenPoint[] = []
  let index = 0
  let penDown = false
  let lift = PEN_LIFT
  let wait = 0
  let flip = -1
  const pen = { u: 0.1, v: BASELINES[0] }

  const stroke = (
    paper: Paper,
    u0: number,
    v0: number,
    u1: number,
    v1: number
  ) => {
    paper.ctx.beginPath()
    paper.ctx.moveTo(u0 * TEX_W, v0 * TEX_H)
    paper.ctx.lineTo(u1 * TEX_W, v1 * TEX_H)
    paper.ctx.stroke()
    paper.ink.dirty = true
  }
  let sinceUpload = 0

  function startLine() {
    script = scriptLine(rand, line)
    index = 0
    penDown = false
  }

  function nextLine() {
    line += 1
    if (line < LINES) return startLine()
    if (page === 0) {
      page = 1
      line = 0
      return startLine()
    }
    leafFront.ctx.drawImage(pages[1].canvas, 0, 0)
    leafFront.texture.needsUpdate = true
    pages[1].clear()
    bendLeaf(0)
    leaf.visible = true
    flip = 0
    wait = 0.35
  }

  function write(time: number) {
    while (time > 0 && flip < 0) {
      const next = script[index]
      const drawing = penDown && next.down
      const du = next.u - pen.u
      const dv = next.v - pen.v
      const needed =
        Math.hypot(du * PAGE_W, dv * PAGE_H) /
        (drawing ? WRITE_SPEED : TRAVEL_SPEED)
      const k = needed <= time ? 1 : time / needed
      const u = pen.u + du * k
      const v = pen.v + dv * k
      if (drawing) stroke(pages[page], pen.u, pen.v, u, v)
      pen.u = u
      pen.v = v
      time -= needed * k
      if (k === 1) {
        penDown = next.down
        index += 1
        if (index >= script.length) nextLine()
      }
    }
  }

  for (let l = 0; l < LINES + 3; l++) {
    const paper = pages[l < LINES ? 0 : 1]
    const points = scriptLine(rand, l % LINES)
    for (let i = 1; i < points.length; i++) {
      const [a, b] = [points[i - 1], points[i]]
      if (a.down && b.down) stroke(paper, a.u, a.v, b.u, b.v)
    }
  }
  line = 3
  startLine()
  pen.u = script[0].u
  pen.v = script[0].v

  const pagePoint = (p: number, u: number, v: number, out: THREE.Vector3) =>
    out.set(
      p === 0 ? (u - 1) * PAGE_W : u * PAGE_W,
      COVER + pageHeight(p === 0 ? 1 - u : u),
      -PAGE_H / 2 + v * PAGE_H
    )

  function update(dt: number, paused: boolean) {
    if (flip >= 0) {
      if (wait > 0) {
        wait -= dt
        return
      }
      flip = Math.min(1, flip + dt / FLIP_TIME)
      const eased = flip < 0.5 ? 4 * flip ** 3 : 1 - (-2 * flip + 2) ** 3 / 2
      bendLeaf(eased * Math.PI)
      if (flip === 1) {
        pages[0].clear()
        leaf.visible = false
        flip = -1
        page = 0
        line = 0
        startLine()
        wait = 0.3
      }
      return
    }
    if (wait > 0) {
      wait -= dt
      return
    }
    if (!paused) write(dt)
    const touching = penDown && script[index].down
    lift += ((touching ? 0 : PEN_LIFT) - lift) * Math.min(1, dt * 18)

    sinceUpload += dt
    if (sinceUpload >= 0.05) {
      sinceUpload = 0
      for (const paper of pages) {
        if (paper.ink.dirty) paper.texture.needsUpdate = true
        paper.ink.dirty = false
      }
    }
  }

  function getPenTip(out: THREE.Vector3) {
    if (flip >= 0 && flip < 0.55) {
      const angle = flip < 0.5 ? 4 * flip ** 3 * Math.PI : Math.PI / 2
      leafPoint(1, PAGE_H * 0.25, angle, out)
      out.y += 0.012
    } else if (flip >= 0) {
      pagePoint(0, 0.1, BASELINES[0], out)
      out.y += PEN_LIFT * 2
    } else {
      pagePoint(page, pen.u, pen.v, out)
      out.y += lift
    }
    return group.localToWorld(out)
  }

  return {
    group,
    update,
    getPenTip,
    getRestingHand: (out: THREE.Vector3) =>
      group.localToWorld(out.set(-PAGE_W - 0.09, 0.03, 0.05)),
    isPenLifted: () => flip < 0 && !(penDown && script[index].down)
  }
}

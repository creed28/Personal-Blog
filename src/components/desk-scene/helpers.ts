import * as THREE from 'three'
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'

export const { clamp, lerp } = THREE.MathUtils

export function smoothstep(edge0: number, edge1: number, x: number) {
  const t = clamp((x - edge0) / (edge1 - edge0), 0, 1)
  return t * t * (3 - 2 * t)
}

export function damp(speed: number, dt: number) {
  return 1 - Math.exp(-speed * dt)
}

export function random(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

type Shadows = 'both' | 'cast' | 'receive' | 'none'

export function mesh(
  geometry: THREE.BufferGeometry,
  material: THREE.Material | THREE.Material[],
  shadows: Shadows = 'both'
) {
  const result = new THREE.Mesh(geometry, material)
  result.castShadow = shadows === 'both' || shadows === 'cast'
  result.receiveShadow = shadows === 'both' || shadows === 'receive'
  return result
}

export const roundedBox = (
  width: number,
  height: number,
  depth: number,
  radius: number,
  segments = 2
) => new RoundedBoxGeometry(width, height, depth, segments, radius)

export function joinMeshes(root: THREE.Object3D) {
  root.updateMatrixWorld(true)
  const toRoot = root.matrixWorld.clone().invert()
  const meshes: THREE.Mesh[] = []
  root.traverse(object => {
    if (object instanceof THREE.Mesh && !Array.isArray(object.material)) {
      meshes.push(object)
    }
  })

  const buckets = new Map<
    THREE.Material,
    { parts: THREE.BufferGeometry[]; cast: boolean; receive: boolean }
  >()
  const transform = new THREE.Matrix4()
  for (const object of meshes) {
    const material = object.material as THREE.Material
    const geometry = object.geometry.clone()
    geometry.applyMatrix4(
      transform.multiplyMatrices(toRoot, object.matrixWorld)
    )
    const keep = new Set(['position', 'normal'])
    if ('map' in material && material.map) keep.add('uv')
    if (material.vertexColors) keep.add('color')
    for (const name of Object.keys(geometry.attributes)) {
      if (!keep.has(name)) geometry.deleteAttribute(name)
    }
    if (!geometry.index) {
      geometry.setIndex([
        ...Array(geometry.getAttribute('position').count).keys()
      ])
    }

    const bucket = buckets.get(material) ?? {
      parts: [],
      cast: false,
      receive: false
    }
    bucket.parts.push(geometry)
    bucket.cast ||= object.castShadow
    bucket.receive ||= object.receiveShadow
    buckets.set(material, bucket)
    object.removeFromParent()
    object.geometry.dispose()
  }

  for (const [material, { parts, cast, receive }] of buckets) {
    const joined = new THREE.Mesh(mergeGeometries(parts), material)
    joined.castShadow = cast
    joined.receiveShadow = receive
    root.add(joined)
    parts.forEach(part => part.dispose())
  }
  return root
}

export const ellipsoid = (rx: number, ry: number, rz: number, detail = 32) =>
  new THREE.SphereGeometry(1, detail, Math.round(detail * 0.75)).scale(
    rx,
    ry,
    rz
  )

export const capsule = (radius: number, length: number, radial = 16) =>
  new THREE.CapsuleGeometry(radius, length, 6, radial)

const UP = new THREE.Vector3(0, 1, 0)
const spanDir = new THREE.Vector3()

export function spanBetween(
  object: THREE.Object3D,
  a: THREE.Vector3,
  b: THREE.Vector3
) {
  object.position.addVectors(a, b).multiplyScalar(0.5)
  spanDir.subVectors(b, a).normalize()
  object.quaternion.setFromUnitVectors(UP, spanDir)
}

type TubeOptions = {
  segments?: number
  radial?: number
  flatten?: number
  center?: THREE.Vector3
  up?: THREE.Vector3
}

export function taperedTube(
  points: THREE.Vector3[],
  radius: (t: number) => number,
  {
    segments = 32,
    radial = 12,
    flatten = 1,
    center,
    up: upHint = UP
  }: TubeOptions = {}
) {
  const curve = new THREE.CatmullRomCurve3(points, false, 'centripetal')
  const position: number[] = []
  const index: number[] = []
  const point = new THREE.Vector3()
  const tangent = new THREE.Vector3()
  const up = new THREE.Vector3()
  const side = new THREE.Vector3()

  for (let i = 0; i <= segments; i++) {
    const t = i / segments
    curve.getPointAt(t, point)
    curve.getTangentAt(t, tangent)
    if (center) up.subVectors(point, center)
    else up.copy(upHint)
    side.crossVectors(tangent, up).normalize()
    up.crossVectors(side, tangent).normalize()

    const r = radius(t)
    for (let j = 0; j < radial; j++) {
      const angle = (j / radial) * Math.PI * 2
      const x = Math.cos(angle) * r
      const y = Math.sin(angle) * r * flatten
      position.push(
        point.x + side.x * x + up.x * y,
        point.y + side.y * x + up.y * y,
        point.z + side.z * x + up.z * y
      )
    }
  }

  for (let i = 0; i < segments; i++) {
    for (let j = 0; j < radial; j++) {
      const a = i * radial + j
      const b = i * radial + ((j + 1) % radial)
      const c = (i + 1) * radial + j
      const d = (i + 1) * radial + ((j + 1) % radial)
      index.push(a, c, b, b, c, d)
    }
  }

  const capTip = (t: number, direction: number) => {
    curve.getPointAt(t, point)
    curve.getTangentAt(t, tangent)
    point.addScaledVector(tangent, direction * radius(t) * 0.7)
    position.push(point.x, point.y, point.z)
    return position.length / 3 - 1
  }
  const start = capTip(0, -1)
  const end = capTip(1, 1)
  const last = segments * radial
  for (let j = 0; j < radial; j++) {
    const next = (j + 1) % radial
    index.push(start, j, next)
    index.push(end, last + next, last + j)
  }

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(position, 3)
  )
  geometry.setIndex(index)
  geometry.computeVertexNormals()
  return geometry
}

const ikDir = new THREE.Vector3()
const ikBend = new THREE.Vector3()

export function solveTwoBoneIK(
  root: THREE.Vector3,
  target: THREE.Vector3,
  upper: number,
  lower: number,
  pole: THREE.Vector3,
  outJoint: THREE.Vector3,
  outEnd: THREE.Vector3
) {
  ikDir.subVectors(target, root)
  const distance = clamp(
    ikDir.length(),
    Math.abs(upper - lower) + 1e-4,
    upper + lower - 1e-4
  )
  ikDir.normalize()
  outEnd.copy(root).addScaledVector(ikDir, distance)

  const along =
    (upper * upper - lower * lower + distance * distance) / (2 * distance)
  const height = Math.sqrt(Math.max(0, upper * upper - along * along))
  ikBend.subVectors(pole, root)
  ikBend.addScaledVector(ikDir, -ikBend.dot(ikDir)).normalize()
  outJoint
    .copy(root)
    .addScaledVector(ikDir, along)
    .addScaledVector(ikBend, height)
}

export function canvasTexture(
  width: number,
  height: number,
  draw: (ctx: CanvasRenderingContext2D, width: number, height: number) => void
) {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  draw(canvas.getContext('2d')!, width, height)
  const texture = new THREE.CanvasTexture(canvas)
  texture.colorSpace = THREE.SRGBColorSpace
  return texture
}

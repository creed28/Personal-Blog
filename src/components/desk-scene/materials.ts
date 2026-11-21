import * as THREE from 'three'

export const COLORS = {
  skin: 0xf2c4a8,
  blush: 0xf0998a,
  hair: 0x191412,
  brow: 0x241c19,
  iris: 0x2a1c15,
  eyeWhite: 0xfdfbf7,
  lips: 0xdc8f84,
  mouth: 0xa5574e,
  frame: 0x2b2b2f,
  sweater: 0x1c1c20,
  jeans: 0x34445e,
  sneaker: 0xf3f1ec,
  sole: 0xb7b0a6,

  wall: 0xa9bfa2,
  skirting: 0xf3eee4,
  floor: 0xd8ac7e,
  slab: 0x87604a,
  walnut: 0x8c5a3b,
  oak: 0xc99a66,
  paper: 0xf8f2e4,
  pageEdge: 0xe9dfc9,
  diary: 0x2f4675,
  ribbon: 0xc8463b,
  lamp: 0xe3a83e,
  mug: 0xefe8dc,
  coffee: 0x4b2d1e,
  pot: 0xc9764f,
  leaf: 0x4f8a57,
  leafLight: 0x79ad6e,
  rug: 0xd49b7b,
  rugInner: 0xead0b4,
  trim: 0xf5f2ea,
  pen: 0x1f1f24,
  books: [
    0xc9584c, 0xe0b34a, 0x4f7cac, 0x6e9c77, 0x8a6fa8, 0xe7dfcf, 0xd88c5a,
    0x5b8f8a
  ]
}

const standard = (
  color: THREE.ColorRepresentation,
  roughness = 0.8,
  params: THREE.MeshStandardMaterialParameters = {}
) => new THREE.MeshStandardMaterial({ color, roughness, ...params })

export function createMaterials() {
  const covers = new Map<number, THREE.MeshStandardMaterial>()
  return {
    bookCover(color: number) {
      let material = covers.get(color)
      if (!material) {
        material = standard(color, 0.7)
        covers.set(color, material)
      }
      return material
    },
    skin: standard(COLORS.skin, 0.6),
    face: standard(0xffffff, 0.6, { vertexColors: true }),
    hair: standard(COLORS.hair, 0.5),
    brow: standard(COLORS.brow, 0.75),
    eyeWhite: standard(COLORS.eyeWhite, 0.3),
    iris: standard(COLORS.iris, 0.12),
    glint: new THREE.MeshBasicMaterial({ color: 0xffffff }),
    lips: standard(COLORS.lips, 0.5),
    mouth: standard(COLORS.mouth, 0.6),
    frame: standard(COLORS.frame, 0.3),
    lens: new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.05,
      transparent: true,
      opacity: 0.1,
      depthWrite: false
    }),
    sweater: new THREE.MeshPhysicalMaterial({
      color: COLORS.sweater,
      roughness: 0.9,
      sheen: 0.6,
      sheenColor: new THREE.Color(0x585866),
      sheenRoughness: 0.6
    }),
    jeans: standard(COLORS.jeans, 0.9),
    sneaker: standard(COLORS.sneaker, 0.65),
    sole: standard(COLORS.sole, 0.85),
    pen: standard(COLORS.pen, 0.35),
    metal: standard(0xd9d6cf, 0.3, { metalness: 0.8 }),

    wall: standard(COLORS.wall, 0.95),
    skirting: standard(COLORS.skirting, 0.7),
    slab: standard(COLORS.slab, 0.9),
    walnut: standard(COLORS.walnut, 0.55),
    oak: standard(COLORS.oak, 0.6),
    trim: standard(COLORS.trim, 0.6),
    paper: standard(COLORS.paper, 0.9),
    pageEdge: standard(COLORS.pageEdge, 0.95),
    diary: standard(COLORS.diary, 0.65),
    ribbon: standard(COLORS.ribbon, 0.6),
    lamp: standard(COLORS.lamp, 0.4),
    bulb: standard(0xfff4dd, 0.3, { emissive: new THREE.Color(0xffd7a0) }),
    mug: standard(COLORS.mug, 0.35),
    coffee: standard(COLORS.coffee, 0.2),
    pot: standard(COLORS.pot, 0.85),
    leaf: standard(COLORS.leaf, 0.6),
    leafLight: standard(COLORS.leafLight, 0.6),
    rug: standard(COLORS.rug, 1),
    rugInner: standard(COLORS.rugInner, 1)
  }
}

export type Materials = ReturnType<typeof createMaterials>

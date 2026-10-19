// Prepares the laptop and phone models for the 3D hero: public/assets/models/{laptop,phone}.glb.
//
//   node models.mjs <macbook.glb> <iphone.glb>
//
// Sources (Sketchfab, CC Attribution 4.0, credits in public/assets/models/CREDITS.md):
//   "macbook pro M3 16 inch 2024" by jackbaeten — 8e34fc2b303144f78490007d91ff57c4
//   "Apple iPhone 13 Pro Max" by DatSketch       — 4328dea00e47497dbeac73c556121bc9
//
// What it does: drops the brand logos, the stock wallpapers (the scene draws its own screens) and the phone's
// back camera, joins parts that share a material, bakes
// every mesh into scene units with the laptop hinge at the origin and the lid folded shut (the scene
// opens it, as it did the drawn lid), writes the screen rectangle into extras so the scene can lay its
// own screen plane there, then welds, quantizes and meshopt-compresses, with webp textures at 1024 px.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import { dedup, prune, weld, join, simplify, quantize, meshopt, textureCompress, transformMesh, getBounds } from '@gltf-transform/functions';
import { MeshoptEncoder, MeshoptSimplifier } from 'meshoptimizer';
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';
import { dirname, join as pathJoin } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUT = pathJoin(dirname(fileURLToPath(import.meta.url)), '..', '..', 'public', 'assets', 'models');
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({ 'meshopt.encoder': MeshoptEncoder });

// column-major 4x4 helpers (glTF layout)
const mul = (a, b) => { const o = new Array(16).fill(0); for (let c = 0; c < 4; c++) for (let r = 0; r < 4; r++) for (let k = 0; k < 4; k++) o[c * 4 + r] += a[k * 4 + r] * b[c * 4 + k]; return o; };
const T = (x, y, z) => [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, x, y, z, 1];
const S = (s) => [s, 0, 0, 0, 0, s, 0, 0, 0, 0, s, 0, 0, 0, 0, 1];
const RX = (a) => { const c = Math.cos(a), s = Math.sin(a); return [1, 0, 0, 0, 0, c, s, 0, 0, -s, c, 0, 0, 0, 0, 1]; };
const RY = (a) => { const c = Math.cos(a), s = Math.sin(a); return [c, 0, -s, 0, 0, 1, 0, 0, s, 0, c, 0, 0, 0, 0, 1]; };
const apply = (m, [x, y, z]) => [m[0] * x + m[4] * y + m[8] * z + m[12], m[1] * x + m[5] * y + m[9] * z + m[13], m[2] * x + m[6] * y + m[10] * z + m[14]];

const meshNodes = (n, out = []) => { if (n.getMesh()) out.push(n); n.listChildren().forEach((c) => meshNodes(c, out)); return out; };
const points = (node) => {
  const w = node.getWorldMatrix(), pts = [];
  for (const p of node.getMesh().listPrimitives()) { const a = p.getAttribute('POSITION'); for (let i = 0; i < a.getCount(); i++) pts.push(apply(w, a.getElement(i, []))); }
  return pts;
};
const box = (pts) => pts.reduce((b, p) => ({ min: b.min.map((v, i) => Math.min(v, p[i])), max: b.max.map((v, i) => Math.max(v, p[i])) }), { min: [Infinity, Infinity, Infinity], max: [-Infinity, -Infinity, -Infinity] });

/** Moves every mesh node under a fresh top-level node `name`, baking matrix `m` × its world matrix into the vertices. */
function regroup(doc, scene, nodes, name, m) {
  const group = doc.createNode(name);
  for (const n of nodes) {
    let mesh = n.getMesh();
    if (mesh.listParents().filter((p) => p.propertyType === 'Node').length > 1) { mesh = mesh.clone(); n.setMesh(mesh); }
    transformMesh(mesh, mul(m, n.getWorldMatrix()));
    const leaf = doc.createNode(n.getName()).setMesh(mesh);
    group.addChild(leaf);
    n.setMesh(null);
  }
  scene.addChild(group);
  return group;
}

async function finish(doc, file) {
  await doc.transform(
    dedup(), prune(), weld(), join({ keepNamed: false }), // one draw per material instead of one per part
    simplify({ simplifier: MeshoptSimplifier, ratio: 0.6, error: 0.0004, lockBorder: true }),
    quantize(), meshopt({ encoder: MeshoptEncoder, level: 'medium' }),
    textureCompress({ encoder: sharp, targetFormat: 'webp', resize: [1024, 1024] }),
    prune(),
  );
  mkdirSync(OUT, { recursive: true });
  await io.write(pathJoin(OUT, file), doc);
}

async function laptop(src) {
  const doc = await io.read(src), root = doc.getRoot(), scene = root.getDefaultScene();
  const all = scene.listChildren().flatMap((n) => meshNodes(n));
  const byGroup = (id) => all.filter((n) => { for (let p = n.getParentNode(); p; p = p.getParentNode()) if (p.getName().startsWith(id)) return true; return false; });
  const baseNodes = byGroup('BoBvWqDHZjAeVrp'), lidNodes = byGroup('VCQqxpxkUlzqcJI');
  const isLogo = (n) => n.getParentNode().getName().startsWith('vttfLwUKvlhvIxZ');
  const isDisplay = (n) => n.getParentNode().getName().startsWith('VQmfhbMzfNAuKAD');
  const display = lidNodes.find(isDisplay);

  // the display is flat: its normal fixes the angle that folds the lid shut (normal -> straight down)
  const dp = points(display), db = box(dp);
  const tilt = Math.atan2(db.max[2] - db.min[2], db.max[1] - db.min[1]); // lid lean back from vertical
  const close = Math.PI / 2 + tilt; // rotation about +X that folds the open lid onto the base
  // hinge axis: fold the lid shut and it should rest just above the base and end at its front edge
  const basePts = baseNodes.flatMap(points), bb = box(basePts);
  const lidPts = lidNodes.filter((n) => !isLogo(n)).flatMap(points);
  let best = null;
  for (let y0 = -1.5; y0 <= 1.5; y0 += 0.02) for (let z0 = -14; z0 <= -11; z0 += 0.02) {
    const m = mul(RX(close), T(0, -y0, -z0));
    let minY = Infinity, maxZ = -Infinity;
    for (let i = 0; i < lidPts.length; i += 7) { const q = apply(m, lidPts[i]); minY = Math.min(minY, q[1]); maxZ = Math.max(maxZ, q[2]); }
    const err = (minY - (bb.max[1] - y0) - 0.02) ** 2 + (maxZ - (bb.max[2] - z0)) ** 2;
    if (!best || err < best.err) best = { err, y0, z0 };
  }
  const s = 3.0 / (bb.max[0] - bb.min[0]); // 3.0 scene units wide, like the drawn laptop
  const toBase = mul(S(s), T(0, -best.y0, -best.z0));
  const toLid = mul(S(s), mul(RX(close), T(0, -best.y0, -best.z0)));

  // screen rectangle in closed-lid space (lies flat, faces -Y)
  const sc = box(dp.map((p) => apply(toLid, p)));
  const screen = [(sc.min[0] + sc.max[0]) / 2, sc.min[1] - 0.0006, (sc.min[2] + sc.max[2]) / 2, sc.max[0] - sc.min[0], sc.max[2] - sc.min[2]];

  const base = regroup(doc, scene, baseNodes, 'base', toBase);
  const lid = regroup(doc, scene, lidNodes.filter((n) => !isLogo(n) && !isDisplay(n)), 'lid', toLid);
  lid.setExtras({ screen });
  for (const n of [...scene.listChildren()]) if (n !== base && n !== lid) n.dispose();
  // one finish for the whole shell: the lid back and the base bottom were black, the deck silver
  for (const m of root.listMaterials()) if (m.getName() === 'MycfwscjQZRVSoj') m.setBaseColorFactor([0.62, 0.63, 0.65, 1]).setMetallicFactor(0.9).setRoughnessFactor(0.42);
  await finish(doc, 'laptop.glb');
  console.log('laptop', { tilt: (tilt * 180 / Math.PI).toFixed(1), hinge: [best.y0.toFixed(2), best.z0.toFixed(2)], scale: s.toFixed(4), screen: screen.map((v) => +v.toFixed(4)) });
}

async function phone(src) {
  const doc = await io.read(src), root = doc.getRoot(), scene = root.getDefaultScene();
  const all = scene.listChildren().flatMap((n) => meshNodes(n));
  // logo, wallpaper and screen glass go (the scene draws the screen); so does the back camera, which never faces the viewer
  const drop = /^(Apple Logo_Logo_0|Body_Wallpaper_0|Body\.001_Screen Glass_0|Camera(\.00[13])?_.*)$/;
  const wall = all.find((n) => n.getName() === 'Body_Wallpaper_0');
  const wb = box(points(wall));
  const all3 = box(all.flatMap(points));
  const c = all3.min.map((v, i) => (v + all3.max[i]) / 2);
  const s = 1.6 / (all3.max[1] - all3.min[1]); // 1.6 tall, like the drawn phone
  const m = mul(S(s), mul(RY(Math.PI), T(-c[0], -c[1], -c[2]))); // screen to +Z
  const q = box([wb.min, wb.max].map((p) => apply(m, p)));
  const screen = [(q.min[0] + q.max[0]) / 2, (q.min[1] + q.max[1]) / 2, q.max[2] + 0.0008, q.max[0] - q.min[0], q.max[1] - q.min[1]];
  const g = regroup(doc, scene, all.filter((n) => !drop.test(n.getName())), 'phone', m);
  g.setExtras({ screen });
  for (const n of [...scene.listChildren()]) if (n !== g) n.dispose();
  for (const mt of root.listMaterials()) if (mt.getName() === 'Body') mt.setBaseColorFactor([0.56, 0.58, 0.61, 1]);
  await finish(doc, 'phone.glb');
  console.log('phone', { scale: s.toFixed(4), screen: screen.map((v) => +v.toFixed(4)) });
}

await MeshoptEncoder.ready; await MeshoptSimplifier.ready;
await laptop(process.argv[2]);
await phone(process.argv[3]);

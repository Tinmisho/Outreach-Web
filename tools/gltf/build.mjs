// Builds public/assets/gltf-<hash>.js: three's GLTFLoader + meshopt decoder for the 3D scene, and points
// Experience-*.js at it. The models themselves come from models.mjs (public/assets/models).
// three is not bundled again: every `import ... from 'three'` is pointed at the copy inside r3f-*.js,
// whose THREE namespace that bundle exports as `T` (one renderer, one set of classes).
import { build } from 'esbuild';
import { readFileSync, readdirSync, writeFileSync, unlinkSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, '..', '..', 'public', 'assets');
const r3f = readdirSync(assets).find((f) => /^r3f-.*\.js$/.test(f));
const src = readFileSync(join(assets, r3f), 'utf8');
if (!/\bzf as T\b/.test(src)) throw new Error(`${r3f} does not export its THREE namespace as T`);
const names = [...src.slice(src.indexOf('var zf=e({')).split('})')[0].matchAll(/([A-Za-z0-9_$]+):\(\)=>/g)].map((m) => m[1]);

const shim = {
  name: 'three-from-r3f',
  setup(b) {
    b.onResolve({ filter: /^three$/ }, () => ({ path: 'three', namespace: 'shim' }));
    b.onResolve({ filter: /^\.\/r3f-/ }, (a) => ({ path: a.path, external: true }));
    b.onLoad({ filter: /.*/, namespace: 'shim' }, () => ({
      contents: `import { T } from './${r3f}';\nexport const { ${names.join(', ')} } = T;`,
      loader: 'js',
    }));
  },
};

const out = await build({
  stdin: {
    contents: `export { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
export { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module.js';`,
    resolveDir: here,
  },
  bundle: true, format: 'esm', minify: true, write: false, plugins: [shim], legalComments: 'none',
});
const code = out.outputFiles[0].text;
const name = `gltf-${createHash('sha256').update(code).digest('base64url').slice(0, 8)}.js`;
for (const f of readdirSync(assets)) if (/^gltf-.*\.js$/.test(f) && f !== name) unlinkSync(join(assets, f));
writeFileSync(join(assets, name), code);
// the 3D scene imports the loader by its hashed name
const exp = readdirSync(assets).find((f) => /^Experience-.*\.js$/.test(f));
const src2 = readFileSync(join(assets, exp), 'utf8');
writeFileSync(join(assets, exp), src2.replace(/\.\/gltf-[\w-]+\.js/g, `./${name}`));
console.log(`${name} ${(code.length / 1024).toFixed(1)} KB`);

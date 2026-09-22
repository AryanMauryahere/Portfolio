import { readFile } from 'node:fs/promises';
import { Script } from 'node:vm';
import assert from 'node:assert/strict';
import { portfolio } from '../src/content.js';

const html = await readFile('public/landing-pages/kage.html', 'utf8');
const original = await readFile('.references/threeui/registered/public/landing-pages/kage.html', 'utf8');
const scripts = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].filter(match => match[1].trim());
for (const [index, match] of scripts.entries()) new Script(match[1], { filename: `kage-inline-${index}.js` });
assert.equal(scripts.length, 2, 'Expected the content adapter and original scene script');
const restored = html.replace(scripts[0][0] + '\n', '').replace(
  `const word = '${portfolio.wordmark}', gl = [];`, "const word = 'KAGE', gl = [];",
);
assert.equal(restored, original, 'The renderer, shaders, original CSS and markup must remain intact');
console.log('Inline scripts parse; original scene is byte-identical after removing the two documented customizations.');

import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir, copyFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(import.meta.dirname, '..');
const hash = (data) => createHash('sha256').update(data).digest('hex');

export async function prepareKage() {
  const bundle = JSON.parse(await readFile(resolve(root, '.references/threeui/kage-landing-page.json'), 'utf8'));
  const verified = [];
  // Fail closed if the supplied revision and installed assets diverge.
  for (const file of [...bundle.files, ...bundle.assets]) {
    const data = file.code !== undefined ? Buffer.from(file.code) : await readFile(resolve(
      root, 'node_modules/@designcodeio/threeui/lib-dist/assets', file.path.replace(/^public\//, ''),
    ));
    if (hash(data) !== file.sha256) throw new Error(`ThreeUI fingerprint mismatch: ${file.path}`);
    verified.push({ path: file.path, sha256: file.sha256 });
    const original = resolve(root, '.references/threeui/registered', file.path);
    await mkdir(dirname(original), { recursive: true });
    await writeFile(original, data);
    if (file.path.startsWith('public/') && !file.path.endsWith('/kage.html')) {
      const destination = resolve(root, file.path);
      await mkdir(dirname(destination), { recursive: true });
      await writeFile(destination, data);
    }
  }
  const version = Date.now();
  const { portfolio } = await import(`${pathToFileURL(resolve(root, 'src/content.js'))}?v=${version}`);
  const { personalizeKage } = await import(`${pathToFileURL(resolve(root, 'src/personalize-kage.js'))}?v=${version}`);
  let html = await readFile(resolve(root, '.references/threeui/registered/public/landing-pages/kage.html'), 'utf8');
  const originalWord = "const word = 'KAGE', gl = [];";
  if (!html.includes(originalWord)) throw new Error('Original wordmark source not found.');
  if (!/^[A-Z]{2,8}$/.test(portfolio.wordmark)) throw new Error('Use 2–8 uppercase letters for wordmark.');
  html = html.replace(originalWord, `const word = '${portfolio.wordmark}', gl = [];`);
  // Personalize before the original reveal, nav and camera logic is wired.
  const safeData = JSON.stringify(portfolio).replace(/</g, '\\u003c');
  const customization = `<script>\n(${personalizeKage.toString()})(${safeData});\n</script>\n`;
  const marker = '<script src="secret-pathways-assets/three.min.js"></script>';
  if (!html.includes(marker)) throw new Error('Original Three.js entry point not found.');
  html = html.replace(marker, () => customization + marker);
  await mkdir(resolve(root, 'public/landing-pages'), { recursive: true });
  await writeFile(resolve(root, 'public/landing-pages/kage.html'), html);
  const licenses = resolve(root, 'public/licenses/threeui');
  await mkdir(licenses, { recursive: true });
  for (const name of ['LICENSE', 'ASSET-LICENSES.md', 'FONT-LICENSES.md', 'THIRD_PARTY_NOTICES.md']) {
    await copyFile(resolve(root, 'node_modules/@designcodeio/threeui', name), resolve(licenses, name));
  }
  await writeFile(resolve(root, '.references/threeui/verification.json'), JSON.stringify({
    package: '@designcodeio/threeui@1.2.0', source: 'https://threeui.com/source-code/kage-landing-page.json',
    verified, personalizedPageSha256: hash(html),
    changes: ['Portfolio copy, links and projects adapter', '3D wordmark: KAGE → ' + portfolio.wordmark],
  }, null, 2) + '\n');
  console.log(`Verified ${verified.length} exact ThreeUI source/assets; prepared ${portfolio.name}'s portfolio.`);
}

if (process.argv[1] && resolve(process.argv[1]) === import.meta.filename) await prepareKage();


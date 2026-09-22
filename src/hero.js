import {
  ACESFilmicToneMapping, BoxGeometry, Color, DirectionalLight, Group,
  Mesh, MeshBasicMaterial, MeshPhysicalMaterial, PerspectiveCamera,
  PMREMGenerator, Scene, SRGBColorSpace, TorusKnotGeometry, WebGLRenderer,
} from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';

export function createHero(container, toggle, options = {}) {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const hoverPointer = window.matchMedia('(hover: hover) and (pointer: fine)');
  let renderer;
  try {
    renderer = new WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'low-power' });
  } catch {
    container.dataset.fallback = 'true';
    return;
  }

  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 40);
  camera.position.set(0, 0, 8.7);
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.setAttribute('aria-hidden', 'true');
  container.append(renderer.domElement);

  // A local studio environment provides real reflections without remote HDR files.
  function makeEnvironment() {
  const room = new RoomEnvironment();
  const orangePanel = new Mesh(new BoxGeometry(14, 7, .1), new MeshBasicMaterial({ color: new Color('#ff5100') }));
  orangePanel.position.set(0, 1, -7);
  room.add(orangePanel);
  const environmentBuilder = new PMREMGenerator(renderer);
  const result = environmentBuilder.fromScene(room, 0.025);

  room.dispose();
  environmentBuilder.dispose();
  return result;
  }
  let environment = makeEnvironment();
  scene.environment = environment.texture;

  const material = new MeshPhysicalMaterial({
    color: '#e4e3df', metalness: 1, roughness: 0.15,
    clearcoat: 1, clearcoatRoughness: 0.08, envMapIntensity: 1.75,
  });
  const geometry = new TorusKnotGeometry(1.07, 0.31, 180, 32, 2, 3);
  const sculpture = new Mesh(geometry, material);
  sculpture.scale.set(0.98, 1.16, 0.98);
  const assembly = new Group();
  assembly.add(sculpture);
  assembly.rotation.set(0.38, -0.58, -0.32);
  scene.add(assembly);
  const key = new DirectionalLight('#ffffff', 3);
  key.position.set(-3, 5, 4);
  scene.add(key);
  const rim = new DirectionalLight('#ff9e66', 2);
  rim.position.set(5, -2, 2);
  scene.add(rim);

  let active = options.enabled !== false && !reducedMotion.matches;
  let visible = true;
  let contextLost = false;
  let disposed = false;
  let animationFrame = 0;
  let previousTime = 0;
  let elapsed = 0;
  let lastDraw = 0;
  let pointerX = 0;
  let pointerY = 0;
  let currentX = 0;
  let currentY = 0;
  const speed = Math.max(0, Math.min(Number(options.speed) || 0.18, 1));
  const hero = container.closest('.hero');

  function draw() { renderer.render(scene, camera); }
  function resize() {
    const { width, height } = container.getBoundingClientRect();
    if (!width || !height || disposed || contextLost) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }
  function updateButton() {
    toggle.innerHTML = active ? 'Pause motion <span aria-hidden=\"true\">&#8545;</span>' : 'Play motion <span aria-hidden=\"true\">&#9655;</span>';
    toggle.setAttribute('aria-label', active ? 'Pause motion' : 'Play motion');
  }
  function stop() {
    cancelAnimationFrame(animationFrame);
    animationFrame = 0;
    previousTime = 0;
  }
  function frame(now) {
    animationFrame = 0;
    if (!active || !visible || document.hidden || disposed || contextLost) return;
    if (now - lastDraw > 1000 / 45) {
      const dt = previousTime ? Math.min((now - previousTime) / 1000, 0.06) : 0;
      elapsed += dt;
      previousTime = now;
      lastDraw = now;
      currentX += (pointerX - currentX) * 0.065;
      currentY += (pointerY - currentY) * 0.065;
      assembly.rotation.x = .38 + Math.sin(elapsed * speed * .8) * .14 + currentY * .10;
      assembly.rotation.y = -.58 + elapsed * speed + currentX * .20;
      assembly.rotation.z = -.32 + Math.sin(elapsed * speed) * .08;
      assembly.position.y = Math.sin(elapsed * speed * 1.8) * .065;
      draw();
    }
    animationFrame = requestAnimationFrame(frame);
  }
  function synchronize() {
    stop();
    if (active && visible && !document.hidden && !contextLost && !disposed) animationFrame = requestAnimationFrame(frame);
  }
  function onToggle() { active = !active; updateButton(); synchronize(); }
  function onPreferenceChange() {
    active = options.enabled !== false && !reducedMotion.matches;
    pointerX = pointerY = currentX = currentY = 0;
    updateButton();
    synchronize();
  }
  function onPointerMove(event) {
    if (!active || !hoverPointer.matches) return;
    const rect = hero.getBoundingClientRect();
    pointerX = (event.clientX - rect.left) / rect.width - .5;
    pointerY = (event.clientY - rect.top) / rect.height - .5;
  }
  function onPointerLeave() { pointerX = pointerY = 0; }
  function onContextLost(event) {
    event.preventDefault();
    contextLost = true;
    stop();
    delete container.dataset.ready;
    renderer.domElement.hidden = true;
    toggle.hidden = true;
  }
  function onContextRestored() {
    contextLost = false;
    environment.dispose();
    environment = makeEnvironment();
    scene.environment = environment.texture;
    renderer.domElement.hidden = false;
    container.dataset.ready = 'true';
    toggle.hidden = false;
    resize();
    synchronize();
  }

  const resizeObserver = new ResizeObserver(resize);
  const visibilityObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; synchronize(); }, { threshold: 0.01 });
  resizeObserver.observe(container);
  visibilityObserver.observe(hero);
  toggle.addEventListener('click', onToggle);
  reducedMotion.addEventListener('change', onPreferenceChange);
  document.addEventListener('visibilitychange', synchronize);
  hero.addEventListener('pointermove', onPointerMove, { passive: true });
  hero.addEventListener('pointerleave', onPointerLeave);
  renderer.domElement.addEventListener('webglcontextlost', onContextLost);
  renderer.domElement.addEventListener('webglcontextrestored', onContextRestored);
  resize();
  container.dataset.ready = 'true';
  toggle.hidden = false;
  updateButton();
  synchronize();

  function dispose() {
    disposed = true;
    stop();
    resizeObserver.disconnect();
    visibilityObserver.disconnect();
    toggle.removeEventListener('click', onToggle);
    reducedMotion.removeEventListener('change', onPreferenceChange);
    document.removeEventListener('visibilitychange', synchronize);
    hero.removeEventListener('pointermove', onPointerMove);
    hero.removeEventListener('pointerleave', onPointerLeave);
    renderer.domElement.removeEventListener('webglcontextlost', onContextLost);
    renderer.domElement.removeEventListener('webglcontextrestored', onContextRestored);
    geometry.dispose();
    material.dispose();
    environment.dispose();
    renderer.dispose();
    renderer.domElement.remove();
  }
  if (import.meta.hot) import.meta.hot.dispose(dispose);
  return dispose;
}


// src/components/islands/IndustriesCanvas.jsx
// Isla React — Canvas 3D de fondo para la sección Industrias. Se monta con client:visible
// desde IndustriesSection.astro (que es quien tiene el HTML/texto real, SEO-safe).
import { Canvas } from '@react-three/fiber';
import { useIndustriesScroll } from './industries3d/useIndustriesScroll';
import Laptop from './industries3d/objects/Laptop';
import Wok from './industries3d/objects/Wok';
import Fabric from './industries3d/objects/Fabric';
import Plant from './industries3d/objects/Plant';
import Building from './industries3d/objects/Building';

// Orden = orden de las 5 divisiones (01 Tecnología → 05 Inmobiliaria).
const OBJECTS = [Laptop, Wok, Fabric, Plant, Building];

export default function IndustriesCanvas() {
  const { activationRefs, mouse } = useIndustriesScroll(OBJECTS.length);

  const reducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reducedMotion) return null;

  return (
    <Canvas
      dpr={[1, 2]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 5], fov: 40 }}
    >
      <ambientLight intensity={0.5} color="#3a3222" />
      <directionalLight position={[3, 4, 5]} intensity={2} color="#f2ece0" />
      <pointLight position={[-4, 1, 2]} intensity={4} color="#c9a15c" />
      <pointLight position={[3, -2, -2]} intensity={2.5} color="#5b7fb0" />

      {OBJECTS.map((ObjectComponent, i) => (
        <ObjectComponent key={i} activationRef={activationRefs[i]} mouse={mouse} />
      ))}
    </Canvas>
  );
}

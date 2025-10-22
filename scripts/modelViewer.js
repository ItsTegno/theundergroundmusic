// Importar librerías
import * as THREE from "https://cdn.skypack.dev/three@0.129.0/build/three.module.js";
import { GLTFLoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "https://cdn.skypack.dev/three@0.129.0/examples/jsm/loaders/RGBELoader.js";

// Crear escena
const scene = new THREE.Scene();

// Crear cámara (relación de aspecto dinámica)
const container = document.getElementById("container3D");
const camera = new THREE.PerspectiveCamera(
  75,
  container.clientWidth / container.clientHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// --- PMREM + HDRI (añadir justo después de crear el renderer) ---
const pmremGenerator = new THREE.PMREMGenerator(renderer);
pmremGenerator.compileEquirectangularShader();

// Cambia './models/hdri.hdr' por el nombre real de tu archivo HDR en la carpeta modelos
new RGBELoader()
  .setDataType(THREE.UnsignedByteType)
  .load(
    "./media/models/citrus_orchard_puresky_1k.hdr",
    (hdrEquirect) => {
      const envMap = pmremGenerator.fromEquirectangular(hdrEquirect).texture;
      scene.environment = envMap; // aplica iluminación PBR a los materiales
      // opcional: mostrar el HDR como fondo (quita o comenta si no quieres fondo)
      // scene.background = envMap;
      hdrEquirect.dispose();
      pmremGenerator.dispose();
    },
    undefined,
    (err) => console.error("Error cargando HDRI:", err)
  );

let object;
const loader = new GLTFLoader();
loader.load(
  "./media/models/snail/scene.gltf",
  (gltf) => {
    object = gltf.scene;

    // Centrar el modelo (opcional, pero suele ayudar)
    object.position.set(0, 0, 0); // X=1 → a la derecha, Y=0, Z=0

    // Rotar el modelo 90° para que mire hacia abajo (en eje Y)
    object.rotation.y = Math.PI / 6; // -90 grados
    object.rotation.x = Math.PI / 2; // -90 grados

    // Escalar si es necesario
    object.scale.set(1, 1, 1);

    scene.add(object);
  },
  (xhr) => console.log((xhr.loaded / xhr.total) * 100 + "% loaded"),
  (error) => console.error(error)
);

const topLight = new THREE.DirectionalLight(0xffffff, 0.5);
topLight.position.set(5, 10, 5);
scene.add(topLight);
//const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//scene.add(ambientLight);

window.addEventListener("resize", () => {
  camera.aspect = container.clientWidth / container.clientHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(container.clientWidth, container.clientHeight);
});

function animate() {
  requestAnimationFrame(animate);

  // actualizar la cámara en cada frame según la posición del container en la pantalla
  updateCameraFromContainer();

  renderer.render(scene, camera);
}
animate();

// Nueva función: posiciona la cámara según la posición relativa del container en el viewport
function updateCameraFromContainer() {
  if (!container) return;
  const rect = container.getBoundingClientRect();
  const viewportCenterY = window.innerHeight / 2;
  const containerCenterY = rect.top + rect.height / 2;
  const viewportCenterX = window.innerWidth / 2;
  const containerCenterX = rect.left + rect.width / 2;

  // Normalizado en rango aprox -1 .. 1 (positivo cuando el container está por encima del centro)
  const normY = (viewportCenterY - containerCenterY) / (window.innerHeight / 2);
  const normX = (viewportCenterX - containerCenterX) / (window.innerWidth / 2);

  // Ajusta baseY / maxOffset para el efecto deseado
  const baseY = 0;
  const baseX = 0;
  const maxOffsetY = -1.0;
  const maxOffsetX = 1.0;

  const clampedY = Math.max(-1, Math.min(1, normY));
  camera.position.y = baseY + clampedY * maxOffsetY;

  const clampedX = Math.max(-1, Math.min(1, normX));
  camera.position.x = baseX + clampedX * maxOffsetX;

  camera.position.z = 4 - (Math.pow(camera.position.y, 2) + Math.pow(camera.position.x, 2)) * 0.175;
  camera.lookAt(0, 0, 0);
}

// Llamada inicial para fijar la cámara al cargar
updateCameraFromContainer();
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
  renderer.render(scene, camera);
}
animate();

camera.position.y = 0.75 + window.scrollY * 0.002 * -1;
  camera.position.z = 4 - Math.pow(camera.position.y, 2) * 0.175;
  camera.lookAt(0, 0, 0);

window.addEventListener("scroll", () => {
  const scrollY = window.scrollY;
  const scrollFactor = scrollY * 0.002;

  // La cámara sube y baja manteniendo el ángulo hacia abajo
  camera.position.y = 0.75 + scrollFactor * -1;
  camera.position.z = 4 - Math.pow(camera.position.y, 2) * 0.175;
  camera.lookAt(0, 0, 0);
});
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import fragmentShader from "./shaders/fragmentShader.glsl";
import vertexShader from "./shaders/vertexShader.glsl";
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
const canvas = document.querySelector("#c");
const controls = new OrbitControls(camera, canvas);
controls.update();
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);

const geometry = new THREE.SphereGeometry(2, 32, 16);
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
});

const ico = new THREE.Mesh(geometry, material);
scene.add(ico);

camera.position.z = 5;

function render() {
  renderer.render(scene, camera);
  controls.update();
  requestAnimationFrame(render);
}

render();

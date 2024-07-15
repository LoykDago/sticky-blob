import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import "./App.css";
import fragmentShaderMain from "./shaders/fragment_main.glsl";
import fragmentShaderPars from "./shaders/fragment_pars.glsl";
import vertexShaderMain from "./shaders/vertex_main.glsl";
import vertexShaderPars from "./shaders/vertex_pars.glsl";
const App = () => {
  const canvasRef = useRef(null);
  const composer = useRef(null);
  const materialRef = useRef(null);
  const clock = useRef(new THREE.Clock());

  useEffect(() => {
    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 2.5;

    scene.background = new THREE.Color(0xc8d8d8);

    const dirLight = new THREE.DirectionalLight("#ffffff", 0.8);
    dirLight.position.set(2, 2, 2);
    const ambientLight = new THREE.AmbientLight("cyan", 0.5);
    scene.add(dirLight, ambientLight);

    const geometry = new THREE.IcosahedronGeometry(1, 170);

    const material = new THREE.MeshStandardMaterial({
      onBeforeCompile: (shader) => {
        materialRef.current = shader;
        shader.uniforms.uTime = { value: 0 };
        shader.uniforms.uMouse = { value: new THREE.Vector3(0, 0, 0) };

        const parsVertexString = `#include <displacementmap_pars_vertex>`;
        shader.vertexShader = shader.vertexShader.replace(
          parsVertexString,
          parsVertexString + vertexShaderPars
        );

        const mainVertexString = `#include <displacementmap_vertex>`;
        shader.vertexShader = shader.vertexShader.replace(
          mainVertexString,
          mainVertexString + vertexShaderMain
        );

        const mainFragmentString = `#include <normal_fragment_maps>`;
        const parsFragmentString = `#include <bumpmap_pars_fragment>`;

        shader.fragmentShader = shader.fragmentShader.replace(
          parsFragmentString,
          parsFragmentString + fragmentShaderPars
        );
        shader.fragmentShader = shader.fragmentShader.replace(
          mainFragmentString,
          mainFragmentString + fragmentShaderMain
        );
      },
    });

    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    const composerInstance = new EffectComposer(renderer);
    composer.current = composerInstance;
    const renderPass = new RenderPass(scene, camera);
    composerInstance.addPass(renderPass);

    const onPointerMove = (event) => {
      const pointer = new THREE.Vector2(
        (event.clientX / window.innerWidth) * 2 - 1,
        -(event.clientY / window.innerHeight) * 2 + 1
      );
      if (materialRef.current) {
        materialRef.current.uniforms.uMouse.value = pointer;
      }
    };

    window.addEventListener("pointermove", onPointerMove);

    const resizeRendererToDisplaySize = (renderer) => {
      const canvas = renderer.domElement;
      const pixelRatio = window.devicePixelRatio;
      const width = (canvas.clientWidth * pixelRatio) | 0;
      const height = (canvas.clientHeight * pixelRatio) | 0;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    };

    const render = () => {
      composerInstance.render();
      if (materialRef.current) {
        materialRef.current.uniforms.uTime.value =
          clock.current.getElapsedTime() / 10;
      }

      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
        composerInstance.render();
      }

      requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, []);

  return (
    <>
      <div className="header">
        <h1>STICKY BLOB</h1>
      </div>
      <canvas ref={canvasRef} />
      <div className="footer">
        <p>By Loic Rajaofetra</p>
      </div>
    </>
  );
};

export default App;

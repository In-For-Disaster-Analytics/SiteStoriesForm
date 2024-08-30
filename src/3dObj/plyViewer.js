import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function PLYViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
        if (mountRef.current) {
      mountRef.current.appendChild(renderer.domElement);
    }

    const controls = new OrbitControls(camera, renderer.domElement);

    let mesh = null; // Declare mesh variable outside the loader.load callback


    const loader = new PLYLoader();
    loader.load('https://portals.tapis.io/v3/files/postits/redeem/8c78e850-d65c-4c91-81fc-3b7bb8eeca71-010', (geometry) => {
      geometry.computeVertexNormals();


      
      // Find min and max heights for Z axis
      const positions = geometry.attributes.position.array;
      let minZ = Infinity, maxZ = -Infinity;
      
      for (let i = 2; i < positions.length; i += 3) {
        minZ = Math.min(minZ, positions[i]);
        maxZ = Math.max(maxZ, positions[i]);
      }
      geometry.attributes.position.needsUpdate = true;

      // Create custom shader material
      const material = new THREE.ShaderMaterial({
        uniforms: {
          minHeight: { value: minZ },
          maxHeight: { value: maxZ }
        },
        vertexShader: `
          varying float vHeight;
          uniform float minHeight;
          uniform float maxHeight;
          void main() {
            vHeight = (position.z - minHeight) / (maxHeight - minHeight);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying float vHeight;
          
          vec3 getTerrainColor(float height) {
            vec3 green = vec3(0.0, 0.5, 0.0);
            vec3 yellow = vec3(1.0, 1.0, 0.0);
            vec3 brown = vec3(0.6, 0.3, 0.0);
            vec3 red = vec3(0.8, 0.0, 0.0);
            vec3 white = vec3(1.0, 1.0, 1.0);
            
            if (height < 0.2) return green;
            else if (height < 0.4) return mix(green, yellow, (height - 0.2) / 0.2);
            else if (height < 0.6) return mix(yellow, brown, (height - 0.4) / 0.2);
            else if (height < 0.8) return mix(brown, red, (height - 0.6) / 0.2);
            else return mix(red, white, (height - 0.8) / 0.2);
          }
          
          void main() {
            gl_FragColor = vec4(getTerrainColor(vHeight), 1.0);
          }
        `
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Center the camera on the loaded model
      const box = new THREE.Box3().setFromObject(mesh);
      const center = box.getCenter(new THREE.Vector3());
      camera.position.copy(center);
      camera.position.z += box.getSize(new THREE.Vector3()).length();
      controls.target.copy(center);

      // Create and add legend
      const range = maxZ - minZ;
      const step = range / 5;
      const legendElement = document.createElement('div');
      legendElement.id = 'legend';
      legendElement.innerHTML = `
        <h3>Elevation Legend</h3>
        <div class="legend-item">
          <div class="legend-color" style="background: white;"></div>
          <span>${(maxZ - step).toFixed(2)} - ${maxZ.toFixed(2)}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: red;"></div>
          <span>${(maxZ - 2*step).toFixed(2)} - ${(maxZ - step).toFixed(2)}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: brown;"></div>
          <span>${(maxZ - 3*step).toFixed(2)} - ${(maxZ - 2*step).toFixed(2)}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: yellow;"></div>
          <span>${(maxZ - 4*step).toFixed(2)} - ${(maxZ - 3*step).toFixed(2)}</span>
        </div>
        <div class="legend-item">
          <div class="legend-color" style="background: green;"></div>
          <span>${minZ.toFixed(2)} - ${(maxZ - 4*step).toFixed(2)}</span>
        </div>
      `;
      mountRef.current.appendChild(legendElement);
    });

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      if (mountRef.current && mountRef.current.querySelector('#legend')) {
        mountRef.current.removeChild(mountRef.current.querySelector('#legend'));
      }
      if (mesh) {
        scene.remove(mesh);
        mesh.geometry.dispose();
        mesh.material.dispose();
      }
      renderer.dispose();
    };

  }, []);

  return <div ref={mountRef} style={{ position: 'relative', width: '100%', height: '100%' }} />;
}

export default PLYViewer;
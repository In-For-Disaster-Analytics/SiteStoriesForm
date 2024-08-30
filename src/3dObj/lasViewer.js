import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Potree } from 'potree-loader';

function LASViewer() {
  const mountRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();

    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const potree = new Potree();
    potree.loadPointCloud('https://portals.tapis.io/v3/files/postits/redeem/279f2e19-0f36-4ceb-ac6a-4107ac24002c-010', 'PointCloud', (e) => {
      const pointcloud = e.pointcloud;
      const material = pointcloud.material;
      scene.add(pointcloud);

      // Center the camera on the loaded points
      const box = new THREE.Box3().setFromObject(pointcloud);
      const center = box.getCenter(new THREE.Vector3());
      camera.position.copy(center);
      camera.position.z += box.getSize(new THREE.Vector3()).length();
      controls.target.copy(center);
      controls.update();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    animate();

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: '100%', height: '100vh' }} />;
}

export default LASViewer;

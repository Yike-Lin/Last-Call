"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { RectAreaLightUniformsLib } from "three/examples/jsm/lights/RectAreaLightUniformsLib.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { GTAOPass } from "three/examples/jsm/postprocessing/GTAOPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

type ToolModel = {
  key: "shaker" | "jigger" | "strainer";
  url: string;
  position: THREE.Vector3Tuple;
  rotation: THREE.Vector3Tuple;
  scale: number;
  spinAxis: THREE.Vector3Tuple;
  spinPivot?: THREE.Vector3Tuple;
};

const toolModels: ToolModel[] = [
  {
    key: "jigger",
    url: "/models/jigger-stainless-web.glb",
    position: [-1.3, -0.85, -0.2],
    rotation: [0.18, -0.16, 0.22],
    scale: 1.08,
    spinAxis: [0, 1, 0]
  },
  {
    key: "shaker",
    url: "/models/shaker-stainless.glb",
    position: [0.22, 0.3, 0.14],
    rotation: [-0.22, 0.18, -0.16],
    scale: 2.04,
    spinAxis: [0, 1, 0]
  },
  {
    key: "strainer",
    url: "/models/hawthorne-strainer-stainless.glb",
    position: [1.84, -0.17, -0.62],
    rotation: [0.12, 0.18, Math.PI / 2],
    scale: 1.08,
    spinAxis: [0.945, 0, -0.328],
    spinPivot: [0.265, 0.015, -0.136]
  }
];

function frameModel(object: THREE.Object3D) {
  const box = new THREE.Box3().setFromObject(object);
  const center = box.getCenter(new THREE.Vector3());
  const size = box.getSize(new THREE.Vector3());
  const maxAxis = Math.max(size.x, size.y, size.z) || 1;

  object.position.sub(center);
  object.scale.multiplyScalar(1 / maxAxis);
}

function tuneMaterials(object: THREE.Object3D) {
  object.traverse((child) => {
    if (!(child instanceof THREE.Mesh)) {
      return;
    }

    child.castShadow = true;
    child.receiveShadow = true;

      const materials = Array.isArray(child.material) ? child.material : [child.material];
      materials.forEach((material) => {
        if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshPhysicalMaterial) {
          // Preserve embedded GLB PBR maps. The fallback values only apply to
          // older assets that contain no texture data.
          if (!material.map) {
            material.color.set(0x89959c);
          } else {
            // Keep the metal neutral and bright like brushed barware. The
            // reflection cards below provide the visible silver gradients.
            material.color.setRGB(0.94, 0.91, 0.86);
            material.map.colorSpace = THREE.SRGBColorSpace;
          }
          if (!material.metalnessMap) {
            material.metalness = 1;
          }
          if (!material.roughnessMap) {
            material.roughness = Math.min(Math.max(material.roughness, 0.28), 0.34);
          }
          if (material.map) {
            // Metal009's roughness map is authored around a 0.5 factor; use a
            // slightly lower scalar to get polished, not plastic, highlights.
            material.roughness = 0.38;
          }
          // Keep a controlled amount of the room reflection and let the
          // initialized rectangular lights create the broad silver cards.
          material.envMapIntensity = material.map ? 0.78 : 0.68;
          if (material.normalMap) {
            material.normalScale.setScalar(0.5);
          }
          material.needsUpdate = true;
        }
      });
  });
}

export function HeroToolScene() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    let frameId = 0;
    let disposed = false;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const pointer = new THREE.Vector2(0, 0);
    const drag = {
      active: false,
      x: 0,
      tool: null as THREE.Object3D | null,
      targetAngle: 0,
      angle: 0,
      groupRotationY: 0
    };
    const raycaster = new THREE.Raycaster();
    const spinQuaternion = new THREE.Quaternion();
    const clock = new THREE.Clock();
    const scene = new THREE.Scene();
    const group = new THREE.Group();
    const shakerGroup = new THREE.Group();
    const loadedObjects: THREE.Object3D[] = [];
    const shakerParts: THREE.Object3D[] = [];

    scene.fog = new THREE.FogExp2(0x070604, 0.035);
    scene.add(group);
    group.add(shakerGroup);

    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    camera.position.set(0.05, 0.04, 6.4);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: "high-performance"
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.02;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    const gtaoPass = new GTAOPass(scene, camera, 512, 512);
    gtaoPass.updateGtaoMaterial({
      radius: 0.08,
      distanceExponent: 1.5,
      thickness: 0.35,
      distanceFallOff: 1.2,
      scale: 1.05,
      samples: 12,
      screenSpaceRadius: true
    });
    gtaoPass.updatePdMaterial({
      lumaPhi: 10,
      depthPhi: 2,
      normalPhi: 3,
      radius: 4,
      radiusExponent: 2,
      rings: 2,
      samples: 8
    });
    gtaoPass.output = GTAOPass.OUTPUT.Default;
    gtaoPass.blendIntensity = 0.06;
    composer.addPass(gtaoPass);
    composer.addPass(new OutputPass());

    // RectAreaLight needs its shader uniforms registered before any lights
    // are created; otherwise the intended softbox reflections are absent.
    RectAreaLightUniformsLib.init();

    const pmremGenerator = new THREE.PMREMGenerator(renderer);
    const roomEnvironment = new RoomEnvironment();
    let environmentTarget = pmremGenerator.fromScene(roomEnvironment, 0.04);
    scene.environment = environmentTarget.texture;
    scene.environmentIntensity = 0.9;
    scene.environmentRotation.y = Math.PI * 0.17;
    pmremGenerator.compileEquirectangularShader();

    new RGBELoader()
      .setDataType(THREE.HalfFloatType)
      .load(
        "/hdri/cayley-interior-1k.hdr",
        (texture) => {
          if (disposed) {
            texture.dispose();
            return;
          }

          const hdriTarget = pmremGenerator.fromEquirectangular(texture);
          texture.dispose();
          environmentTarget.dispose();
          environmentTarget = hdriTarget;
          scene.environment = hdriTarget.texture;
        },
        undefined,
        () => {
          // RoomEnvironment remains active as a deterministic fallback.
        }
      );

    const warmKey = new THREE.DirectionalLight(0xfff5e8, 1.35);
    warmKey.position.set(3.3, 3.1, 4.2);
    warmKey.castShadow = true;
    warmKey.shadow.mapSize.set(1024, 1024);
    scene.add(warmKey);

    const coolRim = new THREE.DirectionalLight(0xdbe7ee, 0.9);
    coolRim.position.set(-2.8, 1.3, 3.2);
    scene.add(coolRim);

    const topStrip = new THREE.RectAreaLight(0xffffff, 3.2, 1.6, 4.4);
    topStrip.position.set(-1.55, 2.55, 3.4);
    topStrip.lookAt(0, 0, 0);
    scene.add(topStrip);

    // Large and narrow softboxes create the long silver gradients visible on
    // real polished steel, while the dark environment keeps the engraving legible.
    const silverSoftbox = new THREE.RectAreaLight(0xffffff, 5.2, 1.35, 3.8);
    silverSoftbox.position.set(-2.45, 0.25, 3.8);
    silverSoftbox.lookAt(-0.9, -0.35, 0);
    scene.add(silverSoftbox);

    const silverEdge = new THREE.RectAreaLight(0xffffff, 3.8, 0.24, 3.6);
    silverEdge.position.set(1.3, 1.2, 3.25);
    silverEdge.lookAt(0.15, -0.1, 0);
    scene.add(silverEdge);

    const fill = new THREE.HemisphereLight(0xf3f7fa, 0x171412, 0.12);
    scene.add(fill);

    const shadowPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(5.8, 2.6),
      new THREE.ShadowMaterial({ color: 0x000000, opacity: 0.34 })
    );
    shadowPlane.position.set(0.42, -1.78, -0.56);
    shadowPlane.rotation.x = -Math.PI / 2;
    shadowPlane.receiveShadow = true;
    scene.add(shadowPlane);

    const loader = new GLTFLoader();

    toolModels.forEach((model) => {
      const handleLoadedModel = (gltf: { scene: THREE.Object3D }) => {
        if (disposed) {
          return;
        }

        const object = gltf.scene;
        frameModel(object);
        tuneMaterials(object);
        object.position.set(...model.position);
        object.rotation.set(...model.rotation);
        // Keep the normalization scale from frameModel, then apply the display multiplier.
        object.scale.multiplyScalar(model.scale * 2);
        object.name = `hero-${model.key}`;
        object.userData.basePosition = new THREE.Vector3(...model.position);
        object.userData.baseQuaternion = object.quaternion.clone();
        object.userData.spinAxis = new THREE.Vector3(...model.spinAxis).normalize();
        if (model.spinPivot) {
          object.userData.spinPivot = new THREE.Vector3(...model.spinPivot);
        }
        object.userData.dragAngle = 0;

        if (model.key === "shaker") {
          shakerGroup.add(object);
          object.traverse((child) => {
            if (child instanceof THREE.Mesh && child.name.startsWith("tripo_part_")) {
              child.userData.baseZ = child.position.z;
              shakerParts.push(child);
            }
          });
        } else {
          group.add(object);
        }

        loadedObjects.push(object);
      };

      loader.load(model.url, handleLoadedModel, undefined, (error) => {
        console.error(`Failed to load ${model.key} model`, error);
      });
    });

    const applyToolPose = (object: THREE.Object3D, angle: number) => {
      const basePosition = object.userData.basePosition as THREE.Vector3 | undefined;
      const baseQuaternion = object.userData.baseQuaternion as THREE.Quaternion | undefined;
      const spinAxis = object.userData.spinAxis as THREE.Vector3 | undefined;
      const spinPivot = object.userData.spinPivot as THREE.Vector3 | undefined;

      if (baseQuaternion && spinAxis) {
        spinQuaternion.setFromAxisAngle(spinAxis, angle);
        object.quaternion.copy(baseQuaternion).multiply(spinQuaternion);
      }

      if (basePosition) {
        object.position.copy(basePosition);
      }

      if (baseQuaternion && spinAxis && spinPivot && angle !== 0) {
        const pivotRotation = new THREE.Quaternion().setFromAxisAngle(spinAxis, angle);
        const rotatedPivot = spinPivot.clone().applyQuaternion(pivotRotation);
        object.position.add(spinPivot.clone().sub(rotatedPivot).applyQuaternion(baseQuaternion));
      }
    };

    const updateToolPositions = (elapsed: number) => {
      loadedObjects.forEach((object, index) => {
        const dragAngle = typeof object.userData.dragAngle === "number" ? object.userData.dragAngle : 0;
        applyToolPose(object, dragAngle);
        object.position.y +=
          Math.sin(elapsed * 0.58 + index * 1.8) * 0.018 * (reduceMotion ? 0 : 1);
      });
    };

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, 1.75);

      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(width, height, false);
      composer.setPixelRatio(pixelRatio);
      composer.setSize(width, height);
      gtaoPass.setSize(
        Math.max(1, Math.floor(width * pixelRatio * 0.6)),
        Math.max(1, Math.floor(height * pixelRatio * 0.6))
      );
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();

      // The desktop canvas intentionally extends 96px to the right so the
      // strainer can rotate without being clipped. Keep the original model
      // scale breakpoint based on the pre-extension width; otherwise a
      // slightly wider canvas can cross 720px and make every tool jump to the
      // larger desktop framing.
      const canvasExtension = window.matchMedia("(min-width: 768px)").matches ? 96 : 0;
      const small = width - canvasExtension < 720;
      camera.position.z = small ? 7.6 : 6.4;
      group.position.set(small ? 0.28 : 0.08, small ? -0.12 : 0.02, 0);
      group.scale.setScalar(small ? 0.76 : 1);
    };

    const updatePointer = (event: PointerEvent) => {
      const bounds = mount.getBoundingClientRect();
      pointer.x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2;
      pointer.y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 2;
    };

    const onPointerMove = (event: PointerEvent) => {
      if (drag.active && drag.tool) {
        drag.targetAngle += (event.clientX - drag.x) * 0.008;
        drag.x = event.clientX;
      }
    };

    const onPointerDown = (event: PointerEvent) => {
      if (event.button !== 0) {
        return;
      }

      updatePointer(event);
      group.updateMatrixWorld(true);
      camera.updateMatrixWorld(true);
      raycaster.setFromCamera(pointer, camera);
      const hit = raycaster.intersectObjects(loadedObjects, true)[0];
      let tool: THREE.Object3D | null = hit?.object ?? null;

      while (tool && !loadedObjects.includes(tool)) {
        tool = tool.parent;
      }

      // Some hollow or double-walled assets can render correctly but expose
      // no front-facing triangle at the exact cursor point. Use their
      // projected bounds as a forgiving fallback so visible tools remain
      // draggable without changing the actual model geometry.
      if (!tool) {
        const bounds = mount.getBoundingClientRect();
        let fallback: THREE.Object3D | null = null;
        let fallbackScore = Number.POSITIVE_INFINITY;

        loadedObjects.forEach((object) => {
          const box = new THREE.Box3().setFromObject(object);
          if (box.isEmpty()) {
            return;
          }

          const corners = [
            new THREE.Vector3(box.min.x, box.min.y, box.min.z),
            new THREE.Vector3(box.min.x, box.min.y, box.max.z),
            new THREE.Vector3(box.min.x, box.max.y, box.min.z),
            new THREE.Vector3(box.min.x, box.max.y, box.max.z),
            new THREE.Vector3(box.max.x, box.min.y, box.min.z),
            new THREE.Vector3(box.max.x, box.min.y, box.max.z),
            new THREE.Vector3(box.max.x, box.max.y, box.min.z),
            new THREE.Vector3(box.max.x, box.max.y, box.max.z)
          ];
          const screen = corners.map((corner) => {
            const projected = corner.project(camera);
            return {
              x: bounds.left + ((projected.x + 1) / 2) * bounds.width,
              y: bounds.top + ((1 - projected.y) / 2) * bounds.height
            };
          });
          const minX = Math.min(...screen.map((point) => point.x));
          const maxX = Math.max(...screen.map((point) => point.x));
          const minY = Math.min(...screen.map((point) => point.y));
          const maxY = Math.max(...screen.map((point) => point.y));

          if (event.clientX < minX || event.clientX > maxX || event.clientY < minY || event.clientY > maxY) {
            return;
          }

          const center = box.getCenter(new THREE.Vector3()).project(camera);
          const centerX = bounds.left + ((center.x + 1) / 2) * bounds.width;
          const centerY = bounds.top + ((1 - center.y) / 2) * bounds.height;
          const score = Math.hypot(event.clientX - centerX, event.clientY - centerY);
          if (score < fallbackScore) {
            fallback = object;
            fallbackScore = score;
          }
        });

        tool = fallback;
      }

      if (!tool) {
        return;
      }

      const selectedTool = tool as THREE.Object3D;

      drag.active = true;
      drag.x = event.clientX;
      drag.tool = selectedTool;
      drag.targetAngle = typeof selectedTool.userData.dragAngle === "number" ? selectedTool.userData.dragAngle : 0;
      drag.angle = drag.targetAngle;
      drag.groupRotationY = group.rotation.y;
      mount.setPointerCapture(event.pointerId);
    };

    const onPointerUp = (event: PointerEvent) => {
      drag.active = false;
      drag.tool = null;
      if (mount.hasPointerCapture(event.pointerId)) {
        mount.releasePointerCapture(event.pointerId);
      }
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);
    resize();

    mount.addEventListener("pointermove", onPointerMove, { passive: true });
    mount.addEventListener("pointerdown", onPointerDown);
    mount.addEventListener("pointerup", onPointerUp);
    mount.addEventListener("pointercancel", onPointerUp);

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      if (drag.active) {
        // Freeze the shared ambient turn while dragging so only the selected
        // tool responds to horizontal movement.
        group.rotation.y = drag.groupRotationY;
      } else {
        group.rotation.y = reduceMotion ? 0 : Math.sin(elapsed * 0.22) * 0.02;
      }

      if (drag.tool) {
        drag.angle += (drag.targetAngle - drag.angle) * 0.16;
        drag.tool.userData.dragAngle = drag.angle;
      }

      // All three tools rotate around their own anchored axis (the strainer
      // also keeps its authored pivot), so the drag never translates one tool
      // through another. Avoid broad AABB rollback here: it falsely treats
      // the intentional layered composition as a collision and prevents full
      // 360-degree rotations.
      updateToolPositions(elapsed);

      shakerParts.forEach((part, index) => {
        const phase = elapsed * 0.72 + index * 0.7;
        const baseZ = typeof part.userData.baseZ === "number" ? part.userData.baseZ : part.position.z;
        part.position.z = baseZ + Math.sin(phase) * 0.0028 * (reduceMotion ? 0 : 1);
      });

      composer.render();
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeEventListener("pointermove", onPointerMove);
      mount.removeEventListener("pointerdown", onPointerDown);
      mount.removeEventListener("pointerup", onPointerUp);
      mount.removeEventListener("pointercancel", onPointerUp);
      environmentTarget.dispose();
      pmremGenerator.dispose();
      gtaoPass.dispose();
      composer.dispose();
      renderer.dispose();
      renderer.domElement.remove();

      scene.traverse((child) => {
        if (child instanceof THREE.Mesh) {
          child.geometry.dispose();
        }
      });
    };
  }, []);

  return (
    <div className="home-hero__tool-canvas" ref={mountRef} aria-hidden="true" />
  );
}

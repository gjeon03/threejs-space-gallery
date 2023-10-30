import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImagePanel } from "./ImagePanel";
import gsap from "gsap";

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");

  if (!canvas) return;

  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 3;
  camera.position.z = 5;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  // Mesh
  const planeGeometry = new THREE.PlaneGeometry(0.2, 0.2);

  const textureLoader = new THREE.TextureLoader();

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 14, 8);
  const spherePositionArray = sphereGeometry.attributes.position.array;
  const randomPositionArray = [] as number[];
  for (let i = 0; i < spherePositionArray.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 10);
  }

  // 여러개의 Plane Mesh 생성
  const imagePanels = [] as ImagePanel[];
  let imagePanel;
  // for (let i = 0; i < spherePositionArray.length; i += 3) {
  //   imagePanel = new ImagePanel({
  //     shapeType: "sphere",
  //     textureLoader,
  //     scene,
  //     geometry: planeGeometry,
  //     imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
  //     x: spherePositionArray[i],
  //     y: spherePositionArray[i + 1],
  //     z: spherePositionArray[i + 2],
  //   });

  //   // imagePanels.push(imagePanel);
  // }

  //배경
  const backGroundTexture = new THREE.CubeTextureLoader().load([
    "images/px_eso0932a.jpg",
    "images/nx_eso0932a.jpg",
    "images/py_eso0932a.jpg",
    "images/ny_eso0932a.jpg",
    "images/pz_eso0932a.jpg",
    "images/nz_eso0932a.jpg",
  ]);
  scene.background = backGroundTexture;

  const cylinderGeometry = new THREE.CylinderGeometry(
    1, // 상단 반지름
    1, // 하단 반지름
    4, // 높이
    16, // 원기둥 주위의 세그먼트 수
    16 // 원기둥 높이의 세그먼트 수
  );

  for (let i = 0; i < spherePositionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      shapeType: "cylinder",
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
      x: cylinderGeometry.attributes.position.array[i], // x 좌표 설정
      y: cylinderGeometry.attributes.position.array[i + 1], // y 좌표 설정
      z: cylinderGeometry.attributes.position.array[i + 2], // z 좌표 설정
    });

    imagePanels.push(imagePanel);
  }

  // const planeGeometry = new THREE.PlaneGeometry(1, 1);
  // 이미지 배열 생성 (예: 4개의 이미지)
  // const imageCount = 50;
  // // const imagePanels = [];
  // // 그리드 크기 설정
  // const gridRows = 10;
  // const gridColumns = 10;
  // const panelSize = 0.4; // 이미지 패널 크기 조절

  // for (let row = 0; row < spherePositionArray.length / 40; row++) {
  //   for (let col = 0; col < spherePositionArray.length / 40; col++) {
  //     const imagePanel = new ImagePanel({
  //       shapeType: "plane", // 평면을 사용한다고 지정
  //       textureLoader,
  //       scene,
  //       geometry: planeGeometry,
  //       imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
  //       x: col * panelSize - (gridColumns / 2) * panelSize,
  //       y: row * panelSize - (gridRows / 2) * panelSize,
  //       z: 0,
  //     });

  //     imagePanels.push(imagePanel);
  //   }
  // }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    controls.update();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  function setShape(e: any) {
    const type = e.target.dataset.type;
    let array;

    switch (type) {
      case "random":
        array = randomPositionArray;
        break;
      case "cylinder":
        array = cylinderGeometry.attributes.position.array;
        break;
      case "plane":
        array = new THREE.PlaneGeometry(2, 2, 10, 10).attributes.position.array;
        break;
      case "sphere":
      default:
        array = spherePositionArray;
        break;
    }

    for (let i = 0; i < imagePanels.length; i++) {
      // 위치 이동
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: array[i * 3],
        y: array[i * 3 + 1],
        z: array[i * 3 + 2],
      });

      // 회전
      if (type === "random" || type === "plane") {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: 0,
          y: 0,
          z: 0,
        });
      } else if (type === "cylinder") {
        // 이미지 패널을 중심축을 바라보도록 회전
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].cylinderRotationX,
          y: imagePanels[i].cylinderRotationY,
          z: imagePanels[i].cylinderRotationZ,
        });
      } else if (type === "sphere") {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].sphereRotationX,
          y: imagePanels[i].sphereRotationY,
          z: imagePanels[i].sphereRotationZ,
        });
      }
    }
  }

  // 버튼
  const btnWrapper = document.createElement("div");
  btnWrapper.classList.add("btns");

  const randomBtn = document.createElement("button");
  randomBtn.dataset.type = "random";
  randomBtn.style.cssText = "position: absolute; right: 20px; top: 20px";
  randomBtn.innerHTML = "Random";
  btnWrapper.append(randomBtn);

  const sphereBtn = document.createElement("button");
  sphereBtn.dataset.type = "sphere";
  sphereBtn.style.cssText = "position: absolute; right: 20px; top: 50px";
  sphereBtn.innerHTML = "Sphere";
  btnWrapper.append(sphereBtn);

  const cylinderBtn = document.createElement("button");
  cylinderBtn.dataset.type = "cylinder";
  cylinderBtn.style.cssText = "position: absolute; right: 20px; top: 80px";
  cylinderBtn.innerHTML = "cylinder";
  btnWrapper.append(cylinderBtn);

  const planeBtn = document.createElement("button");
  planeBtn.dataset.type = "plane";
  planeBtn.style.cssText = "position: absolute; right: 20px; top: 110px";
  planeBtn.innerHTML = "plane";
  btnWrapper.append(planeBtn);

  document.body.append(btnWrapper);

  // 이벤트
  btnWrapper.addEventListener("click", setShape);
  window.addEventListener("resize", setSize);

  draw();
}

example();

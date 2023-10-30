import { MeshBasicMaterial, DoubleSide, Mesh } from "three";

export class ImagePanel {
  mesh: Mesh;
  shapeType: string;
  sphereRotationX: number = 0; // 초기화
  sphereRotationY: number = 0; // 초기화
  sphereRotationZ: number = 0; // 초기화
  cylinderRotationX: number = 0; // 초기화
  cylinderRotationY: number = 0; // 초기화
  cylinderRotationZ: number = 0; // 초기화
  constructor(info: any) {
    const texture = info.textureLoader.load(info.imageSrc);
    const material = new MeshBasicMaterial({
      map: texture,
      side: DoubleSide,
    });

    this.mesh = new Mesh(info.geometry, material);
    this.mesh.position.set(info.x, info.y, info.z);
    // this.mesh.lookAt(0, 0, 0);

    // 초기 회전 각도 설정
    this.shapeType = info.shapeType;
    this.setInitialRotation(); // 초기 회전을 설정하는 메서드 호출

    // Sphere 상태의 회전각을 저장해 둠
    // this.sphereRotationX = this.mesh.rotation.x;
    // this.sphereRotationY = this.mesh.rotation.y;
    // this.sphereRotationZ = this.mesh.rotation.z;

    // this.cylinderRotationX = this.mesh.rotation.x; // 원기둥 회전 각도 초기화
    // this.cylinderRotationY = this.mesh.rotation.y; // 원기둥 회전 각도 초기화
    // this.cylinderRotationZ = this.mesh.rotation.z; // 원기둥 회전 각도 초기화

    info.scene.add(this.mesh);
  }
  // 초기 회전을 설정하는 메서드
  setInitialRotation() {
    if (this.shapeType === "sphere") {
      this.mesh.lookAt(0, 0, 0);
      this.sphereRotationX = this.mesh.rotation.x;
      this.sphereRotationY = this.mesh.rotation.y;
      this.sphereRotationZ = this.mesh.rotation.z;
    } else if (this.shapeType === "cylinder") {
      this.mesh.lookAt(0, this.mesh.position.y, 0);
      this.cylinderRotationX = this.mesh.rotation.x;
      this.cylinderRotationY = this.mesh.rotation.y;
      this.cylinderRotationZ = this.mesh.rotation.z;
    }
    // 다른 형태의 이미지 패널의 초기 회전 설정 추가 가능
  }
}

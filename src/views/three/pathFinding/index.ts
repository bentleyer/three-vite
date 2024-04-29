import * as THREE from 'three';
import { Pathfinding } from 'three-pathfinding';
import * as mock from './mock';
import { MeshBVH } from 'three-mesh-bvh';

const geometry = new THREE.BufferGeometry();
const vertices = new Float32Array(
    mock.newPosition
);
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
const newIndex = new Uint16Array(
    mock.newIndex
);
geometry.setIndex(new THREE.BufferAttribute(newIndex, 1));
// 创建一个简单的矩形. 在这里我们左上和右下顶点被复制了两次。
// 因为在两个三角面片里，这两个顶点都需要被用到。

const bvh = new MeshBVH(geometry);
console.log('bvh', bvh)
// Create level.
const pathfinding = new Pathfinding();
const ZONE = 'level1';
pathfinding.setZoneData(ZONE, Pathfinding.createZone(geometry));

const a = new THREE.Vector3(0.1, 0, 0);

const b = new THREE.Vector3(10, 0, 2);


// Find path from A to B.
const groupID = pathfinding.getGroup(ZONE, b);
const path = pathfinding.findPath(a, b, ZONE, groupID);

console.log('path', path, pathfinding, groupID);


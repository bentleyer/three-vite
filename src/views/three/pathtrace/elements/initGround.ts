import * as THREE from 'three';

export function initGround({
    scene
}: {
    scene: THREE.Scene
}) {

    // const geometry = new THREE.PlaneGeometry(100, 100);
    // const geometry = new THREE.BoxGeometry(100, 100, 1);

    // const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffdd99 });
    // const material = new THREE.ShadowMaterial({ color: 'red' });
    // // material.opacity = 0.2;

    // const ground = new THREE.Mesh(geometry, material);
    // const ground2 = new THREE.Mesh(geometry, planeMaterial);

    // ground2.position.set(0, 0, -5);
    // // ground2.rotation.x = -Math.PI / 2;
    // ground2.scale.set(10, 10, 10);
    // ground2.castShadow = false;
    // ground2.receiveShadow = true;

    const geometry = new THREE.PlaneGeometry( 100, 100 );
    const material = new THREE.MeshStandardMaterial( {color: 0xffdd99, side: THREE.FrontSide} );
    const plane = new THREE.Mesh( geometry, material );
    plane.scale.set(10, 10, 10);
    plane.castShadow = false;
    plane.receiveShadow = true;
    scene.add( plane );
    

    // const buffer1 = createBufferGeometry()
    // buffer1.computeVertexNormals()

    // const ground3 = new THREE.Mesh(buffer1, planeMaterial);
    // ground3.scale.set(1000, 1000, 10);
    // ground3.castShadow = false;
    // ground3.receiveShadow = true;


    // scene.add(ground2);


}
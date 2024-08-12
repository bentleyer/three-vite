import * as THREE from 'three';

const pos = {
    "x": 8.7498,
    "y": -493.22440000000006,
    "z": 0.01
}


const project1 = {
    "elements": [
        1.0223691494897273,
        0,
        0,
        0,
        0,
        1.3032253728412058,
        0,
        0,
        0,
        0,
        -1.0006668889629877,
        -1,
        0,
        0,
        -2.0006668889629875,
        0
    ]
}

const inverse1 = {
    "elements": [
        0.9998447831798452,
        -0.013900565652492071,
        0.010825147693652871,
        0,
        0.01761844340594936,
        0.7888556174150978,
        -0.614325976436449,
        0,
        -1.7347234759768075e-18,
        0.6144213449638498,
        0.7889780800838604,
        0,
        -294.80994950028906,
        176.9385685722071,
        -268.0518682249083,
        1.0000000000000002
    ]
}

const camera1 = {
    "x": 300.1254372893677,
    "y": -299.05611702767146,
    "z": 102.77221507686616
}

const res1 = {
    "x": 8.7498,
    "y": -493.22440000000006,
    "z": 0.01
}

const project2 = {
    "elements": [
        1.0223691494897273,
        0,
        0,
        0,
        0,
        1.3032253728412058,
        0,
        0,
        0,
        0,
        -1.0006668889629877,
        -1,
        0,
        0,
        -2.0006668889629875,
        0
    ]
}

const inverse2 = {
    "elements": [
        0.9999943574497175,
        0.002982240129853554,
        -0.0015463869290904344,
        0,
        -0.0033593256356850383,
        0.8877446326531926,
        -0.4603239969051382,
        0,
        0,
        0.4603265943210931,
        0.8877496418251848,
        0,
        -299.4476680092679,
        193.47899202678136,
        -230.58495979032753,
        1
    ]
}

const camera2 = {
    "x": 298.5124039785737,
    "y": -278.9096692475088,
    "z": 115.63818999177174
}

const res2 = {
    "x": -83.32143741650711,
    "y": -89.78777104807078,
    "z": 0.4365562024594227
}

const projectObj = (pos, project, inverse) => {
    const position = new THREE.Vector3(pos.x, pos.y, pos.z);
    const position2 = new THREE.Vector3(pos.x, pos.y, pos.z);
    const matrix1 = new THREE.Matrix4().copy(inverse)
    const matrix2 = new THREE.Matrix4().copy(project)
    const apply1 = position.clone().applyMatrix4(matrix1)
    apply1.z = -Math.abs(apply1.z)
    const apply2 = apply1.clone().applyMatrix4(matrix2)
    console.log('project', pos, apply1, apply2);
};

// projectObj(pos, project1, inverse1)
// projectObj(pos, project2, inverse2)



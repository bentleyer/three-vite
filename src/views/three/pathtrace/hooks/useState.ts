import Stats from 'three/addons/libs/stats.module.js';


export function useState() {
    const stats = new Stats();
    document.body.appendChild(stats.dom);
    return {
        stats
    }
}
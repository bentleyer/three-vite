import './math/test'


// 获取当前文件的绝对路径
const currentUrl = new URL(import.meta.url).pathname;

// 提取当前文件所在的目录路径
const currentDir = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);

// 构建目标路径
export const srcPath = currentDir + '../';

export const dracePath = currentDir + '../assets/libs/draco/gltf/';

export const getIndex = (len = 1) => {
    const index = [];
    for (let i = 0; i < len - 1; i++) {
        index.push(i, len * 2 - i - 1, len * 2 - i - 2);
        index.push(i, len * 2 - i - 2, i + 1);
    }
    return index;
};
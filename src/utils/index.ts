// 获取当前文件的绝对路径
const currentUrl = new URL(import.meta.url).pathname;

// 提取当前文件所在的目录路径
const currentDir = currentUrl.substring(0, currentUrl.lastIndexOf('/') + 1);

// 构建目标路径
export const srcPath = currentDir + '../';

export const dracePath = currentDir + '../assets/libs/draco/gltf/';
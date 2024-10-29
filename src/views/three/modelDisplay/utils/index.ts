export interface AnyObject {
    [key: string]: any;
}
export function findKeyByValue(obj: AnyObject, value: any) {
    // 遍历对象的键
    for (let key in obj) {
        // 如果当前键对应的值等于给定的值
        if (obj[key] === value) {
            return key; // 返回找到的键
        }
    }
    return null; // 如果没有找到匹配的键，返回 null
}
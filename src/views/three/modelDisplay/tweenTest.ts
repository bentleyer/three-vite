import TWEEN from "@tweenjs/tween.js";
const preInfo = [
    {
        "id": "环境车辆1",
        "x": -4.7104,
        "y": 97.6888,
        "length": 4.522,
        "width": 1.907,
        "height": 1.327,
        "phi": -1.5659
    }
]
const nextInfo = [
    {
        "id": "环境车辆1",
        "x": -4.7104,
        "y": 97.6888,
        "length": 4.522,
        "width": 1.907,
        "height": 1.327,
        "phi": -1.5659
    }
]
const tween1 = new TWEEN.Tween(preInfo)
.to(
nextInfo,
  100
)
.start(0);
tween1.update(20);
TWEEN.removeAll();

console.log('nextInfo', preInfo)
document.getElementById('increaseATemperature').addEventListener('click', () => increaseTemperature(0));
document.getElementById('increaseBTemperature').addEventListener('click', () => increaseTemperature(1));
document.getElementById('increaseCTemperature').addEventListener('click', () => increaseTemperature(2));
document.getElementById('decreaseATemperature').addEventListener('click', () => decreaseTemperature(0));
document.getElementById('decreaseBTemperature').addEventListener('click', () => decreaseTemperature(1));
document.getElementById('decreaseCTemperature').addEventListener('click', () => decreaseTemperature(2));
canvas.addEventListener('mousedown', handleMouseDown);

document.getElementById('block-a-select').addEventListener('change', handleMaterialSelectionForBlockA)

runSimulation();

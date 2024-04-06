function drawBlocks() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    blocks.forEach(block => {
        ctx.fillStyle = block.color;
        ctx.fillRect(block.x, block.y, blockWidth, blockHeight);
        ctx.fillStyle = '#000';
        ctx.font = '24px Arial';
        ctx.fillText(block.label, block.x + 40, block.y + 60);
        ctx.font = '14px Arial';
        ctx.fillText(`Temp: ${block.temperature.toFixed(1)}°C`, block.x, block.y - 5);
        ctx.fillText(materialProperties[block.material].name, block.x + 10, block.y + blockHeight - 5);
    });
}

function equalizeTemperature() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - lastUpdateTime) / temperatureExchangeRate; // Tempo decorrido em segundos

    for (let i = 0; i < blocks.length; i++) {
        for (let j = i + 1; j < blocks.length; j++) {
            const block1 = blocks[i];
            const block2 = blocks[j];
            const blocksInContact = block1.x < block2.x + blockWidth &&
                block1.x + blockWidth > block2.x &&
                block1.y < block2.y + blockHeight &&
                block1.y + blockHeight > block2.y;

            if (blocksInContact) {
                // Calcular a quantidade de calor transferida (Q) usando a fórmula Q = mcΔT
                const mass1 = block1.mass;
                const mass2 = block2.mass;
                const specificHeat1 = materialProperties[block1.material].specificHeat;
                const specificHeat2 = materialProperties[block2.material].specificHeat;
                const temperatureDifference = Math.abs(block1.temperature - block2.temperature);
                let heatTransfer = (mass1 * specificHeat1 * temperatureDifference / (mass1 + mass2)) * deltaTime;

                // Verificar se o calor transferido excede a diferença de temperatura
                if (heatTransfer > temperatureDifference) {
                    heatTransfer = temperatureDifference;
                }

                // Atualizar as temperaturas dos blocos
                if (block1.temperature > block2.temperature) {
                    block1.temperature -= heatTransfer / (mass1 * specificHeat1);
                    block2.temperature += heatTransfer / (mass2 * specificHeat2);
                } else {
                    block1.temperature += heatTransfer / (mass1 * specificHeat1);
                    block2.temperature -= heatTransfer / (mass2 * specificHeat2);
                }

                // Verificar se as temperaturas estão dentro dos limites dos materiais
                const minTemperature = Math.min(materialProperties[block1.material].minTemperature, materialProperties[block2.material].minTemperature);
                const maxTemperature = Math.max(materialProperties[block1.material].maxTemperature, materialProperties[block2.material].maxTemperature);
                block1.temperature = Math.max(minTemperature, Math.min(maxTemperature, block1.temperature));
                block2.temperature = Math.max(minTemperature, Math.min(maxTemperature, block2.temperature));

                // Verificar se o material do bloco de gelo deve mudar para água
                if (blocks[i].material === 'ice' && blocks[i].temperature > 0) {
                    changeMaterial(i, 'water');
                }

                // Verificar se o material do bloco de água deve mudar para gelo
                if (blocks[i].material === 'water' && blocks[i].temperature <= 0) {
                    changeMaterial(i, 'ice');
                }
            }
        }
    }
    lastUpdateTime = currentTime;
}

function increaseTemperature(blockIndex) {
    blocks[blockIndex].temperature += 10;
}

function decreaseTemperature(blockIndex) {
    blocks[blockIndex].temperature -= 10;
}

function handleMouseDown(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    blocks.forEach((block, index) => {
        if (mouseX >= block.x && mouseX <= block.x + blockWidth &&
            mouseY >= block.y && mouseY <= block.y + blockHeight) {
            selectedBlockIndex = index;
            initialX = mouseX - block.x;
            initialY = mouseY - block.y;
            canvas.addEventListener('mousemove', handleMouseMove);
            canvas.addEventListener('mouseup', handleMouseUp);
        }
    });
}

function handleMouseMove(event) {
    const mouseX = event.clientX - canvas.getBoundingClientRect().left;
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;

    if (selectedBlockIndex !== -1) {
        const block = blocks[selectedBlockIndex];
        block.x = mouseX - initialX;
        block.y = mouseY - initialY;
        drawBlocks();
    }
}

function handleMouseUp() {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseup', handleMouseUp);
    selectedBlockIndex = -1;
}

function changeMaterial(blockIndex, material) {
    blocks[blockIndex].material = material;
    blocks[blockIndex].specificHeat = materialProperties[material].specificHeat;
    blocks[blockIndex].latentHeat = materialProperties[material].latentHeat;
    blocks[blockIndex].temperature = materialProperties[material].averageTemperature;
}

function handleMaterialSelection(event) {
    const material = event.target.getAttribute('data-material');
    const blockIndex = blocks.findIndex(block => block.label === event.target.getAttribute('data-block'));

    if (blockIndex !== -1) {
        changeMaterial(blockIndex, material);
    }
}

function runSimulation() {
    if (isSimulationRunning) {
        equalizeTemperature();
        drawBlocks();
    }
    requestAnimationFrame(runSimulation);
}

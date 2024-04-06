let initialX, initialY;
let selectedBlockIndex = -1;
let isSimulationRunning = true;
let lastUpdateTime = Date.now();

const blockWidth = 100;
const blockHeight = 100;
const timeInterval = 10000; // Intervalo de tempo em milissegundos
const temperatureExchangeRate = 10000;

const ctx = canvas.getContext('2d');

const blocks = [
  {
    x: 50,
    y: 50,
    color: '#ff6666',
    temperature: 0,
    label: 'A',
    material: 'ice',
    mass: 1
  },
  {
    x: 250,
    y: 50,
    color: '#00bfff',
    temperature: 60,
    label: 'B',
    material: 'water',
    mass: 1
  },
  {
    x: 450,
    y: 50,
    color: '#28f200',
    temperature: 20,
    label: 'C',
    material: 'glass',
    mass: 1
  }
];
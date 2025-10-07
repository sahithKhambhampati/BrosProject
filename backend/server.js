const express = require('express');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// --- Simulation State ---
const FLOORS = 10;
const PODS = 5;

let pods = Array.from({ length: PODS }, (_, i) => ({
  id: i,
  status: 'idle', // 'idle', 'moving', 'at-floor'
  currentFloor: 0,
  destinationFloor: null,
  package: null,
}));

let deliveryQueue = [];
let liftStatus = 'idle'; // 'idle', 'moving'

// --- API Endpoints ---

// Get the current state of the system
app.get('/status', (req, res) => {
  res.json({
    pods,
    liftStatus,
    deliveryQueue,
  });
});

// Create a new delivery request
app.post('/delivery', (req, res) => {
  const { floor, packageName } = req.body;

  if (!floor || !packageName || floor < 1 || floor > FLOORS) {
    return res.status(400).json({ error: 'Invalid delivery request. Please provide a valid floor and package name.' });
  }

  const delivery = { floor, packageName, id: Date.now() };
  deliveryQueue.push(delivery);

  // Simple check to process queue
  if (liftStatus === 'idle') {
    processDeliveryQueue();
  }

  res.status(201).json(delivery);
});

// --- Simulation Logic ---

function processDeliveryQueue() {
  if (deliveryQueue.length === 0) {
    liftStatus = 'idle';
    return;
  }

  const availablePod = pods.find(p => p.status === 'idle' && p.currentFloor === 0);
  if (!availablePod) {
    // No pods available at the base, wait for one to return
    liftStatus = 'idle'; // Or could be 'waiting_for_pod'
    console.log("No pods available at base. Waiting...");
    return;
  }

  liftStatus = 'moving';
  const delivery = deliveryQueue.shift();

  availablePod.status = 'moving';
  availablePod.destinationFloor = delivery.floor;
  availablePod.package = { name: delivery.packageName };

  console.log(`Pod ${availablePod.id} is delivering "${delivery.packageName}" to floor ${delivery.floor}`);

  // Simulate lift movement
  const travelTime = Math.abs(delivery.floor - availablePod.currentFloor) * 1000; // 1 second per floor

  setTimeout(() => {
    availablePod.status = 'at-floor';
    availablePod.currentFloor = delivery.floor;
    console.log(`Pod ${availablePod.id} has arrived at floor ${delivery.floor}`);

    // Simulate resident picking up the package after 5 seconds
    setTimeout(() => {
      console.log(`Package from pod ${availablePod.id} collected. Returning to base.`);
      availablePod.package = null;
      availablePod.status = 'moving';
      availablePod.destinationFloor = 0;

      const returnTime = availablePod.currentFloor * 1000;
      setTimeout(() => {
        availablePod.status = 'idle';
        availablePod.currentFloor = 0;
        availablePod.destinationFloor = null;
        console.log(`Pod ${availablePod.id} has returned to base.`);

        // Process next item in queue
        processDeliveryQueue();
      }, returnTime);

    }, 5000);

  }, travelTime);
}


app.listen(port, () => {
  console.log(`AI-SDLS backend listening at http://localhost:${port}`);
});
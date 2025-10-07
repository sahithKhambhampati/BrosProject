document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Elements ---
    const floorsContainer = document.getElementById('floors');
    const liftContainer = document.getElementById('lift');
    const deliveryForm = document.getElementById('delivery-form');
    const floorInput = document.getElementById('floor-input');
    const packageInput = document.getElementById('package-input');
    const liftStatusEl = document.getElementById('lift-status');
    const deliveryQueueEl = document.getElementById('delivery-queue');

    // --- Simulation Constants ---
    const FLOORS = 10;
    const PODS = 5;

    // --- Simulation State (formerly backend) ---
    let pods = Array.from({ length: PODS }, (_, i) => ({
        id: i,
        status: 'idle', // 'idle', 'moving', 'at-floor'
        currentFloor: 0,
        destinationFloor: null,
        package: null,
    }));
    let deliveryQueue = [];
    let liftStatus = 'idle'; // 'idle', 'moving'

    // --- Core Simulation Logic (formerly backend) ---
    function processDeliveryQueue() {
        if (deliveryQueue.length === 0) {
            liftStatus = 'idle';
            renderState(); // Update UI
            return;
        }

        const availablePod = pods.find(p => p.status === 'idle' && p.currentFloor === 0);
        if (!availablePod) {
            liftStatus = 'waiting_for_pod';
            console.log("No pods available at base. Waiting...");
            renderState(); // Update UI
            return;
        }

        liftStatus = 'moving';
        const delivery = deliveryQueue.shift();

        availablePod.status = 'moving';
        availablePod.destinationFloor = delivery.floor;
        availablePod.package = { name: delivery.packageName };

        console.log(`Pod ${availablePod.id} is delivering "${delivery.packageName}" to floor ${delivery.floor}`);
        renderState();

        const travelTime = Math.abs(delivery.floor - availablePod.currentFloor) * 1000; // 1 second per floor

        setTimeout(() => {
            availablePod.status = 'at-floor';
            availablePod.currentFloor = delivery.floor;
            console.log(`Pod ${availablePod.id} has arrived at floor ${delivery.floor}`);
            renderState();

            // Simulate resident picking up the package
            setTimeout(() => {
                console.log(`Package from pod ${availablePod.id} collected. Returning to base.`);
                availablePod.package = null;
                availablePod.status = 'moving';
                availablePod.destinationFloor = 0;
                renderState();

                const returnTime = availablePod.currentFloor * 1000;
                setTimeout(() => {
                    availablePod.status = 'idle';
                    availablePod.currentFloor = 0;
                    availablePod.destinationFloor = null;
                    console.log(`Pod ${availablePod.id} has returned to base.`);

                    // Process next item in queue
                    processDeliveryQueue();
                }, returnTime);

            }, 5000); // 5 seconds to collect

        }, travelTime);
    }

    // --- UI Rendering ---
    function renderState() {
        // Render pods
        pods.forEach(pod => {
            const podEl = document.getElementById(`pod-${pod.id}`);
            podEl.className = 'pod'; // Reset class
            podEl.innerText = pod.package ? pod.package.name.substring(0, 8) : '';

            const floorHeight = 600 / FLOORS;
            podEl.style.bottom = `${pod.currentFloor * floorHeight}px`;

            if (pod.status !== 'idle') {
                podEl.classList.add(pod.status);
            }
        });

        // Render lift status
        liftStatusEl.innerText = liftStatus;

        // Render delivery queue
        deliveryQueueEl.innerHTML = '';
        deliveryQueue.forEach(item => {
            const li = document.createElement('li');
            li.innerText = `Package "${item.packageName}" to Floor ${item.floor}`;
            deliveryQueueEl.appendChild(li);
        });
    }

    // --- Event Handlers ---
    function dispatchDelivery(e) {
        e.preventDefault();
        const floor = parseInt(floorInput.value, 10);
        const packageName = packageInput.value;

        if (!floor || !packageName || floor < 1 || floor > FLOORS) {
            alert('Invalid delivery request. Please provide a valid floor and package name.');
            return;
        }

        const delivery = { floor, packageName, id: Date.now() };
        deliveryQueue.push(delivery);

        deliveryForm.reset();
        renderState(); // Update UI immediately

        if (liftStatus === 'idle' || liftStatus === 'waiting_for_pod') {
            processDeliveryQueue();
        }
    }

    // --- Initialization ---
    function initializeSimulation() {
        // Render floors
        for (let i = FLOORS; i >= 1; i--) {
            const floorEl = document.createElement('div');
            floorEl.className = 'floor-label';
            floorEl.innerText = `F${i}`;
            floorsContainer.appendChild(floorEl);
        }

        // Render pods
        pods.forEach(pod => {
            const podEl = document.createElement('div');
            podEl.className = 'pod';
            podEl.id = `pod-${pod.id}`;
            podEl.style.bottom = '0px';
             // Stagger pods for visibility at base
            podEl.style.left = `${10 + (pod.id * 15)}%`;
            liftContainer.appendChild(podEl);
        });

        deliveryForm.addEventListener('submit', dispatchDelivery);

        renderState(); // Initial render
    }

    initializeSimulation();
});
# AI-Powered Smart Delivery Lift System (AI-SDLS) - Software Prototype

This repository contains a web-based software prototype for the AI-Powered Smart Delivery Lift System (AI-SDLS). The prototype simulates the core functionality of the system, including dispatching packages, managing a delivery queue, and visualizing the movement of delivery pods in a lift.

## Overview

The prototype is built as a fully client-side application using static HTML, CSS, and JavaScript. This means it runs entirely in your web browser without needing a backend server or any complex setup.

The simulation logic, which was originally designed for a Node.js backend, has been integrated directly into the frontend JavaScript to bypass environmental issues encountered during development.

## How to Run the Prototype

Since this is a static web application, you do not need to install any dependencies or run any build commands.

1.  **Clone the repository** to your local machine (if you haven't already).
2.  **Navigate to the `frontend` directory** within the project.
3.  **Open the `index.html` file** in any modern web browser (like Chrome, Firefox, or Safari).

That's it! You can now interact with the simulation.

## How to Use the Simulation

-   **Dispatch a Delivery:** Use the "Security Gate Control" form on the right.
    -   Enter a floor number (1-10).
    -   Enter a name for the package.
    -   Click "Dispatch Delivery".
-   **Observe the System:**
    -   The "System Status" board will show the lift's current state (`idle`, `moving`, etc.).
    -   You will see the delivery pods in the lift shaft on the left move to their designated floors. The pod's color will change to indicate its status.
    -   The simulation includes delays to mimic travel time and package collection by the resident.

## Project Structure

-   `frontend/`: Contains all the files for the client-side application.
    -   `index.html`: The main structure of the web page.
    -   `style.css`: Styles for the visual presentation of the simulation.
    -   `app.js`: Contains all the simulation logic and UI manipulation code.
-   `backend/`: Contains the initial, now unused, Node.js backend files.
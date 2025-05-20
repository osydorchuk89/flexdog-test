# App for managing product wishlists

## Overview

This is a test app that allows registered and logged in users to create/edit/delete wishlists, add/remove products to/from them, move products between wishlists, and add products from wishlists to a shopping cart.

## Installation & setup

### 1. Clone the repository

Clone the repository to your local machine by running the following command:

`git clone https://github.com/osydorchuk89/flexdog-test.git`

Next, navigate to the created directory:

`cd flexdog-test`

### 2. Install dependencies

Install required dependencies with the command:

`npm install`

### 3. Run the app

Run the application by entering the following command:

`npm run dev`

The app is now accessible at [http://localhost:3000](http://localhost:3000).

## Installation with Docker

Alternatively, you can run the app using Docker. For this, make sure that Docker is installed and running on your machine. After cloning the repository and navigating to the target directory, build and run a Docker container, using the following commands:

`docker build -t flexdog-test .`

`docker run -p 3000:3000 flexdog-test`

The app is again accesible at [http://localhost:3000](http://localhost:3000).

# PlaceFindr

This README will guide you through the steps to get your local environment up and running.

## Getting Started

Follow these steps to set up the project locally and run the server.

### 1. Clone the Repository

First, clone the repository to your local machine.

### 2. Install the Dependencies

In the project's root directory, run the following command to install all the required dependencies:
```bash
npm install
```

This will create a `node_modules` folder and install all the packages specified in the `package.json` file.

### 3. Start the Frontend

Once the dependencies are installed, you can start the server by running:

```bash
node /public/frontend.js
```

This will start the frontend and make it available at http://localhost:3000.

### 4. Start the Server

Once the dependencies are installed, you can start the server by running:

```bash
node /server/server.js
```

This will start the server and make it available at http://localhost:5000.

### 5. Add Your IP Address to Azure SQL Server

- Open the connected SQL Server Azure (not available for use outside of this project).
- Go to Security > Networking
- Add your client IPv4 address to the firewall rules and save this change.

This will allow your local machine to access the SQL database.

### 6. Connect to the Application

After the frontend and backend servers are running, open your browser and navigate to:

http://localhost:3000

You should be able to access the application running locally on your machine.

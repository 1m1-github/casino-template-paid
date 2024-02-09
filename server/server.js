const path = require('path');
const express = require('express');
const config = require('./config');
// const connectDB = require('./config/db');
const configureMiddleware = require('./middleware');
const configureRoutes = require('./routes');
const socketio = require('socket.io');
const gameSocket = require('./socket/index');
const { Web3 } = require('web3');

// Connect and get reference to mongodb instance
// let db;

// (async function () {
//   db = await connectDB();
// })();

// Init express app
const app = express();

// Config Express-Middleware
configureMiddleware(app);

// Set-up Routes
configureRoutes(app);

// init Web3
const web3 = new Web3('https://mainnet.infura.io/v3/69ecd65c6b784803bb45b8370caff369');

// new API added here
// fetching the balance of an Ethereum address
app.get('/imiapitest', async (req, res) => {
  // hardcoded for now
  const contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
  const accountAddress = '0x6081258689a75d253d87cE902A8de3887239Fe80'; // Robinhood
  const contractABI = [];

  try {
      const contract = new web3.eth.Contract(contractABI, contractAddress);
      const balance = await contract.methods.balanceOf(accountAddress).call();
      console.log(`Balance: ${balance}`);
      res.json({ balance: balance });
  } catch (error) {
      console.error(`Error fetching data from smart contract: ${error.message}`);
      res.status(500).send('Error fetching data from the smart contract');
  }
});

// Start server and listen for connections
const server = app.listen(config.PORT, () => {
  console.log(
    `Server is running in ${config.NODE_ENV} mode and is listening on port ${config.PORT}...`,
  );
});

//  Handle real-time poker game logic with socket.io
const io = socketio(server);

io.on('connect', (socket) => gameSocket.init(socket, io));

// Error handling - close server
process.on('unhandledRejection', (err) => {
  // db.disconnect();

  console.error(`Error: ${err.message}`);
  server.close(() => {
    process.exit(1);
  });
});

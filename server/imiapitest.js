const { Web3 } = require('web3');

// init Web3
const web3 = new Web3('https://mainnet.infura.io/v3/69ecd65c6b784803bb45b8370caff369');

const imiapitest = async (req, res) => {
    // hardcoded for now
    const contractAddress = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48'; // USDC
    const accountAddress = '0x6081258689a75d253d87cE902A8de3887239Fe80'; // Robinhood
    let contractABI = [
        // balanceOf
        {
            "constant": true,
            "inputs": [{ "name": "_owner", "type": "address" }],
            "name": "balanceOf",
            "outputs": [{ "name": "balance", "type": "uint256" }],
            "type": "function"
        },
    ];

    try {
        const contract = new web3.eth.Contract(contractABI, contractAddress);
        const balance = await contract.methods.balanceOf(accountAddress).call();
        console.log(`Balance: ${balance}`);
        res.json({ balance: balance.toString() });
    } catch (error) {
        console.error(`Error fetching data from smart contract: ${error.message}`);
        res.status(500).send('Error fetching data from the smart contract');
    }
}

module.exports = imiapitest;
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env.contracts') });

const output = {
	network: "mainnet",
	address: process.env.OPENQ_PROXY_ADDRESS,
	startBlock: parseInt(process.env.OPENQ_DEPLOY_BLOCK_NUMBER)
};

fs.writeFileSync('./config/local.json', JSON.stringify(output));
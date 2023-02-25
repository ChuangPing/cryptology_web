// 导入web3
const web3 = require("../util/initWeb3")
let abi = [ { "inputs": [ { "internalType": "string", "name": "_data", "type": "string" } ], "name": "setData", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "data", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "getData", "outputs": [ { "internalType": "string", "name": "", "type": "string" } ], "stateMutability": "view", "type": "function" } ]
// let contractAddress_ropsten = "0x5d8dBf0BDBdf3d921B77c6d3Ad938f3F23D633a4"  //reposten 部署合约，
let contractAddress_ganache = "0x93a08bb05692465375B7b73b0D7D83b04EF5270F" // Ganache 部署合约
// 合约交互实例
// let contractInstance = new web3.eth.Contract(abi, contractAddress_ropsten)
let contractInstance = new web3.eth.Contract(abi, contractAddress_ganache)
// 导出合约交互实例
module.exports = contractInstance
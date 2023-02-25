const Web3 = require("web3")

// 导入浏览器makeMask插件的provider 
const web3 = new Web3 (window.ethereum)

web3.setProvider(window.ethereum)
module.exports = web3
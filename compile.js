const path = require("path");
const fs = require("fs");
const solc = require("solc");
const lotteryPath = path.resolve(__dirname, "contract", "Lottery.sol");
const source = fs.readFileSync(lotteryPath, "utf-8");
// module.exports = {
//   interFace: solc.compile(source, 1).interface,
//   byteCode: solc.compile(source, 1).bytecode,
// };
// console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[":Lottery"];

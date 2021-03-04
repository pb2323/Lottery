const path = require("path");
const fs = require("fs");
const solc = require("solc");
const inboxPath = path.resolve(__dirname, "contract", "Inbox.sol");
const source = fs.readFileSync(inboxPath, "utf-8");
// module.exports = {
//   interFace: solc.compile(source, 1).interface,
//   byteCode: solc.compile(source, 1).bytecode,
// };
// console.log(solc.compile(source, 1));
module.exports = solc.compile(source, 1).contracts[":Inbox"];

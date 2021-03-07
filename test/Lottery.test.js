const assert = require("assert");
const Web3 = require("web3");
const ganache = require("ganache-cli");
const provider = ganache.provider();
const web3 = new Web3(ganache.provider());
const { interface, bytecode } = require("../compile");

let accounts, lottery;

beforeEach(async () => {
  accounts = await web3.eth.getAccounts();
  lottery = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: bytecode })
    .send({ from: accounts[0], gas: "1000000" });
  // lottery.setProvider(provider);
});

describe("Lottery Contract", () => {
  it("deploys a contract", () => {
    assert.ok(lottery.options.address);
  });

  it("allows one account to enter", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("0.011", "ether") });

    const players = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    assert.strictEqual(accounts[0], players[0]);
    assert.strictEqual(1, players.length);
  });
});
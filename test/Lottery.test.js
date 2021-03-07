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

  it("requires a minimum amount of ether to enter", async () => {
    try {
      await lottery.methods.enter().send({ from: accounts[0], value: 20 });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("only manager can call pickWinner", async () => {
    try {
      await lottery.methods.pickWinner().send({ from: accounts[1] });
      assert(false);
    } catch (err) {
      assert(err);
    }
  });

  it("sends money to winner and resets the player array", async () => {
    await lottery.methods
      .enter()
      .send({ from: accounts[0], value: web3.utils.toWei("2", "ether") });

    const initialBalance = await web3.eth.getBalance(accounts[0]);
    await lottery.methods.pickWinner().send({ from: accounts[0] });
    const finalBalance = await web3.eth.getBalance(accounts[0]);
    const playersSize = await lottery.methods
      .getPlayers()
      .call({ from: accounts[0] });
    let contractBalance = lottery.options.address;
    contractBalance = await web3.eth.getBalance(contractBalance);
    assert.strictEqual('0', contractBalance);
    assert(finalBalance - initialBalance > web3.utils.toWei("1.8", "ether"));
    assert.strictEqual(0, playersSize.length);
  });
});

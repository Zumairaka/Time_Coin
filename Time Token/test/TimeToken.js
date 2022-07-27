// We import Chai to use its asserting functions here.
const { expect } = require("chai");

const { ethers } = require("hardhat");

describe("Token contract", function () {
  // Mocha has four functions that let you hook into the the test runner's
  // lifecyle. These are: `before`, `beforeEach`, `after`, `afterEach`.

  // They're very useful to setup the environment for tests, and to clean it
  // up after they run.

  // A common pattern is to declare some variables, and assign them in the
  // `before` and `beforeEach` callbacks.

 
  let
    TimeToken,
    TimeToken_depl,
    owner,
    addr1,
    _companyReserve,
     _equityInvestors,
     _team,
     _liquidity,
     _foundation,
     _rewards,
     _burnAddr,
     _advisors,
     _crowdsale,
     addrs;

  

  // `beforeEach` will run before each test, re-deploying the contract every
  // time. It receives a callback, which can be async.
  beforeEach(async function () {
    // Get the ContractFactory and Signers here.
    await hre.network.provider.send("hardhat_reset");
    TimeToken = await ethers.getContractFactory("TimeToken");
    

    [owner,addr1,
        _companyReserve,
        _equityInvestors,
        _team,
        _liquidity,
        _foundation,
        _rewards,
        _burnAddr,
        _advisors,
        _crowdsale, ... addrs] = await ethers.getSigners();

    // To deploy our contract, we just have to call Token.deploy() and await
    // for it to be deployed(), which happens once its transaction has been
    // mined.
    TimeToken_depl = await TimeToken.deploy(
        _companyReserve.address,
        _equityInvestors.address,
        _team.address,
        _liquidity.address,
        _foundation.address,
        _rewards.address,
        _burnAddr.address,
        _advisors.address,
        _crowdsale.address
    );
  });

  // You can nest describe calls to create subsections.
  describe("Deployment", function () {
    // `it` is another Mocha function. This is the one you use to define your
    // tests. It receives the test name, and a callback function.

    // If the callback function is async, Mocha will `await` it.
    it("Should set the right owner", async function () {
      // Expect receives a value, and wraps it in an Assertion object. These
      // objects have a lot of utility methods to assert values.

      // This test expects the owner variable stored in the contract to be equal
      // to our Signer's owner.
      expect(await TimeToken_depl.owner()).to.equal(owner.address);
    });


    it("Should have the expected name", async function(){
        expect(await TimeToken_depl.name()).to.equal('Time');
    });

    it("Should have expected symbol", async ()=>{
        expect(await TimeToken_depl.symbol()).to.equal('TIME');
    });

    it("Should have expected decimal value", async()=>{
      expect(await TimeToken_depl.decimals()).to.equal(18);
    });

    it("Should mint total supply to be 777,777,777,777 * 1e18", async function () {
    //   console.log(await TimeToken_depl.totalSupply());
      expect(await TimeToken_depl.totalSupply()).to.equal(ethers.BigNumber.from("777777777777000000000000000000"));
    });
  });

  describe("Transfer", function () {
    it("Should transfer the 100 TimeToken tokens from _companyReserve to owner", async function () {
      let tamount = ethers.BigNumber.from("10").pow(20);
      await TimeToken_depl.connect(_companyReserve).transfer(owner.address, tamount);
      const addrbalanceOwner = await TimeToken_depl.balanceOf(owner.address);
      expect(addrbalanceOwner).to.equal(tamount);
    });
  });

  describe("Burn", function(){
    it("Should not allow random burning of tokens", async ()=>{
        let tamount = ethers.BigNumber.from("10").pow(20);
        await TimeToken_depl.connect(_companyReserve).transfer(owner.address, tamount);
        await expect(TimeToken_depl.burn(tamount)).to.be.reverted;
    })

    it("Should allow burning of 100 Time Token by burnAddr", async ()=>{
        let tamount = ethers.BigNumber.from("10").pow(20);
        const initialTS = await TimeToken_depl.totalSupply();
        await TimeToken_depl.connect(_burnAddr).burn(tamount);
        // console.log(await TimeToken_depl.totalSupply());
        expect(await TimeToken_depl.totalSupply()).to.equal(ethers.BigNumber.from(initialTS).sub(tamount));
    })
  })

});

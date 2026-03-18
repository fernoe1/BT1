import { expect } from "chai";
import hre from "hardhat";

describe("P3T Token Contract", function () {
  let token: any;
  let owner: any;
  let alice: any;
  let bob: any;

  const initialSupply = 1_000_000;

  beforeEach(async () => {
    const { ethers } = await hre.network.connect();
    [owner, alice, bob] = await ethers.getSigners();
    token = await ethers.deployContract("P3T", [initialSupply]);
  });

  it("Should have correct initial balance", async function () {
    const { ethers } = await hre.network.connect();
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseEther(initialSupply.toString()));
  });

  it("Should transfer tokens successfully", async function () {
    const { ethers } = await hre.network.connect();
    await expect(token.transfer(alice.address, ethers.parseEther("1000")))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, alice.address, ethers.parseEther("1000"));

    const aliceBalance = await token.balanceOf(alice.address);
    expect(aliceBalance).to.equal(ethers.parseEther("1000"));
  });

  it("Should fail when transferring more than balance", async function () {
    const { ethers } = await hre.network.connect();
    await expect(
        token.connect(alice).transfer(owner.address, ethers.parseEther("1"))
    ).to.be.revert(ethers);
  });

  it("Should emit Transfer event on transfer", async function () {
    const { ethers } = await hre.network.connect();
    await expect(token.transfer(alice.address, ethers.parseEther("100")))
      .to.emit(token, "Transfer")
      .withArgs(owner.address, alice.address, ethers.parseEther("100"));
  });

  it("Should allow transferring to yourself", async function () {
    const { ethers } = await hre.network.connect();
    const initialBalance = await token.balanceOf(owner.address);
    await token.transfer(owner.address, ethers.parseEther("50"));

    const finalBalance = await token.balanceOf(owner.address);
    expect(finalBalance).to.equal(initialBalance);
  });

  it("Should fail when transferring to zero address", async function () {
    const { ethers } = await hre.network.connect();
    await expect(
        token.transfer(ethers.ZeroAddress, ethers.parseEther("100"))
    ).to.be.revert(ethers);
  });

  it("Should estimate gas for transfer", async function () {
    const { ethers } = await hre.network.connect();
    const tx = await token.transfer.populateTransaction(
      alice.address,
      ethers.parseEther("100")
    );
    const gasEstimate = await ethers.provider.estimateGas(tx);
    expect(gasEstimate).to.be.greaterThan(0n);
  });

  it("Should maintain total supply consistency", async function () {
    const { ethers } = await hre.network.connect();
    await token.transfer(alice.address, ethers.parseEther("100"));
    await token.transfer(bob.address, ethers.parseEther("200"));

    const totalSupply = await token.totalSupply();
    const ownerBalance = await token.balanceOf(owner.address);
    const aliceBalance = await token.balanceOf(alice.address);
    const bobBalance = await token.balanceOf(bob.address);

    expect(totalSupply).to.equal(ownerBalance + aliceBalance + bobBalance);
  });

  it("Should handle zero amount transfer", async function () {
    await token.transfer(alice.address, 0n);
    const aliceBalance = await token.balanceOf(alice.address);
    expect(aliceBalance).to.equal(0n);
  });
});

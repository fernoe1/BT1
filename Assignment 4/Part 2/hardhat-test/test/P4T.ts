import { expect } from "chai";
import hre from "hardhat";

describe("Part 4 Token tests", function () {
  let token: any;
  let owner: any;
  let alice: any;
  let bob: any;

  const initialSupply = 1_000_000;

  beforeEach(async () => {
    const { ethers } = await hre.network.connect();
    [owner, alice, bob] = await ethers.getSigners();

    token = await ethers.deployContract("P4T", [
      "Part 4 Token",
      "P4T",
      initialSupply,
    ]);
  });

  it("Should mint initial supply to owner", async () => {
    const { ethers } = await hre.network.connect();
    const balance = await token.balanceOf(owner.address);
    expect(balance).to.equal(ethers.parseEther(initialSupply.toString()));
  });

  it("Owner can mint new tokens", async () => {
    const { ethers } = await hre.network.connect();
    await token.mint(alice.address, ethers.parseEther("1000"));

    const balance = await token.balanceOf(alice.address);
    expect(balance).to.equal(ethers.parseEther("1000"));
  });

  it("Non-owner cannot mint", async () => {
    const { ethers } = await hre.network.connect();
    await expect(
      token.connect(alice).mint(alice.address, 1000)
    ).to.be.revert(ethers);
  });

  it("Should transfer tokens", async () => {
    const { ethers } = await hre.network.connect();
    await token.transfer(alice.address, ethers.parseEther("500"));

    expect(await token.balanceOf(alice.address)).to.equal(
      ethers.parseEther("500")
    );
  });

  it("Should revert transfer if balance too low", async () => {
    const { ethers } = await hre.network.connect();
    await expect(
      token.connect(alice).transfer(owner.address, 1)
    ).to.be.revert(ethers);
  });

  it("Should approve allowance", async () => {
    const { ethers } = await hre.network.connect();
    await token.approve(alice.address, ethers.parseEther("100"));

    const allowance = await token.allowance(owner.address, alice.address);
    expect(allowance).to.equal(ethers.parseEther("100"));
  });

  it("Should allow transferFrom with approval", async () => {
    const { ethers } = await hre.network.connect();
    await token.approve(alice.address, ethers.parseEther("200"));

    await token
      .connect(alice)
      .transferFrom(owner.address, bob.address, ethers.parseEther("200"));

    expect(await token.balanceOf(bob.address)).to.equal(
      ethers.parseEther("200")
    );
  });

  it("Should revert transferFrom without approval", async () => {
    const { ethers } = await hre.network.connect();
    await expect(
      token
        .connect(alice)
        .transferFrom(owner.address, bob.address, 1)
    ).to.be.revert(ethers);
  });

  it("Should reduce allowance after transferFrom", async () => {
    const { ethers } = await hre.network.connect();
    await token.approve(alice.address, ethers.parseEther("300"));

    await token
      .connect(alice)
      .transferFrom(owner.address, bob.address, ethers.parseEther("100"));

    const remaining = await token.allowance(owner.address, alice.address);
    expect(remaining).to.equal(ethers.parseEther("200"));
  });
});

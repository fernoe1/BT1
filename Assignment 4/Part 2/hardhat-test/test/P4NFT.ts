import { expect } from "chai";
import hre from "hardhat";

describe("Part 4 NFT tests", function () {
  let nft: any;
  let owner: any;
  let alice: any;

  beforeEach(async () => {
    const { ethers } = await hre.network.connect();
    [owner, alice] = await ethers.getSigners();

    nft = await ethers.deployContract("P4NFT", [
      "Part 4 NFT",
      "P4N",
    ]);
  });

  it("Owner can mint NFT", async () => {
    await nft.mintNFT(alice.address, "ipfs://token-1");

    const ownerOfToken = await nft.ownerOf(0);
    expect(ownerOfToken).to.equal(alice.address);
  });

  it("Non-owner cannot mint NFT", async () => {
    const { ethers } = await hre.network.connect();
    await expect(
      nft.connect(alice).mintNFT(alice.address, "ipfs://fail")
    ).to.be.revert(ethers);
  });

  it("Token counter increments correctly", async () => {
    await nft.mintNFT(alice.address, "ipfs://1");
    await nft.mintNFT(alice.address, "ipfs://2");

    expect(await nft.tokenCounter()).to.equal(2);
  });

  it("Returns correct tokenURI", async () => {
    await nft.mintNFT(alice.address, "ipfs://metadata");

    const uri = await nft.tokenURI(0);
    expect(uri).to.equal("ipfs://metadata");
  });

  it("Reverts tokenURI for nonexistent token", async () => {
    const { ethers } = await hre.network.connect();
    await expect(nft.tokenURI(99)).to.be.revert(ethers);
  });

  it("Ownership check works correctly", async () => {
    await nft.mintNFT(alice.address, "ipfs://token");

    expect(await nft.ownerOf(0)).to.equal(alice.address);
  });
});

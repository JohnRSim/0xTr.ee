const hre = require("hardhat");
const fs = require('fs');
const uniswapSdk = require("@uniswap/v3-sdk");
const INonfungiblePositionManager = require("../abis/nfpm.json");
const wMaticABI = require("../abis/wmatic.json");

const routerAddress = '0xE592427A0AEce92De3Edee1F18E0157C05861564'; // all nets
const wMaticAddress = '0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889'; // testnet
// const wMaticAddress = '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'; // mainnet
const nonFungPosMngAddy = '0xC36442b4a4522E871399CD717aBDD847Ab11FE88'; // all nets

async function main() {
  [owner] = await ethers.getSigners();
  console.log(`Owner: ${owner.address}`);
  await hre.run("compile");


  // Deploy TreeToken ERC20
  const treeTokenContract = await hre.ethers.getContractFactory('TreeToken');
  const treeToken = await treeTokenContract.deploy();
  await treeToken.deployed();
  console.log(`TreeToken deployed to: ${treeToken.address}`);


    // Deploy Tree Contract
    const treeContract = await hre.ethers.getContractFactory('Tree');
    tree = await treeContract.deploy(treeToken.address,routerAddress,wMaticAddress);
    await tree.deployed();
    console.log(`Tree contract deployed to: ${tree.address}`);

    // Setup liquidity pool on Uni V3
    const wMatic = new ethers.Contract(wMaticAddress, wMaticABI, ethers.provider);
    const positionManager = new ethers.Contract(nonFungPosMngAddy, INonfungiblePositionManager, ethers.provider);
    const liquidityAmount = ethers.utils.parseEther('0.001');
    const sqrtPrice = uniswapSdk.encodeSqrtRatioX96(liquidityAmount,liquidityAmount);
    await positionManager.connect(owner).createAndInitializePoolIfNecessary(treeToken.address, wMaticAddress, 3000, sqrtPrice.toString(), { gasLimit: 5000000 });
    await treeToken.connect(owner).approve(nonFungPosMngAddy, liquidityAmount,{ gasLimit: 5000000 });
    const mintParam = {
      token0: treeToken.address,
      token1: wMaticAddress,
      fee: 3000,
      tickLower: -887220,
      tickUpper: 887220,
      amount0Desired: liquidityAmount,
      amount1Desired: liquidityAmount,
      amount0Min: 1,
      amount1Min: 1,
      recipient: owner.address,
      deadline: Math.floor(Date.now() / 1000) + 600
    }
    const tx = await positionManager.connect(owner).mint(mintParam,{ value: liquidityAmount, gasLimit: 5000000 });
    await tx.wait();

    // Transfer ownership of TreeToken to Tree Contract
    await treeToken.transferOwnership(tree.address);
    console.log(`TreeToken Ownership transferred to: ${tree.address}`);


}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

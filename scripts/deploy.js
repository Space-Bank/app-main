const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Deploying contracts with the account:",
    deployer.address
  );

  const SpaceBankRecruit = await hre.ethers.getContractFactory('SpaceBankRecruit');
  const spaceBankRecruit = await SpaceBankRecruit.deploy('Space Bank Recruit', 'SBR',
  'Qmdh7Xpk56pAXi3BARRYEcombJJEkJLLMzoGjazj83H5Jm/',
  '0xf4b0b1456990fe87adadaf9f7645587127a16a6c');
  await spaceBankRecruit.deployed();
  console.log('SpaceBankRecruit Contract deployed @ ', spaceBankRecruit.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();

  console.log(
    "Calling contract function _transferOwnership with the account:", deployer.address,
    '. Transfering to:', '0xcf9b1f007f246c1D86735941Aeb4eddBc8C0016F'
  );

  let spaceBankMobBossContract = await new ethers.Contract(0x7857DCFF0405E3068443bc145375Ca6b09cAc2bB)
  await spaceBankMobBossContract._transferOwnership(0xcf9b1f007f246c1D86735941Aeb4eddBc8C0016F)
  
  let spaceBankRecruitContract = await new ethers.Contract(0xB9FEf2499Fa2083Ea0B3b5957AC49577E306C5F2)
  await spaceBankRecruitContract._transferOwnership(0xcf9b1f007f246c1D86735941Aeb4eddBc8C0016F)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });

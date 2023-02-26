const hre = require("hardhat");

async function main() {
  const CyasInu = await hre.ethers.getContractFactory("CyasInu");
  const cyasInu = await CyasInu.deploy();
  await cyasInu.deployed();
  console.log("l'adresse du token CyasInu:", cyasInu.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

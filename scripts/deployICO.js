const hre = require("hardhat");

async function main() {
  const IcoForCyasInu = await hre.ethers.getContractFactory("IcoForCyasInu");
  const icoForCyasInu = await IcoForCyasInu.deploy(100000, '0x5FbDB2315678afecb367f032d93F642f64180aa3', 1677438913, 1677521701, 200000); // mettre l'adresse du token dans le deuxieme parametre
  await icoForCyasInu.deployed();
  console.log("ICO deployed to:", icoForCyasInu.address);
}
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

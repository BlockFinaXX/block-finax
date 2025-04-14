// scripts/deployPaymaster.ts
async function main() {
  const [deployer] = await ethers.getSigners();
  const Paymaster = await ethers.getContractFactory("Paymaster");

  const entryPoint = "0x..."; // Your deployed EntryPoint address
  const token = "0x..."; // Your ERC20 token address
  const gasLimit = 1_000_000;
  const initialOwner = deployer.address;

  const paymaster = await Paymaster.deploy(
    entryPoint,
    token,
    gasLimit,
    initialOwner
  );

  await paymaster.deployed();
  console.log("Paymaster deployed to:", paymaster.address);
}

main().catch(console.error);

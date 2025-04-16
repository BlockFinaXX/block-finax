import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const DEFAULT_GAS_LIMIT = 5_000_000;

const PaymasterModule = buildModule("PaymasterModule", (m) => {
  const entryPoint = m.getParameter(
    "entryPoint",
    "0x8fF54D864E85Ac1Ef4e077F71D4A19aaE8Fb3Bf4"
  );

  const gasLimit = m.getParameter("gasLimit", DEFAULT_GAS_LIMIT);

  // Pass deployer address via deployment params
  const initialOwner = m.getParameter(
    "initialOwner",
    "0xA5819482339B0E914aB12f98265Fdb0E6400bF91"
  );

  const paymaster = m.contract("Paymaster", [
    entryPoint,
    gasLimit,
    initialOwner,
  ]);

  return { paymaster };
});

export default PaymasterModule;

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const SmartAccountFactoryModule = buildModule("SmartAccountModule", (m) => {
  const entryPointAddress = m.getParameter(
    "entryPoint",
    "0x8fF54D864E85Ac1Ef4e077F71D4A19aaE8Fb3Bf4"
  );

  // Deploy SmartAccountFactory with entryPoint param
  const factory = m.contract("SmartAccountFactory", [entryPointAddress]);

  return { factory };
});

export default SmartAccountFactoryModule;

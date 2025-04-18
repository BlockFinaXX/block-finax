import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import jwt from "jsonwebtoken";
import Web3 from "web3";
import WalletFactoryABI from "@/abis/WalletFactory.json";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(decoded.id);
  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  const web3 = new Web3(process.env.APECHAIN_RPC_URL!);
  const walletFactory = new web3.eth.Contract(
    WalletFactoryABI as any,
    process.env.WALLET_FACTORY_ADDRESS!
  );

  const deployer = web3.eth.accounts.privateKeyToAccount(
    process.env.PRIVATE_KEY!
  );
  web3.eth.accounts.wallet.add(deployer);
  web3.eth.defaultAccount = deployer.address;

  const tx = await walletFactory.methods.createWallet(user.email).send({
    from: deployer.address,
    gas: 3000000,
  });

  const walletAddress = tx.events.WalletCreated.returnValues.walletAddress;
  user.walletAddress = walletAddress;
  await user.save();

  return NextResponse.json({ walletAddress });
}

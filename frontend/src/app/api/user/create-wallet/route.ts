import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/user";
import user from "@/app/models/user";
import { verifyJwt } from "@/utils/jwt";
import { ethers } from "ethers";
import WalletFactoryABI from "@/abis/WalletFactory.json";

export async function POST(req: NextRequest) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) return NextResponse.json({ error: "No token" }, { status: 401 });

  const decoded = verifyJwt(token);
  if (!decoded) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  await connectDB();
  const user = await User.findById(decoded.id);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  // Set up ethers provider and signer
  const provider = new ethers.JsonRpcProvider(process.env.APECHAIN_RPC_URL!);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  // Instantiate contract
  const walletFactory = new ethers.Contract(
    process.env.WALLET_FACTORY_ADDRESS!,
    WalletFactoryABI,
    wallet
  );

  // Send transaction to create wallet
  const tx = await walletFactory.createWallet(user.email);
  const receipt = await tx.wait();

  // Read emitted event (assuming WalletCreated(address walletAddress))
  const event = receipt.logs.find((log) => {
    try {
      return walletFactory.interface.parseLog(log).name === "WalletCreated";
    } catch {
      return false;
    }
  });

  if (!event) {
    return NextResponse.json(
      { error: "Wallet creation failed" },
      { status: 500 }
    );
  }

  const parsed = walletFactory.interface.parseLog(event);
  const walletAddress = parsed.args.walletAddress;

  // Save to DB
  user.walletAddress = walletAddress;
  await user.save();

  return NextResponse.json({ walletAddress });
}

import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { ADDRESS } from "./config";
import { config } from "dotenv";

const transferSol = async (from: Keypair, to: PublicKey, lamports: number) => {
  const connection = new Connection(ADDRESS, "confirmed");
  const transaction = new Transaction();
  const instruction = SystemProgram.transfer({
    fromPubkey: from.publicKey,
    toPubkey: to,
    lamports: lamports,
  });
  transaction.add(instruction);
  await sendAndConfirmTransaction(connection, transaction, [from]);
  console.log(`Transferred ${lamports/LAMPORTS_PER_SOL}SOL from ${from.publicKey} to ${to}`);
};

const main = async () => {
  config();

  const fromSecretKeyString = process.env.YOUR_KEY || "";
  const toSecretKeyString = process.env.OTHER_KEY || "";
  if (!fromSecretKeyString || !toSecretKeyString) {
    throw new Error(
      "Environment variables YOUR_KEY and OTHER_KEY must be set."
    );
  }
  const fromSecretKey = Uint8Array.from(JSON.parse(fromSecretKeyString));
  const toSecretKey = Uint8Array.from(JSON.parse(toSecretKeyString));
  const fromKeyPair = Keypair.fromSecretKey(fromSecretKey);
  const toKeyPair = Keypair.fromSecretKey(toSecretKey);

  await transferSol(fromKeyPair, toKeyPair.publicKey, 2 * LAMPORTS_PER_SOL);

  console.log("Done");
};

// main();

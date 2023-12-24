import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { ADDRESS, getPublicKeyFromEnv, getYourKeypairFromEnv } from "./config";
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
  console.log(`Transferred ${lamports / LAMPORTS_PER_SOL}SOL from ${from.publicKey} to ${to}`);
};

const main = async () => {
  config();

  const fromKeyPair = getYourKeypairFromEnv();
  const toPublicKey = getPublicKeyFromEnv("OTHER_KEY");
  await transferSol(fromKeyPair, toPublicKey, 2 * LAMPORTS_PER_SOL);

  console.log("Done");
};

// main();

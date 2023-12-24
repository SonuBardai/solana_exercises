import { Connection, Keypair, PublicKey, Transaction, TransactionInstruction, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { ADDRESS, getYourKeypairFromEnv } from "./config";

const ping = async (payer: Keypair) => {
  const connection = new Connection(
    // ADDRESS,
    clusterApiUrl("devnet"),
    "confirmed"
  );
  const transaction = new Transaction();
  const programId = new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa");
  console.log(`Program address: ${programId}`);

  const programDataId = new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod");
  const instruction = new TransactionInstruction({
    keys: [
      // Each object in this array represents an account that will be read from or written to during a transaction's execution.
      {
        pubkey: programDataId,
        isSigner: false,
        isWritable: true,
      },
    ],
    programId: programId,
  });
  transaction.add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
  return signature;
};

const main = async () => {
  const keyPair = getYourKeypairFromEnv();
  const signature = await ping(keyPair);
  console.log(`Ping request signature: ${signature} sent from key ${keyPair.publicKey}`);

  /*
  Program logs:
  #1 Unknown Program (ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa) Instruction
  > Program logged: "Pinged 5309 time(s)!"
  > Program consumed: 1396 of 200000 compute units
  > Program returned success
  */
};

// main();

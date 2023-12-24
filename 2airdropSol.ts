import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { ADDRESS, PUBLIC_KEY } from "./config";
import { getBalanceInSol } from "./1connection";

const airDrop = async (address: PublicKey, lamports: number) => {
  const connection = new Connection(
    // ADDRESS,
    clusterApiUrl("devnet"),
    "confirmed"
  );

  const airdropSignature = await connection.requestAirdrop(address, lamports);

  const latestBlockHash = await connection.getLatestBlockhash();
  await connection.confirmTransaction({
    blockhash: latestBlockHash.blockhash,
    lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
    signature: airdropSignature,
  });
};

const main = async () => {
  const publicKey = new PublicKey(PUBLIC_KEY);

  let balance = await getBalanceInSol(publicKey);
  console.log(`${publicKey} Balance before: ${balance}`);

  await airDrop(publicKey, 2 * LAMPORTS_PER_SOL);

  balance = await getBalanceInSol(publicKey);
  console.log(`${publicKey} Balance after airdrop: ${balance}`);
};

// main();

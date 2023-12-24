import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { ADDRESS, PUBLIC_KEY } from "./config";

export const getBalance = async (address: PublicKey) => {
  const connection = new Connection(ADDRESS, "confirmed");
  const balance = await connection.getBalance(address);
  return balance;
};

export const getBalanceInSol = async (address: PublicKey) => {
  const balanceInLamports = await getBalance(address);
  const balanceInSol = balanceInLamports / LAMPORTS_PER_SOL;
  return balanceInSol;
};

const main = () => {
  const address = new PublicKey(PUBLIC_KEY);
  const balanceInSol = getBalanceInSol(address);
  console.log(
    `The balance of the account at ${PUBLIC_KEY} is ${balanceInSol} SOL`
  );
  console.log(`✅ Finished!`);
};

// main()

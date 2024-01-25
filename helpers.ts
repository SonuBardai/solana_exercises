import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { airDrop } from "./2airdropSol";

export const getNewAccount = async (connection: Connection, airdropSol: number = 2): Promise<Keypair> => {
  const keypair = Keypair.generate();
  await airDrop(connection, keypair.publicKey, airdropSol * LAMPORTS_PER_SOL);
  return keypair;
};

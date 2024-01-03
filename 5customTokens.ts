// WIP!
import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { airDrop } from "./2airdropSol";
import { ADDRESS } from "./config";
import { createMint } from "@solana/spl-token";

const createTokenMint = async (tokenMintAddress: Keypair) => {
  const connection = new Connection(ADDRESS, "confirmed");
  const mint = await createMint(connection, tokenMintAddress, tokenMintAddress.publicKey, null, 8);
};

const main = () => {
  const tokenMintWallet = Keypair.generate();
  airDrop(tokenMintWallet.publicKey, 2 * LAMPORTS_PER_SOL);
};

main();

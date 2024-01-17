import { Connection, Keypair, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { airDrop } from "./2airdropSol";
import { ADDRESS } from "./config";
import { createMint, getMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { getBalanceInSol } from "./1connection";

const main = async () => {
  const connection = new Connection(ADDRESS);
  const tokenMintWallet = Keypair.generate();
  console.log(`tokenMintWallet: ${tokenMintWallet.publicKey}`);

  await airDrop(connection, tokenMintWallet.publicKey, 2 * LAMPORTS_PER_SOL);
  console.log(`tokenMintWallet balance: ${await getBalanceInSol(tokenMintWallet.publicKey)}`);

  const mint = await createMint(connection, tokenMintWallet, tokenMintWallet.publicKey, null, 8);
  console.log(`mint: ${mint}`);
  const mintInfo = await getMint(connection, mint);

  const tokenAccount = await getOrCreateAssociatedTokenAccount(connection, tokenMintWallet, mint, tokenMintWallet.publicKey);
  console.log(`tokenAccount: ${tokenAccount.address}`);

  await mintTo(connection, tokenMintWallet, mint, tokenAccount.address, tokenMintWallet, 100 * 10 ** mintInfo.decimals);
};

// main();

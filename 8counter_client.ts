import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
import { ADDRESS } from "./config";
import { airDrop } from "./2airdropSol";

const COUNTER_PROGRAM_ID = "5tTR2K9pNBRUWQ1ANKyrhpwqS2A6t6MSViMe79qaPRBK";
let COMMON_PROGRAM_ACCOUNT_ADDRESS: PublicKey | null = new PublicKey("E4Eq4dwvvMgficnxaCkiJKK7Hb2kVZLMRusr9Dmh1pkP");

const incrementCounter = async (connection: Connection, counterAccountPublicKey: PublicKey, payerKeypair: Keypair) => {
  const instruction = {
    keys: [{ pubkey: counterAccountPublicKey, isSigner: false, isWritable: true }],
    programId: new PublicKey(COUNTER_PROGRAM_ID),
    data: Buffer.alloc(0), // no instruction data
  };
  const transaction = new Transaction().add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [payerKeypair]);
  return signature;
};

const getProgramAccount = async (connection: Connection, payerKeypair: Keypair) => {
  const newProgramAccount = Keypair.generate();
  const createAccountTransaction = SystemProgram.createAccount({
    fromPubkey: payerKeypair.publicKey,
    newAccountPubkey: newProgramAccount.publicKey,
    lamports: await connection.getMinimumBalanceForRentExemption(4), // size of CounterAccount in bytes
    space: 4, // size of CounterAccount in bytes
    programId: new PublicKey(COUNTER_PROGRAM_ID),
  });
  const transaction = new Transaction().add(createAccountTransaction);
  await sendAndConfirmTransaction(connection, transaction, [payerKeypair, newProgramAccount]);
  return newProgramAccount.publicKey;
};

const main = async () => {
  const connection = new Connection(ADDRESS, "confirmed");
  const keypair = Keypair.generate();
  await airDrop(connection, keypair.publicKey, 2 * LAMPORTS_PER_SOL);

  const counterAccountPublicKey = COMMON_PROGRAM_ACCOUNT_ADDRESS || (await getProgramAccount(connection, keypair));
  console.log("Counter Account Public Key: ", counterAccountPublicKey);
  const signature = await incrementCounter(connection, counterAccountPublicKey, keypair);
  console.log(`Transaction signature: ${signature} sent to account ${counterAccountPublicKey} from payer ${keypair.publicKey}`);

  /*
  # Transaction-1
  Unknown Program (5tTR2K9pNBRUWQ1ANKyrhpwqS2A6t6MSViMe79qaPRBK) Instruction
  > Program logged: "Welcome to the counter program at 5tTR2K9pNBRUWQ1ANKyrhpwqS2A6t6MSViMe79qaPRBK!"
  > Program logged: "Counter value: 1. Last greeted by E4Eq4dwvvMgficnxaCkiJKK7Hb2kVZLMRusr9Dmh1pkP"
  > Program consumed: 24858 of 200000 compute units
  > Program returned success

  # Transaction-1
  Unknown Program (5tTR2K9pNBRUWQ1ANKyrhpwqS2A6t6MSViMe79qaPRBK) Instruction
  > Program logged: "Welcome to the counter program at 5tTR2K9pNBRUWQ1ANKyrhpwqS2A6t6MSViMe79qaPRBK!"
  > Program logged: "Counter value: 2. Last greeted by E4Eq4dwvvMgficnxaCkiJKK7Hb2kVZLMRusr9Dmh1pkP"
  > Program consumed: 24858 of 200000 compute units
  > Program returned success
  */

};

main();

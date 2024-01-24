import { Connection, Keypair, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, sendAndConfirmTransaction } from "@solana/web3.js";
import { ADDRESS } from "./config";
import { airDrop } from "./2airdropSol";

const HELLOWORLD_PROGRAM_ID = "HdwjS9MrP16WToKdLztS6gWZZjqAyNhw83uqDy6jgiyo";

const sayHello = async () => {
  const connection = new Connection(ADDRESS, "confirmed");

  const payer = Keypair.generate();
  await airDrop(connection, payer.publicKey, 2 * LAMPORTS_PER_SOL);

  const transaction = new Transaction();
  const instruction = new TransactionInstruction({
    keys: [],
    programId: new PublicKey(HELLOWORLD_PROGRAM_ID),
    data: Buffer.alloc(0),
  });
  transaction.add(instruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [payer]);
  console.log(`Request signature: ${signature} sent from key ${payer.publicKey}`);
};

const main = () => sayHello();

/*
#1 Unknown Program (HdwjS9MrP16WToKdLztS6gWZZjqAyNhw83uqDy6jgiyo) Instruction
> Program logged: "Hello world from program HdwjS9MrP16WToKdLztS6gWZZjqAyNhw83uqDy6jgiyo"
> Program logged: "Accounts []"
> Program logged: "Instructions []"
> Program consumed: 13149 of 200000 compute units
> Program returned success
*/

// main();

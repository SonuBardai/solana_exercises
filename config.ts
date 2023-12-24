import { Keypair, PublicKey } from "@solana/web3.js";
import { config } from "dotenv";

export const ADDRESS = "http://localhost:8899";
export const PUBLIC_KEY = "5byepJy3Yc3hqgrYJpaybCzcfMDZ2uympY4Rf84ATbWv";

export const PUBLIC_KEY_2 = "EDJNYgaQhkVfohykLTh2yo4LxStqX233cNPGku8FFNmH";

export const getKeypairFromEnv = (keyName: string) => {
  config();
  const rawKey = process.env[keyName] || "";
  if (!rawKey) {
    throw new Error(`Environment variable for ${keyName} must be set.`);
  }
  const parsedKey = Uint8Array.from(JSON.parse(rawKey));
  const keyPair = Keypair.fromSecretKey(parsedKey);
  return keyPair;
};

export const getYourKeypairFromEnv = (): Keypair => {
  return getKeypairFromEnv("YOUR_KEY");
};

export const getPublicKeyFromEnv = (keyName: string): PublicKey => {
  try {
    const keyPair = getKeypairFromEnv("OTHER_KEY");
    return keyPair.publicKey;
  } catch (error) {
    const rawKey = process.env[keyName] || "";
    const publicKey = new PublicKey(rawKey);
    return publicKey;
  }
};

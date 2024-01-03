import React, { useState, useEffect } from "react";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";

const DisplayBalance = () => {
  const [balance, setBalance] = useState(0);

  const { connection } = useConnection();
  const { publicKey } = useWallet();

  useEffect(() => {
    if (connection && publicKey) {
      connection.onAccountChange(
        publicKey,
        (updatedAccountInfo) => {
          setBalance(updatedAccountInfo.lamports / LAMPORTS_PER_SOL);
        },
        "confirmed"
      );

      connection.getAccountInfo(publicKey).then((info) => {
        if (info) {
          setBalance(info.lamports);
        }
      });
    }
  }, [connection, publicKey]);

  return (
    <div>
      <p>{publicKey ? `Balance: ${balance / LAMPORTS_PER_SOL} SOL` : ""}</p>
    </div>
  );
};

export default DisplayBalance;

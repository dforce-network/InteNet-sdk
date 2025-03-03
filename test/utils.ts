import { Chain } from "viem";
import { createWalletClient, createPublicClient } from "viem";
import { http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import "dotenv/config";

export const setup = (chain: Chain) => {
  const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
  if (!privateKey) {
    throw new Error("PRIVATE_KEY not found in environment variables");
  }

  const account = privateKeyToAccount(privateKey);

  const walletClient = createWalletClient({
    chain: chain,
    transport: http(),
    account,
  });

  const publicClient = createPublicClient({
    chain: chain,
    transport: http(),
  });

  return {
    account,
    walletClient,
    publicClient,
  };
};

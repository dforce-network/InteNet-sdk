import { mainnet, base, bsc, sepolia } from "viem/chains";

export const CHAIN_NAMES = {
  [mainnet.id]: "mainnet",
  [base.id]: "base",
  [bsc.id]: "bsc",
  [sepolia.id]: "sepolia",
} as const;

export const SUPPORTED_CHAINS = [mainnet, base, bsc, sepolia];

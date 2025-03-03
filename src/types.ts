import { Chain } from "viem";

export interface LaunchParams {
  creator: `0x${string}`;
  name: string;
  ticker: string;
  cores: number[];
  description: string;
  image: string;
  // twitter, telegram, farcaster, website
  urls: [string, string, string, string];
  purchaseAmount: bigint;
}

export interface BuyParams {
  tokenAddress: `0x${string}`;
  amount: bigint;
}

export interface BuyResult {
  transactionHash: `0x${string}`;
  status: "success" | "failed";
  blockNumber: bigint;
  tokenAmount: bigint;
  assetAmount: bigint;
}

export interface AllowanceParams {
  token: `0x${string}`;
  owner: `0x${string}`;
  spender: `0x${string}`;
}

export interface ApproveParams {
  token: `0x${string}`;
  spender: `0x${string}`;
  amount: bigint;
}

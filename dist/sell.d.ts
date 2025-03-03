import { WalletClient, PublicClient } from "viem";
import { SellParams } from "./types";
export declare function sell(params: SellParams, walletClient: WalletClient, publicClient: PublicClient): Promise<{
    transactionHash: `0x${string}`;
    status: "success" | "reverted";
    blockNumber: bigint;
    tokenAmount: any;
    assetAmount: any;
}>;

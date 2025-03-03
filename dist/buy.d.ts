import { WalletClient, PublicClient } from "viem";
import { BuyParams } from "./types";
export declare function buy(params: BuyParams, walletClient: WalletClient, publicClient: PublicClient): Promise<{
    transactionHash: `0x${string}`;
    status: "success" | "reverted";
    blockNumber: bigint;
    tokenAmount: any;
    assetAmount: any;
}>;

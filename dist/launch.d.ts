import { WalletClient, PublicClient } from "viem";
import { LaunchParams } from "./types";
export declare function launch(params: LaunchParams, walletClient: WalletClient, publicClient: PublicClient): Promise<{
    transactionHash: `0x${string}`;
    status: "success" | "reverted";
    blockNumber: bigint;
    tokenAddress: any;
}>;

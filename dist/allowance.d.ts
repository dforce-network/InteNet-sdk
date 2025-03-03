import { WalletClient, PublicClient } from "viem";
import { AllowanceParams, ApproveParams } from "./types";
export declare function approve(params: ApproveParams, walletClient: WalletClient, publicClient: PublicClient): Promise<{
    transactionHash: `0x${string}`;
    status: "success" | "reverted";
    blockNumber: bigint;
}>;
export declare function allowance(params: AllowanceParams, publicClient: PublicClient): Promise<bigint>;
export declare function ensureAllowance(params: ApproveParams, publicClient: PublicClient, walletClient: WalletClient): Promise<{
    transactionHash: `0x${string}`;
    status: "success" | "reverted";
    blockNumber: bigint;
} | null>;

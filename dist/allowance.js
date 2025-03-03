"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.approve = approve;
exports.allowance = allowance;
exports.ensureAllowance = ensureAllowance;
const viem_1 = require("viem");
async function approve(params, walletClient, publicClient) {
    const { token, spender, amount } = params;
    try {
        const tx = await walletClient.writeContract({
            address: token,
            abi: viem_1.erc20Abi,
            functionName: "approve",
            args: [spender, amount],
            chain: publicClient.chain,
            account: walletClient.account ?? null,
        });
        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });
        return {
            transactionHash: receipt.transactionHash,
            status: receipt.status,
            blockNumber: receipt.blockNumber,
        };
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to approve: ${error.message}`);
        }
        throw new Error("Failed to approve: Unknown error");
    }
}
async function allowance(params, publicClient) {
    const { token, owner, spender } = params;
    try {
        const allowance = await publicClient.readContract({
            address: token,
            abi: viem_1.erc20Abi,
            functionName: "allowance",
            args: [owner, spender],
        });
        return allowance;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to get allowance: ${error.message}`);
        }
        throw new Error("Failed to get allowance: Unknown error");
    }
}
async function ensureAllowance(params, publicClient, walletClient) {
    try {
        // Check current allowance
        const currentAllowance = await allowance({
            ...params,
            owner: walletClient.account?.address,
        }, publicClient);
        // If current allowance is less than the required amount, approve
        if (currentAllowance < params.amount) {
            return await approve(params, walletClient, publicClient);
        }
        // Return null if no approval was needed
        return null;
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to ensure allowance: ${error.message}`);
        }
        throw new Error("Failed to ensure allowance: Unknown error");
    }
}

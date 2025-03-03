import { CHAIN_NAMES } from "./constants";
import { contracts } from "./contracts";
import { Chain, WalletClient, PublicClient } from "viem";
import { AllowanceParams, ApproveParams } from "./types";
import { erc20Abi } from "viem";

export async function approve(
  params: ApproveParams,
  walletClient: WalletClient,
  publicClient: PublicClient
) {
  const { token, spender, amount } = params;

  try {
    const tx = await walletClient.writeContract({
      address: token,
      abi: erc20Abi,
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
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to approve: ${error.message}`);
    }
    throw new Error("Failed to approve: Unknown error");
  }
}

export async function allowance(
  params: AllowanceParams,
  publicClient: PublicClient
) {
  const { token, owner, spender } = params;

  try {
    const allowance = await publicClient.readContract({
      address: token,
      abi: erc20Abi,
      functionName: "allowance",
      args: [owner, spender],
    });

    return allowance;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to get allowance: ${error.message}`);
    }
    throw new Error("Failed to get allowance: Unknown error");
  }
}

export async function ensureAllowance(
  params: ApproveParams,
  publicClient: PublicClient,
  walletClient: WalletClient
) {
  try {
    // Check current allowance
    const currentAllowance = await allowance(
      {
        ...params,
        owner: walletClient.account?.address as `0x${string}`,
      },
      publicClient
    );

    // If current allowance is less than the required amount, approve
    if (currentAllowance < params.amount) {
      return await approve(params, walletClient, publicClient);
    }

    // Return null if no approval was needed
    return null;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to ensure allowance: ${error.message}`);
    }
    throw new Error("Failed to ensure allowance: Unknown error");
  }
}

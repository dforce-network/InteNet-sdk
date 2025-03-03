import { CHAIN_NAMES } from "./constants";
import { contracts } from "./contracts";
import { WalletClient, PublicClient, parseEventLogs } from "viem";
import { SellParams, SellResult } from "./types";
import { ensureAllowance } from "./allowance";

export async function sell(
  params: SellParams,
  walletClient: WalletClient,
  publicClient: PublicClient
) {
  const { tokenAddress, amount } = params;

  const chain = publicClient.chain;

  if (!chain) {
    throw new Error("Chain not found");
  }

  const networkName = CHAIN_NAMES[chain.id as keyof typeof CHAIN_NAMES];

  if (!contracts[networkName]?.bonding) {
    throw new Error(`Bonding contract not found on network ${chain}`);
  }

  try {
    await ensureAllowance(
      {
        token: params.tokenAddress,
        spender: contracts[networkName].bonding.address,
        amount,
      },
      publicClient,
      walletClient
    );

    const tx = await walletClient.writeContract({
      address: contracts[networkName].bonding.address,
      abi: contracts[networkName].bonding.abi,
      functionName: "sell",
      args: [amount, tokenAddress],
      chain,
      account: walletClient.account ?? null,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    const logs: any = parseEventLogs({
      abi: contracts[networkName].INTRouterLibrary.abi,
      eventName: "Sell",
      logs: receipt.logs,
    });

    const { tokenAmount, assetAmount } = logs[0].args;

    return {
      transactionHash: receipt.transactionHash,
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      tokenAmount,
      assetAmount,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to sell token: ${error.message}`);
    }
    throw new Error("Failed to sell token: Unknown error");
  }
}

import { CHAIN_NAMES } from "./constants";
import { contracts } from "./contracts";
import {
  parseEther,
  Chain,
  WalletClient,
  PublicClient,
  parseEventLogs,
} from "viem";
import { BuyParams } from "./types";
import { ensureAllowance } from "./allowance";

export async function buy(
  params: BuyParams,
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
        token: contracts[networkName].INT.address,
        spender: contracts[networkName].bonding.address,
        amount,
      },
      publicClient,
      walletClient
    );

    const tx = await walletClient.writeContract({
      address: contracts[networkName].bonding.address,
      abi: contracts[networkName].bonding.abi,
      functionName: "buy",
      args: [amount, tokenAddress],
      chain,
      account: walletClient.account ?? null,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    // console.log(receipt);

    const logs: any = parseEventLogs({
      abi: contracts[networkName].INTRouterLibrary.abi,
      eventName: "Buy",
      logs: receipt.logs,
    });

    // console.log(logs);

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
      throw new Error(`Failed to buy token: ${error.message}`);
    }
    throw new Error("Failed to buy token: Unknown error");
  }
}

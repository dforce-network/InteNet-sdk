import { contracts } from "./contracts";
import {
  parseEther,
  Chain,
  WalletClient,
  PublicClient,
  parseEventLogs,
} from "viem";
import { LaunchParams } from "./types";
import { CHAIN_NAMES } from "./constants";

export async function launch(
  params: LaunchParams,
  walletClient: WalletClient,
  publicClient: PublicClient
) {
  const {
    creator,
    name,
    ticker,
    cores,
    description,
    image,
    urls,
    purchaseAmount,
    network,
  } = params;

  const networkName = CHAIN_NAMES[network.id as keyof typeof CHAIN_NAMES];

  if (!contracts[networkName]?.bonding) {
    throw new Error(`Bonding contract not found on network ${network}`);
  }

  try {
    // TODO: check the launch Fee and allowance

    const tx = await walletClient.writeContract({
      address: contracts[networkName].bonding.address,
      abi: contracts[networkName].bonding.abi,
      functionName: "launchFor",
      args: [
        creator,
        name,
        ticker,
        cores,
        description,
        image,
        urls,
        purchaseAmount,
      ],
      chain: network,
      account: walletClient.account,
    });

    const receipt = await publicClient.waitForTransactionReceipt({
      hash: tx,
    });

    const logs = parseEventLogs({
      abi: contracts[networkName].bonding.abi,
      eventName: "Launched",
      logs: receipt.logs,
    });

    const tokenAddress = logs[0].args.token;

    return {
      transactionHash: receipt.transactionHash,
      status: receipt.status,
      blockNumber: receipt.blockNumber,
      tokenAddress,
    };
  } catch (error) {
    throw new Error(`Failed to launch token: ${error.message}`);
  }
}

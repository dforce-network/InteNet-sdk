"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.launch = launch;
const contracts_1 = require("./contracts");
const viem_1 = require("viem");
const constants_1 = require("./constants");
async function launch(params, walletClient, publicClient) {
    const { creator, name, ticker, cores, description, image, urls, purchaseAmount, chain, } = params;
    const networkName = constants_1.CHAIN_NAMES[chain.id];
    if (!contracts_1.contracts[networkName]?.bonding) {
        throw new Error(`Bonding contract not found on network ${chain}`);
    }
    try {
        // TODO: check the launch Fee and allowance
        const tx = await walletClient.writeContract({
            address: contracts_1.contracts[networkName].bonding.address,
            abi: contracts_1.contracts[networkName].bonding.abi,
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
            chain,
            account: walletClient.account ?? null,
        });
        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });
        const logs = (0, viem_1.parseEventLogs)({
            abi: contracts_1.contracts[networkName].bonding.abi,
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
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to launch token: ${error.message}`);
        }
        throw new Error("Failed to launch token: Unknown error");
    }
}

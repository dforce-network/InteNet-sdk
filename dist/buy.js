"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buy = buy;
const constants_1 = require("./constants");
const contracts_1 = require("./contracts");
const viem_1 = require("viem");
const allowance_1 = require("./allowance");
async function buy(params, walletClient, publicClient) {
    const { tokenAddress, amount } = params;
    const chain = publicClient.chain;
    if (!chain) {
        throw new Error("Chain not found");
    }
    const networkName = constants_1.CHAIN_NAMES[chain.id];
    if (!contracts_1.contracts[networkName]?.bonding) {
        throw new Error(`Bonding contract not found on network ${chain}`);
    }
    try {
        await (0, allowance_1.ensureAllowance)({
            token: contracts_1.contracts[networkName].INT.address,
            spender: contracts_1.contracts[networkName].bonding.address,
            amount,
        }, publicClient, walletClient);
        const tx = await walletClient.writeContract({
            address: contracts_1.contracts[networkName].bonding.address,
            abi: contracts_1.contracts[networkName].bonding.abi,
            functionName: "buy",
            args: [amount, tokenAddress],
            chain,
            account: walletClient.account ?? null,
        });
        // const tx =
        //   "0xd9d4f1644c4b32f8d3bd4c9c4297027635637948f9c83627e836b8701f793c6a";
        const receipt = await publicClient.waitForTransactionReceipt({
            hash: tx,
        });
        // console.log(receipt);
        const logs = (0, viem_1.parseEventLogs)({
            abi: contracts_1.contracts[networkName].INTRouterLibrary.abi,
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
    }
    catch (error) {
        if (error instanceof Error) {
            throw new Error(`Failed to buy token: ${error.message}`);
        }
        throw new Error("Failed to buy token: Unknown error");
    }
}

"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InteNetMemeSDK = void 0;
const viem_1 = require("viem");
const deployements_1 = require("./deployements");
class InteNetMemeSDK {
    constructor(privateKey, networkType) {
        this.privateKey = privateKey;
        this.network = deployements_1.NETWORKS[networkType];
        this.publicClient = (0, viem_1.createPublicClient)({
            chain: {
                id: this.network.chainId,
                rpcUrls: {
                    default: { http: [this.network.rpcUrl] },
                },
            },
            transport: (0, viem_1.http)(),
        });
        this.walletClient = (0, viem_1.createWalletClient)({
            account: privateKey,
            chain: {
                id: this.network.chainId,
                rpcUrls: {
                    default: { http: [this.network.rpcUrl] },
                },
            },
            transport: (0, viem_1.http)(),
        });
    }
    async launch(options) {
        try {
            const { tokenParams, initialLiquidity } = options;
            // Deploy token contract through InteNet protocol
            const deployTx = await this.walletClient.writeContract({
                address: this.network.inteNetAddress,
                abi: deployements_1.INTENET_ABI,
                functionName: "launchMemeToken",
                args: [
                    tokenParams.name,
                    tokenParams.symbol,
                    tokenParams.totalSupply,
                    tokenParams.owner,
                    initialLiquidity,
                ],
            });
            // Wait for transaction confirmation
            const receipt = await this.publicClient.waitForTransactionReceipt({
                hash: deployTx,
            });
            // Get deployed token address from event logs
            const tokenAddress = this.parseTokenAddressFromLogs(receipt.logs);
            return {
                transactionHash: deployTx,
                tokenAddress,
            };
        }
        catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to launch meme token: ${error.message}`);
            }
            throw new Error("Failed to launch meme token: Unknown error");
        }
    }
    parseTokenAddressFromLogs(logs) {
        // Implement parsing logic based on InteNet protocol events
        // This will depend on the actual event structure
        return "";
    }
}
exports.InteNetMemeSDK = InteNetMemeSDK;
__exportStar(require("./types"), exports);

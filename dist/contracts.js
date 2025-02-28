"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contracts = void 0;
const fs_1 = require("fs");
const path_1 = require("path");
const viem_1 = require("viem");
const constants_1 = require("./constants");
function loadContracts() {
    const deploymentsPath = (0, path_1.join)(__dirname, "../deployments");
    const contracts = {};
    constants_1.SUPPORTED_CHAINS.forEach((chain) => {
        const chainName = constants_1.CHAIN_NAMES[chain.id];
        contracts[chainName] = {};
        try {
            const files = (0, fs_1.readdirSync)((0, path_1.join)(deploymentsPath, chainName));
            for (const file of files) {
                if (!file.endsWith(".json") || file.includes("-") || file.includes("_"))
                    continue;
                const contractName = file.slice(0, -5); // Remove .json suffix
                const filePath = (0, path_1.join)(deploymentsPath, chainName, file);
                const content = JSON.parse((0, fs_1.readFileSync)(filePath, "utf-8"));
                contracts[chainName][contractName] = (0, viem_1.getContract)({
                    address: content.address,
                    abi: content.abi,
                    client: {
                        public: (0, viem_1.createPublicClient)({
                            chain,
                            transport: (0, viem_1.http)(),
                        }),
                    },
                });
            }
        }
        catch (error) {
            console.warn(`Failed to load ABI for chain ${chainName}:`, error);
        }
    });
    return contracts;
}
exports.contracts = loadContracts();

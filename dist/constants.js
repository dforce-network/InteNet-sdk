"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SUPPORTED_CHAINS = exports.CHAIN_NAMES = void 0;
const chains_1 = require("viem/chains");
exports.CHAIN_NAMES = {
    [chains_1.mainnet.id]: "mainnet",
    [chains_1.base.id]: "base",
    [chains_1.bsc.id]: "bsc",
    [chains_1.sepolia.id]: "sepolia",
};
exports.SUPPORTED_CHAINS = [chains_1.mainnet, chains_1.base, chains_1.bsc, chains_1.sepolia];

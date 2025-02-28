export interface NetworkConfig {
    chainId: number;
    rpcUrl: string;
    inteNetAddress: string;
}
export interface MemeTokenParams {
    name: string;
    symbol: string;
    totalSupply: bigint;
    owner: string;
}
export interface LaunchOptions {
    network: "base" | "bsc";
    initialLiquidity: bigint;
    tokenParams: MemeTokenParams;
}

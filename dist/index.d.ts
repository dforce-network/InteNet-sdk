import { LaunchOptions } from "./types";
export declare class InteNetMemeSDK {
    private readonly privateKey;
    private network;
    private publicClient;
    private walletClient;
    constructor(privateKey: string, networkType: "base" | "bsc");
    launch(options: LaunchOptions): Promise<{
        transactionHash: any;
        tokenAddress: string;
    }>;
    private parseTokenAddressFromLogs;
}
export * from "./types";

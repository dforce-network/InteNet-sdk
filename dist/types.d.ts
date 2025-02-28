import { Chain } from "viem";
export interface LaunchParams {
    creator: string;
    name: string;
    ticker: string;
    cores: number[];
    description: string;
    image: string;
    urls: [string, string, string, string];
    purchaseAmount: bigint;
    chain: Chain;
}

import { describe, it, expect, vi, beforeEach, beforeAll } from "vitest";
import { buy } from "../src/buy";
import { sepolia } from "viem/chains";
import { parseEther } from "viem";
import { setup } from "./utils";

describe("buy", () => {
  const buyParams = {
    tokenAddress: "0xb6cfb9be9aa4ff175484494bb803da7205e0274c" as `0x${string}`,
    amount: parseEther("0.0000001"),
    chain: sepolia,
  };

  let account;
  let walletClient;
  let publicClient;

  beforeAll(() => {
    ({ account, walletClient, publicClient } = setup(sepolia));
  });

  it("should successfully buy tokens", async () => {
    const result = await buy(buyParams, walletClient, publicClient);

    // console.log(result);

    expect(result).toBeDefined();
    expect(result.transactionHash).toBeDefined();
    expect(result.status).toBeDefined();
    expect(result.blockNumber).toBeDefined();
    expect(result.tokenAmount).toBeDefined();
    expect(result.assetAmount).toBeDefined();
  });

  it("should throw error if on wrong chain", async () => {
    const invalidPublicClient = {
      ...publicClient,
      chain: { id: 999 } as any,
    };

    await expect(
      buy(buyParams, walletClient, invalidPublicClient)
    ).rejects.toThrow("Bonding contract not found on network");
  });
});

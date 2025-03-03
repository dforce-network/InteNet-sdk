import { describe, it, expect, beforeAll } from "vitest";
import { sell } from "../src/sell";
import { sepolia } from "viem/chains";
import { parseEther } from "viem";
import { setup } from "./utils";

describe("sell", () => {
  const sellParams = {
    tokenAddress: "0xb6cfb9be9aa4ff175484494bb803da7205e0274c" as `0x${string}`,
    amount: parseEther("1000"),
  };

  let walletClient;
  let publicClient;

  beforeAll(() => {
    ({ walletClient, publicClient } = setup(sepolia));
  });

  it("should successfully sell tokens", async () => {
    const result = await sell(sellParams, walletClient, publicClient);

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
      sell(sellParams, walletClient, invalidPublicClient)
    ).rejects.toThrow("Bonding contract not found on network");
  });

  it("should throw error if chain not found", async () => {
    const invalidPublicClient = {
      ...publicClient,
      chain: undefined,
    };

    await expect(
      sell(sellParams, walletClient, invalidPublicClient)
    ).rejects.toThrow("Chain not found");
  });
});

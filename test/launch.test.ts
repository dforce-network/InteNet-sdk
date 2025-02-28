import { describe, it, expect, beforeAll } from "vitest";
import { launch } from "../src/index";
import { sepolia } from "viem/chains";
import { createPublicClient, createWalletClient } from "viem";
import { http } from "viem";
import "dotenv/config";
import { privateKeyToAccount } from "viem/accounts";

describe("launch", () => {
  let chain = sepolia;
  let account;
  let launchParams;
  let walletClient;
  let publicClient;

  beforeAll(async () => {
    const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
    if (!privateKey) {
      throw new Error("PRIVATE_KEY not found in environment variables");
    }

    account = privateKeyToAccount(privateKey);

    walletClient = createWalletClient({
      chain: chain,
      transport: http(),
      account,
    });

    publicClient = createPublicClient({
      chain: chain,
      transport: http(),
    });

    launchParams = {
      creator: account.address,
      name: "Test Token",
      ticker: "TEST",
      cores: [1, 2, 3],
      description: "Test Description",
      image: "ipfs://test",
      urls: ["url1", "url2", "url3", "url4"] as [
        string,
        string,
        string,
        string,
      ],
      purchaseAmount: 0,
      chain: sepolia,
    };
  });

  it("should successfully launch a token", async () => {
    const result = await launch(launchParams, walletClient, publicClient);

    console.log(result);

    expect(result).toBeDefined();
    expect(result.tokenAddress).toBeDefined();
    expect(result.transactionHash).toBeDefined();
  });

  it("should throw error if bonding contract is not found", async () => {
    const invalidParams = { ...launchParams, chain: { id: 999 } as Chain };

    await expect(
      launch(invalidParams, walletClient, publicClient)
    ).rejects.toThrow("Bonding contract not found on network");
  });
});

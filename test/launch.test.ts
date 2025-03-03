import { describe, it, expect, beforeAll } from "vitest";
import { launch } from "../src/index";
import { sepolia } from "viem/chains";
import { setup } from "./utils";

describe("launch", () => {
  let chain = sepolia;
  let account;
  let launchParams;
  let walletClient;
  let publicClient;

  beforeAll(async () => {
    ({ account, walletClient, publicClient } = setup(chain));

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
    };
  });

  it("should successfully launch a token", async () => {
    const result = await launch(launchParams, walletClient, publicClient);

    // console.log(result);

    expect(result).toBeDefined();
    expect(result.tokenAddress).toBeDefined();
    expect(result.transactionHash).toBeDefined();
  });

  it("should throw error if bonding contract is not found", async () => {
    const invalidPublicClient = {
      ...publicClient,
      chain: { id: 999 } as any,
    };

    await expect(
      launch(launchParams, walletClient, invalidPublicClient)
    ).rejects.toThrow("Bonding contract not found on network");
  });
});

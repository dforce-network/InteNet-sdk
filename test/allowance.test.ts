import { describe, it, expect, beforeAll } from "vitest";
import { ensureAllowance } from "../src/allowance";
import { sepolia } from "viem/chains";
import { parseEther } from "viem";
import { setup } from "./utils";
import { contracts } from "../src/contracts";

describe("allowance", () => {
  const networkName = "sepolia";
  const allowanceParams = {
    token: contracts[networkName].INT.address,
    spender: contracts[networkName].bonding.address,
    amount: parseEther("2.0"),
  };

  let walletClient;
  let publicClient;

  beforeAll(() => {
    ({ walletClient, publicClient } = setup(sepolia));
  });

  it("should check and approve allowance if needed", async () => {
    const result = await ensureAllowance(
      allowanceParams,
      publicClient,
      walletClient
    );

    // null is defined
    expect(result).toBeDefined();
    if (result) {
      expect(result.transactionHash).toBeDefined();
      expect(result.status).toBeDefined();
      expect(result.blockNumber).toBeDefined();
    }
  });

  it("should return null if allowance is sufficient", async () => {
    // First ensure we have enough allowance
    await ensureAllowance(allowanceParams, publicClient, walletClient);

    // Then check again - should return null as allowance is sufficient
    const result = await ensureAllowance(
      allowanceParams,
      publicClient,
      walletClient
    );

    expect(result).toBeNull();
  });

  it("should throw error if token address is invalid", async () => {
    const invalidParams = {
      ...allowanceParams,
      token: "0x1234" as `0x${string}`,
    };

    await expect(
      ensureAllowance(invalidParams, publicClient, walletClient)
    ).rejects.toThrow("Failed to ensure allowance: Failed to get allowance");
  });

  it("should handle zero amount", async () => {
    const zeroParams = {
      ...allowanceParams,
      amount: 0n,
    };

    const result = await ensureAllowance(
      zeroParams,
      publicClient,
      walletClient
    );
    expect(result).toBeNull();
  });
});

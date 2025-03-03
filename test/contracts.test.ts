import { describe, it, expect } from "vitest";
import { contracts, isSupportedChain } from "../src/contracts";

describe("Contracts", () => {
  const networkName = "sepolia";

  describe("isSupportedChain", () => {
    it("should return true for supported chains", () => {
      expect(isSupportedChain(8453)).toBe(true); // base
      expect(isSupportedChain(56)).toBe(true); // bsc
      expect(isSupportedChain(11155111)).toBe(true); // sepolia
    });

    it("should return false for unsupported chains", () => {
      expect(isSupportedChain(1)).toBe(false); // mainnet
      expect(isSupportedChain(999)).toBe(false); // non-existent chain
    });
  });

  describe("INT", () => {
    it("should have total supply", async () => {
      const totalSupply = await contracts[networkName].INT.read.totalSupply();
      console.log(totalSupply);
    });
    it("should return correct name", async () => {
      const name = await contracts[networkName].INT.read.name();
      expect(name).toBe("InteNet Protocol");
    });

    it("should return correct symbol", async () => {
      const symbol = await contracts[networkName].INT.read.symbol();
      expect(symbol).toBe("INT");
    });
  });
  describe.runIf(contracts[networkName].bonding)("Bonding", () => {
    it("should have asset token", async () => {
      const assetToken = await contracts[networkName].bonding.read.assetToken();
      expect(assetToken).toBe(contracts[networkName].INT.address);
    });
  });
});

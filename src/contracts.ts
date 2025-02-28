import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { getContract, createPublicClient, http } from "viem";
import { CHAIN_NAMES, SUPPORTED_CHAINS } from "./constants";

function loadContracts(): Record<
  string,
  Record<string, ReturnType<typeof getContract>>
> {
  const deploymentsPath = join(__dirname, "../deployments");
  const contracts: Record<
    string,
    Record<string, ReturnType<typeof getContract>>
  > = {};

  SUPPORTED_CHAINS.forEach((chain) => {
    const chainName = CHAIN_NAMES[chain.id];
    contracts[chainName] = {};

    try {
      const files = readdirSync(join(deploymentsPath, chainName));
      for (const file of files) {
        if (!file.endsWith(".json") || file.includes("-") || file.includes("_"))
          continue;

        const contractName = file.slice(0, -5); // Remove .json suffix
        const filePath = join(deploymentsPath, chainName, file);
        const content = JSON.parse(readFileSync(filePath, "utf-8"));
        contracts[chainName][contractName] = getContract({
          address: content.address,
          abi: content.abi,
          client: {
            public: createPublicClient({
              chain,
              transport: http(),
            }),
          },
        });
      }
    } catch (error) {
      console.warn(`Failed to load ABI for chain ${chainName}:`, error);
    }
  });

  return contracts;
}

export const contracts = loadContracts();

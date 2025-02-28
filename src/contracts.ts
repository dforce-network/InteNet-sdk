import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { getContract, createPublicClient, http } from "viem";
import { CHAIN_NAMES, SUPPORTED_NETWORKS } from "./constants";

function loadContracts(): Record<
  string,
  Record<string, ReturnType<typeof getContract>>
> {
  const deploymentsPath = join(__dirname, "../deployments");
  const contracts: Record<
    string,
    Record<string, ReturnType<typeof getContract>>
  > = {};

  SUPPORTED_NETWORKS.forEach((network) => {
    const networkName = CHAIN_NAMES[network.id];
    contracts[networkName] = {};

    try {
      const files = readdirSync(join(deploymentsPath, networkName));
      for (const file of files) {
        if (!file.endsWith(".json") || file.includes("-") || file.includes("_"))
          continue;

        const contractName = file.slice(0, -5); // Remove .json suffix
        const filePath = join(deploymentsPath, networkName, file);
        const content = JSON.parse(readFileSync(filePath, "utf-8"));
        contracts[networkName][contractName] = getContract({
          address: content.address,
          abi: content.abi,
          client: {
            public: createPublicClient({
              chain: network,
              transport: http(),
            }),
          },
        });
      }
    } catch (error) {
      console.warn(`Failed to load ABI for network ${network}:`, error);
    }
  });

  return contracts;
}

export const contracts = loadContracts();

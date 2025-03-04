# InteNet SDK

A TypeScript SDK for easily launching tokens on EVM chains through the InteNet protocol.

## Prerequisites

- Node.js 18+
- npm, yarn, or pnpm
- A wallet with funds on supported chains (Ethereum, Base, BSC, or Sepolia)

## Installation

Install the package using your preferred package manager:

```bash
pnpm add intenet-sdk
```

## Usage

### Launching a Token

```typescript
const launchToken = async () => {
  // Create wallet and public clients
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const launchParams = {
    creator: account.address,
    name: "Test Token",
    ticker: "TEST",
    cores: [1, 2, 3],
    description: "Test Description",
    image: "ipfs://test",
    urls: ["url1", "url2", "url3", "url4"] as [string, string, string, string],
    purchaseAmount: 0,
  };

  const result = await sdk.launch(launchParams, walletClient, publicClient);

  console.log("Token deployed at:", result.tokenAddress);
  console.log("Transaction hash:", result.transactionHash);
};
```

### Buying Tokens

```typescript
const buyTokens = async () => {
  // Create wallet and public clients
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const buyParams = {
    tokenAddress: "0xb6cfb9be9aa4ff175484494bb803da7205e0274c", // Replace with your token address
    amount: parseEther("0.0001"), // Amount of INT to spend
  };

  const result = await sdk.buy(buyParams, walletClient, publicClient);

  console.log("Transaction hash:", result.transactionHash);
  console.log("Token amount received:", result.tokenAmount);
  console.log("Asset amount spent:", result.assetAmount);
};
```

### Selling Tokens

```typescript
const sellTokens = async () => {
  // Create wallet and public clients
  const walletClient = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
  });

  const sellParams = {
    tokenAddress: "0xb6cfb9be9aa4ff175484494bb803da7205e0274c", // Replace with your token address
    amount: parseEther("1000"), // Amount of token to sell
  };

  const result = await sdk.sell(sellParams, walletClient, publicClient);

  console.log("Transaction hash:", result.transactionHash);
  console.log("Token amount sold:", result.tokenAmount);
  console.log("Asset amount received:", result.assetAmount);
};
```

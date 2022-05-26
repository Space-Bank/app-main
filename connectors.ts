import { InjectedConnector } from '@web3-react/injected-connector';

export const injected = new InjectedConnector({
  supportedChainIds: [53935, 1, 9001, 1666700000, 1337, 31337, 1666600000, 3, 4, 5, 42, 1337, 10, 137, 250, 43114, 42161, 288, 1313161554, 122, 56, 1285],
});

export const networks = {
  hardhat: {
    chainId: `0x${Number(31337).toString(16)}`
  },
  harmony: {
    chainId: `0x${Number(1666600000).toString(16)}`,
    chainName: "Harmony One",
    nativeCurrency: {
      name: "Harmony One",
      symbol: "ONE",
      decimals: 18
    },
    rpcUrls: ["https://harmony-0-rpc.gateway.pokt.network"],
    blockExplorerUrls: ["https://explorer.harmony.one/"]
  },
  testnet: {
    chainId: `0x${Number(1666700000).toString(16)}`,
    chainName: "Harmony One Testnet Shard 0",
    nativeCurrency: {
      name: "Harmony One",
      symbol: "ONE",
      decimals: 18
    },
    rpcUrls: ["https://api.s0.b.hmny.io"],
    blockExplorerUrls: ["https://explorer.pops.one/"]
  }
}
import { configureChains, createConfig } from "wagmi";
import { foundry, goerli, optimismGoerli } from "wagmi/chains";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { getDefaultWallets } from "@rainbow-me/rainbowkit";

/**
 * Tell wagmi which chains you want to support
 * To add a new chain simply import it and add it here
 * @see https://wagmi.sh/react/providers/configuring-chains
 */
const { chains, publicClient } = configureChains(
  [goerli, optimismGoerli, foundry],
  [
    /**
     * Tells wagmi to use the default RPC URL for each chain
     * for some dapps the higher rate limits of Alchemy may be required
     */
    jsonRpcProvider({
      rpc: (chain) => {
        if (chain.id === foundry.id) {
          return { http: "http://localhost:8545" };
        }
        if (chain.id === goerli.id && import.meta.env.VITE_RPC_URL_GOERLI) {
          return { http: import.meta.env.VITE_RPC_URL_GOERLI };
        }
        if (
          chain.id === optimismGoerli.id &&
          import.meta.env.VITE_RPC_URL_OP_GOERLI
        ) {
          return { http: import.meta.env.VITE_RPC_URL_OP_GOERLI };
        }
        return { http: chain.rpcUrls.default.http[0] };
      },
    }),
  ],
);

/**
 * Export chains to be used by rainbowkit
 * @see https://wagmi.sh/react/providers/configuring-chains
 */
export { chains };

/**
 * Configures wagmi connectors for rainbowkit
 * @see https://www.rainbowkit.com/docs/custom-wallet-list
 * @see https://wagmi.sh/react/connectors
 */
const { connectors } = getDefaultWallets({
  appName: "EVMGateway OPGoerli Passport",
  chains,
  projectId: import.meta.env.VITE_WALLETCONNECT_PROJECT_ID,
});

/**
 * Creates a singleton wagmi client for the app
 * @see https://wagmi.sh/react/client
 */
export const config = createConfig({
  autoConnect: true,
  connectors: connectors,
  publicClient,
  webSocketPublicClient: publicClient,
});

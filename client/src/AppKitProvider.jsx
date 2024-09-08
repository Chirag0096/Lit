import { createWeb3Modal } from '@web3modal/wagmi/react';
import { defaultWagmiConfig } from '@web3modal/wagmi/react/config';
import { WagmiProvider } from 'wagmi';
import { arbitrum, mainnet } from 'wagmi/chains';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// 0. Setup queryClient
const queryClient = new QueryClient();

// 1. Get projectId from https://cloud.walletconnect.com
const projectId = import.meta.env.VITE_APP_WALLETCONNECT_ID; // Replace with your WalletConnect project ID

// 2. Define Chronicle Yellowstone Lit Protocol Testnet chain
const chronicleYellowstone = {
  id: 175188, // Chain ID for Chronicle Yellowstone
  name: 'Chronicle Yellowstone Testnet',
  network: 'litProtocolTestnet',
  nativeCurrency: {
    name: 'tstLPX',
    symbol: 'tstLPX',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://yellowstone-rpc.litprotocol.com'], // RPC server address for Yellowstone Testnet
    },
    public: {
      http: ['https://yellowstone-rpc.litprotocol.com'],
    },
  },
  blockExplorers: {
    default: { name: 'Yellowstone Explorer', url: 'https://explorer.litprotocol.com/' }, // Placeholder, update with real explorer URL if applicable
  },
  testnet: true,
};

// 3. Add Chronicle Yellowstone Testnet to chains array
const chains = [mainnet, arbitrum, chronicleYellowstone];

// 4. Create wagmiConfig
const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://documedai.vercel.app/', // Ensure this URL matches your domain or subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
});

// 5. Create modal
createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true, // Optional
});

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  );
}

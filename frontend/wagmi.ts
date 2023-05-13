import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { mainnet, polygon } from 'wagmi/chains';
import { publicProvider } from 'wagmi/providers/public'
import { LensConfig, staging } from '@lens-protocol/react-web';
import { bindings as wagmiBindings } from '@lens-protocol/wagmi';

const { provider, webSocketProvider } = configureChains([polygon, mainnet], [publicProvider()]);

const client = createClient({
  autoConnect: true,
  provider,
  webSocketProvider,
});

// @ts-ignore
staging.name = "staging"
staging.backend = "https://api-sandbox-mumbai.lens.dev"

const lensConfig: LensConfig = {
  bindings: wagmiBindings(),
  environment: staging,
};

export {
    client,
    lensConfig,
}
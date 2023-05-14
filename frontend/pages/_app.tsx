import CreateProfileForm from "@/components/CreateProfileForm";
import LensConnectButton from "@/components/LensConnectButton";
import "@/styles/globals.css";
import { client, lensConfig } from "@/wagmi";
import { LensProvider } from "@lens-protocol/react-web";
import type { AppProps } from "next/app";
import Link from "next/link";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { WagmiConfig } from "wagmi";
import { Provider } from "react-redux";
import { store } from "@/store";

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);

  return (
    <Provider store={store}>
      <WagmiConfig client={client}>
        <LensProvider config={lensConfig}>
          <div>
            <div className="navbar bg-base-100 flex flex-row justify-between">
              <Link href="/" className="btn btn-ghost normal-case text-xl">
                🔬 Lens Publishing
              </Link>
              <div className="flex flex-row items-center">
                <Link href="/publish">
                  <button className="btn">Create Publication</button>
                </Link>
                <LensConnectButton />
              </div>
            </div>
            <Component {...pageProps} />
            <Toaster position="bottom-center" />

            <CreateProfileForm
              open={open}
              onClose={() => {
                setOpen(false);
              }}
            />
          </div>
        </LensProvider>
      </WagmiConfig>
    </Provider>
  );
}

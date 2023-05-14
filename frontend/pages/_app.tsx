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

export default function App({ Component, pageProps }: AppProps) {
  const [open, setOpen] = useState(false);

  return (
    <WagmiConfig client={client}>
      <LensProvider config={lensConfig}>
        <div>
          <div className="navbar bg-base-100 flex flex-row justify-between">
            <Link href="/" className="btn btn-ghost normal-case text-xl">
              🔬 Lens Publishing
            </Link>
            <div className="flex flex-row items-center">
              <Link href="/publish">
                <button className="btn btn-outline btn-primary">
                  Create Publication
                </button>
              </Link>
              <button
                className="btn btn-square ml-2"
                onClick={() => {
                  setOpen(true);
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zM4 19.235v-.11a6.375 6.375 0 0112.75 0v.109A12.318 12.318 0 0110.374 21c-2.331 0-4.512-.645-6.374-1.766z"
                  />
                </svg>
              </button>
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
  );
}

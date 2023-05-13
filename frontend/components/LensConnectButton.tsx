import {
  useWalletLogin,
  useActiveProfile,
  MediaSet,
} from "@lens-protocol/react-web";
import classNames from "classnames";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { InjectedConnector } from "wagmi/connectors/injected";

function LensConnectButton() {
  const {
    data: profile,
    error,
    loading: profileIsLoading,
  } = useActiveProfile();
  const {
    execute: login,
    error: loginError,
    isPending: isLoginPending,
  } = useWalletLogin();

  const { isConnected } = useAccount();
  const { disconnectAsync } = useDisconnect();

  const { connectAsync } = useConnect({
    connector: new InjectedConnector(),
  });

  const onLoginClick = async () => {
    if (isConnected) {
      await disconnectAsync();
    }

    const { connector } = await connectAsync();

    if (connector instanceof InjectedConnector) {
      const signer = await connector.getSigner();
      await login(signer);
    }
  };

  return (
    <div className="p-2">
      {!profile ? (
        <button
          className={classNames(
            "btn btn-primary",
            profileIsLoading && "loading"
          )}
          disabled={isLoginPending}
          onClick={profileIsLoading ? () => {} : onLoginClick}
        >
          {profileIsLoading ? "" : "Sign in"}
        </button>
      ) : (
        <div className="flex flex-row justify-center items-center p-2 border gap-2 h-full">
          {profile?.picture && (
            <img
              src={`https://ipfs.io/ipfs/${
                (profile?.picture as MediaSet).original.url.split("//")[1]
              }`}
              className="h-8 w-8"
            />
          )}

          <p className="font-bold">{profile?.handle}</p>
        </div>
      )}
    </div>
  );
}

export default LensConnectButton;

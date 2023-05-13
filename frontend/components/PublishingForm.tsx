import useWeb3Storage from "@/hooks/useWeb3Storage";
import { v4 } from "uuid";
import {
  ProfileOwnedByMe,
  useActiveWallet,
  useActiveWalletSigner,
} from "@lens-protocol/react-web";
import classNames from "classnames";
import dynamic from "next/dynamic";
import { useState } from "react";
import toast from "react-hot-toast";
import "react-quill/dist/quill.snow.css";
import {
  LensClient,
  PublicationMainFocus,
  development,
  isRelayerResult,
} from "@lens-protocol/client";

import { appId } from "@/constants";
import { AbiCoder } from "ethers/lib/utils.js";
import { useSignTypedData } from "wagmi";

const PublicationEditor = dynamic(() => import("@/components/Editor"), {
  ssr: false,
});

const PublishingForm = ({ profile }: { profile: ProfileOwnedByMe }) => {
  const toastId = "publishing-toast";
  const { signTypedDataAsync } = useSignTypedData();
  const { data: wallet } = useActiveWallet();
  const { data: walletSigner } = useActiveWalletSigner();
  const { uploadJSON } = useWeb3Storage();

  const [title, setTitle] = useState("");
  const [articleText, setArticleText] = useState("");
  const [creatingPublication, setCreatingPublication] = useState(false);

  const createPublication = async (text: string) => {
    setCreatingPublication(true);

    toast.loading("Publishing article...", { id: toastId });

    if (!wallet || !wallet?.address) return;

    // @ts-ignore
    development.name = "staging";
    // @ts-ignore
    development.url = "https://api-sandbox-mumbai.lens.dev";

    const lensClient = new LensClient({
      environment: development,
    });

    const challenge = await lensClient.authentication.generateChallenge(
      wallet?.address
    );

    if (!walletSigner) return;

    const signature = await walletSigner.signMessage(challenge);

    await lensClient.authentication.authenticate(wallet?.address, signature);

    // check the state with
    const ok = await lensClient.authentication.isAuthenticated();

    if (!ok) {
      toast.error("Authentication failed");
      return;
    }

    /**
     * Validate Metadata
     */
    const metadata = {
      appId,
      attributes: [],
      content: text,
      description: "LensPub post made by " + profile.handle,
      locale: "en-US",
      mainContentFocus: PublicationMainFocus.TextOnly,
      metadata_id: v4(),
      name: "Post created @ ETHGlobal Lisbon w/ LensClient SDK",
      tags: [],
      version: "2.0.0",
    };

    toast.loading("Validating metadata...", { id: toastId });

    const publicationOk = await lensClient.publication.validateMetadata(
      metadata
    );

    if (!publicationOk.valid) {
      toast.error("Publication metadata invalid");
      return;
    } else {
    }

    toast.loading("Uploading metadata to IPFS...", { id: toastId });

    const contentURI = await uploadJSON(metadata);

    const createSetDispatchertypedDataResult =
      await lensClient.profile.createSetDispatcherTypedData({
        profileId: profile.id,
      });

    const createSetDispatcherData = createSetDispatchertypedDataResult.unwrap();

    const createSetDispatchertypedData = await signTypedDataAsync({
      //   @ts-ignore
      domain: createSetDispatcherData.typedData.domain,
      types: createSetDispatcherData.typedData.types,
      value: createSetDispatcherData.typedData.value,
    });

    toast.loading("Broadcasting transaction...", { id: toastId });

    const broadcastResult = await lensClient.transaction.broadcast({
      id: createSetDispatcherData.id,
      signature: createSetDispatchertypedData,
    });

    if (!isRelayerResult(broadcastResult.unwrap())) {
      toast.error("Error broadcasting transaction");
      return;
    }
    {
      toast.loading("Transaction broadcasted...", { id: toastId });
    }

    await lensClient.publication.createPostViaDispatcher({
      profileId: profile.id,
      contentURI,
      referenceModule: {
        unknownReferenceModule: {
          contractAddress: "0x0250DFD011C52496605ceE9D93ce82199c1700aA",
          data: new AbiCoder().encode(["uint[]", "string"], [[], title]),
        },
      },
      collectModule: {
        freeCollectModule: {
          followerOnly: false,
        },
      },
    });

    toast.success("Article Published !", {
      id: toastId,
    });
    setCreatingPublication(false);
  };

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex flex-col">
          <label>Title</label>
          <input
            className="input input-bordered"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
          />
        </div>
        <div>
          <label>Article</label>
          <PublicationEditor
            value={articleText}
            onChange={(text) => {
              setArticleText(text);
            }}
          />
        </div>
      </div>
      <div className="py-2 flex flex-row justify-end">
        <button
          onClick={() => {
            createPublication(articleText);
          }}
          className={classNames(
            "btn btn-primary",
            creatingPublication && "loading"
          )}
        >
          Publish
        </button>
      </div>
    </>
  );
};

export default PublishingForm;

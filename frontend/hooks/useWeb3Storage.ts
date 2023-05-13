import { MetadataUploadHandler } from "@lens-protocol/react-web";
import { Web3Storage } from "web3.storage";

const token = process.env.NEXT_PUBLIC_WEB3_STORAGE_KEY as string;

const client = new Web3Storage({ token });

const useWeb3Storage = () => {
    const uploadJSON: MetadataUploadHandler = async (data: unknown) => {
        // Create JSON file from object
        const json = JSON.stringify(data);
        // Create blob from JSON
        const blob = new Blob([json], { type: 'application/json' });
        // Create file from blob
        const file = new File([blob], 'metadata.json');

        const cid = await client.put([file], {
            wrapWithDirectory: false,
        });

        return `ipfs://${cid}`
    } 

    return {
        uploadJSON,
    }
}

export default useWeb3Storage;
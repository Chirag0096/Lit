import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";

export const encryptBrainTumorImage = async (imageBase64) => {
    const client = new LitNodeClient({ litNetwork: 'datil-dev' });
    await client.connect();

    const accessControlConditions = [
        {
            contractAddress: '',
            standardContractType: '',
            chain: 'ethereum',
            method: 'eth_getBalance',
            parameters: [':userAddress', 'latest'],
            returnValueTest: {
                comparator: '>=',
                value: '0',
            },
        },
    ];

    // Encrypt the image (Base64 string)
    const { ciphertext, dataToEncryptHash } = await encryptString(
        {
            accessControlConditions,
            dataToEncrypt: imageBase64, // The image in Base64 format
        },
        client
    );

    console.log("Encrypted Image:", ciphertext);
    console.log("Hash:", dataToEncryptHash);

    // Store ciphertext and hash for later decryption via Lit Action
    return { ciphertext, dataToEncryptHash };
};

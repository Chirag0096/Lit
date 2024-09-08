import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";
import { LitContracts } from "@lit-protocol/contracts-sdk";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
} from "@lit-protocol/auth-helpers";

// Create a single LitNodeClient instance to be reused
let litNodeClient = null;

export const getLitNodeClient = async () => {
  if (!litNodeClient) {
    litNodeClient = new LitNodeClient({ litNetwork: 'datil-dev' }); // Use your desired network
    await litNodeClient.connect();
  }
  return litNodeClient;
};

export const getSessionSigsViaAuthSig = async (capacityTokenId, signer) => {
  console.log(signer);
  
  let sessionSignatures = null;

  try {
    // Create the LitNodeClient
    const litNodeClient = await getLitNodeClient();

    // Fetch the wallet signer using wagmi (signer is connected through WalletConnect or similar)

    if (!signer) {
      console.error("No signer available");
      return;
    }

    console.log("🔄 Connecting LitContracts client to network...");
    console.log(signer);
    
    const litContracts = new LitContracts({
      signer,
      network: LitNetwork.DatilTest,
      debug: false,
    });
    await litContracts.connect();
    console.log("✅ Connected LitContracts client to network");

    // Mint capacity credits if no token ID is passed
    if (!capacityTokenId) {
      console.log("🔄 Minting Capacity Credits NFT...");
      const mintResult = await litContracts.mintCapacityCreditsNFT({
        requestsPerKilosecond: 10,
        daysUntilUTCMidnightExpiration: 1,
      });
      capacityTokenId = mintResult.capacityTokenIdStr;
      console.log(`✅ Minted new Capacity Credit with ID: ${capacityTokenId}`);
    }

    // Create capacityDelegationAuthSig using the signer
    console.log("🔄 Creating capacityDelegationAuthSig...");
    const { capacityDelegationAuthSig } =
      await litNodeClient.createCapacityDelegationAuthSig({
        dAppOwnerWallet: signer,
        capacityTokenId,
        delegateeAddresses: [await signer.getAddress()],
        uses: "1",
      });
    console.log(`✅ Created the capacityDelegationAuthSig`);

    // Generate session signatures using the capacityDelegationAuthSig
    console.log("🔄 Getting Session Sigs via an Auth Sig...");
    sessionSignatures = await litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(), // 10 minutes expiration
      capabilityAuthSigs: [capacityDelegationAuthSig],
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({ uri, expiration, resourceAbilityRequests }) => {
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: await signer.getAddress(),
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        const signedMessage = await signer.signMessage(toSign);

        return await generateAuthSig({
          signer,
          toSign: signedMessage,
        });
      },
    });
    console.log("✅ Got Session Sigs via an Auth Sig");

    return sessionSignatures;
  } catch (error) {
    console.error("Error during session sig generation:", error);
  }
};

// Encrypt the brain tumor image
export const encryptBrainTumorImage = async (imageBase64, sessionSigs) => {
  const client = await getLitNodeClient(); // Reuse or create LitNodeClient

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
      chain: 'ethereum',
      sessionSigs: sessionSigs, // Pass the sessionSigs here
    },
    client
  );

  console.log("Encrypted Image:", ciphertext);
  console.log("Hash:", dataToEncryptHash);

  // Return ciphertext and hash for later use (e.g., decryption)
  return { ciphertext, dataToEncryptHash };
};

import { LitNetwork, LIT_RPC } from "@lit-protocol/constants";
import { LitNodeClient, encryptString } from "@lit-protocol/lit-node-client";
import {
  LitAbility,
  LitAccessControlConditionResource,
  createSiweMessage,
  generateAuthSig,
  LitActionResource,
  createSiweMessageWithRecaps
} from "@lit-protocol/auth-helpers";

// Create a single LitNodeClient instance to be reused
let litNodeClient = null;

// Get or create LitNodeClient
export const getLitNodeClient = async () => {
  if (!litNodeClient) {
    litNodeClient = new LitNodeClient({ litNetwork: LitNetwork.DatilTest }); // Use your desired network
    await litNodeClient.connect();
  }
  return litNodeClient;
};

// Helper function to generate AuthSig
const genAuthSig = async (wallet, client, uri, resources) => {
  const blockHash = await client.getLatestBlockhash();
  const message = await createSiweMessageWithRecaps({
    walletAddress: await wallet.getAddress(),
    nonce: blockHash,
    litNodeClient: client,
    resources,
    expiration: ONE_WEEK_FROM_NOW,
    uri,
  });
  
  return generateAuthSig({
    signer: wallet,
    toSign: message,
    address: wallet.address,
  });
};

// Generate session signatures using AuthSig
const genSession = async (wallet, client, resources) => {
  return await client.getSessionSigs({
    chain: "ethereum",
    resourceAbilityRequests: resources,
    authNeededCallback: async (params) => {
      const authSig = await genAuthSig(wallet, client, params.uri, params.resourceAbilityRequests ?? []);
      return authSig;
    },
  });
};

// Get session signatures via AuthSig
export const getSessionSigsViaAuthSig = async (signer) => {
  try {
    const litNodeClient = await getLitNodeClient();

    if (!signer) {
      console.error("No signer available");
      return;
    }

    // Generate session signatures
    return await litNodeClient.getSessionSigs({
      chain: "ethereum",
      expiration: new Date(Date.now() + 1000 * 60 * 10).toISOString(),
      resourceAbilityRequests: [
        {
          resource: new LitAccessControlConditionResource("*"),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async (params) => {
        const toSign = await createSiweMessage({
          uri: params.uri,
          expiration: params.expiration,
          resources: params.resourceAbilityRequests,
          walletAddress: await signer.getAddress(),
          nonce: await litNodeClient.getLatestBlockhash(),
          litNodeClient,
        });

        return await generateAuthSig({
          signer: signer,
          toSign,
        });
      },
    });
  } catch (error) {
    console.error("Error during session sig generation:", error);
  }
};

const ONE_WEEK_FROM_NOW = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 7
).toISOString();

// Encrypt the brain tumor image
export const encryptBrainTumorImage = async (imageBase64, signer) => {
  const client = await getLitNodeClient();

  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ];

  const sessionSigs = await getSessionSigsViaAuthSig(signer);

  // Encrypt the image (Base64 string)
  const { ciphertext, dataToEncryptHash } = await encryptString(
    {
      accessControlConditions,
      dataToEncrypt: imageBase64,
    },
    client
  );

  const accsResourceString = await LitAccessControlConditionResource.generateResourceString(
    accessControlConditions,
    dataToEncryptHash
  );
  
  const sessionForDecryption = await genSession(signer, client, [
    {
      resource: new LitActionResource("*"),
      ability: LitAbility.LitActionExecution,
    },
    {
      resource: new LitAccessControlConditionResource(accsResourceString),
      ability: LitAbility.AccessControlConditionDecryption,
    },
  ]);

  const code = `(async () => {
    const decryptedImage = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: 'ethereum',
    });

    const response = await fetch("https://dd9c-34-145-35-23.ngrok-free.app/send-message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ image: decryptedImage }),
    });

    const apiResponse =  JSON.stringify(await response.json());

    Lit.Actions.setResponse({ response: apiResponse });
  })();`;

  const result = await client.executeJs({
    code,
    sessionSigs: sessionForDecryption,
    jsParams: {
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
    },
  });

  console.log("Response from Lit Action:", JSON.parse(result.response).response);

  return JSON.parse(result.response).response;
};

// Execute Brain Tumor Analysis
export const executeBrainTumourAnalysis = async (ciphertext, dataToEncryptHash, signer) => {
  const client = await getLitNodeClient();

  const accessControlConditions = [
    {
      contractAddress: "",
      standardContractType: "",
      chain: "ethereum",
      method: "eth_getBalance",
      parameters: [":userAddress", "latest"],
      returnValueTest: {
        comparator: ">=",
        value: "0",
      },
    },
  ];

  const code = `(async () => {
    const decryptedImage = await Lit.Actions.decryptAndCombine({
      accessControlConditions,
      ciphertext,
      dataToEncryptHash,
      authSig: null,
      chain: 'ethereum',
    });

    const response = await fetch("https://your-api-url.com/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ imageData: decryptedImage }),
    });

    const apiResponse = await response.json();
    Lit.Actions.setResponse({ response: apiResponse });
  })();`;

  try {
    const sessionSigs = await getSessionSigsViaAuthSig(signer);

    const result = await client.executeJs({
      code,
      sessionSigs: sessionSigs,
      jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
      },
    });

    console.log("Response from Lit Action:", result);
    return result.response;
  } catch (error) {
    console.error("Error executing Lit Action:", error);
    throw error;
  }
};

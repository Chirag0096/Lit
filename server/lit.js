const LitJsSdk = require("@lit-protocol/lit-node-client-nodejs");
const { LitNetwork } = require("@lit-protocol/constants");

const decryptImageAndSendToApi = async (
  ciphertext,
  dataToEncryptHash,
  sessionSigs
) => {
  const client = new LitJsSdk.LitNodeClientNodeJs({ litNetwork: LitNetwork.Datil });
  await client.connect();

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

  // Abstracted Lit Action code
  const code = `(async () => {
      // Decrypt the image using Lit Protocol
      const decryptedImage = await Lit.Actions.decryptAndCombine({
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig: null,
        chain: 'ethereum',
      });
  
      // Send the decrypted image to your external API
      const response = await fetch("https://dbe9-2401-4900-1c83-d1bb-371-9dbe-c344-4fa.ngrok-free.app/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: decryptedImage, // Sending decrypted image to your API
        }),
      });
  
      const apiResponse = await response.json();
  
      // Return the response from the API back to the Lit Action
      Lit.Actions.setResponse({ response: apiResponse });
    })();`;

  try {
    // Execute Lit Action using the sessionSigs
    const result = await client.executeJs({
      sessionSigs, // Use the sessionSigs passed to the function
      code,
      jsParams: {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
      },
    });

    console.log("Response from Lit Action:", result);
    client.disconnect();

    // Return the response from Lit Action (API response)
    return result.response;
  } catch (error) {
    console.error("Error executing Lit Action:", error);
    throw error;
  }
};


module.exports = { decryptImageAndSendToApi }
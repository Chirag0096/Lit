import React, { useEffect, useState } from "react";
import { IoMdSend } from "react-icons/io";
import { FiLoader } from "react-icons/fi";
import { FiPaperclip } from "react-icons/fi";
import { useAccount, useSignMessage, useWalletClient } from "wagmi";
import { encryptBrainTumorImage, getSessionSigsViaAuthSig } from "../../js/lit";
import { createWalletClient, custom } from "viem";
import { mainnet } from "viem/chains";
import { ethers } from "ethers";

const Input = ({ query, currentChat, user, loading, setLoading, getNewChat }) => {
  const [inputField, setInputField] = useState("");
  const [imageBase64, setImageBase64] = useState(null);
  const { address: userAddress } = useAccount();
  const { signMessage, data: signedMessage } = useSignMessage();
  const [userSigner, setuserSigner] = useState(null);
  const userrSigner = createWalletClient({ chain: mainnet,
    transport: custom(window.ethereum)
  });

  useEffect(() => {
    if (signedMessage) {
      handleImageEncryption(signedMessage);
    }
  }, [signedMessage]);

  const onEnterPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      triggerQuery();
    }
  };

  const triggerQuery = async () => {
    if (inputField.trim() === "" && !imageBase64) return;

    if (imageBase64) {
      console.log(userrSigner);
      
      const sessionSigs = await getSessionSigsViaAuthSig(null, userrSigner);
      const base64Image = imageBase64.split(",")[1];
    const { ciphertext, dataToEncryptHash } = await encryptBrainTumorImage(base64Image, sessionSigs);
      console.log(sessionSigs);

      query({
        ciphertext,
        dataToEncryptHash,
        type: "image",
        sessionSig: sessionSigs,
      });
      
    } else {
      query({
        type: "message",
        query: inputField,
      });
    }
    setInputField("");
  };

  const handleImageEncryption = async (signedMessage) => {
    
    setImageBase64(null);
  };

  const onChange = (e) => {
    setInputField(e.target.value);
    if (currentChat === "") getNewChat();
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageBase64(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {

    const populateShit = async( ) => {
      const provider = new ethers.BrowserProvider(window.ethereum);
  
      const signer = await provider.getSigner(userAddress);
      
      console.log(signer);
      
      setuserSigner(signer);
    }

    populateShit();
  }, [window.ethereum])
  

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Type your message..."
        value={inputField}
        onChange={onChange}
        onKeyDown={onEnterPress}
      />
      <label className="file-input-label">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          style={{ display: 'none' }}
        />
        <FiPaperclip />
      </label>
      <div className="send-icon" onClick={triggerQuery}>
        {loading ? <FiLoader /> : <IoMdSend />}
      </div>
    </div>
  );
};

export default Input;
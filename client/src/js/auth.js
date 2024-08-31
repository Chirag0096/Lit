import { getAuth, signInWithPopup, GoogleAuthProvider, setPersistence, browserLocalPersistence, signOut } from "firebase/auth";
import { app } from "./firebase";

const provider = new GoogleAuthProvider();

export const auth = getAuth(app);

export const signInUser = () => {
    setPersistence(auth, browserLocalPersistence)
    .then(() => {
      return signInWithPopup(auth, provider);
    })
    .then((result) => {
      // This gives you a Google Access Token. You can use it to access the Google API.
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      // The signed-in user info.
      const user = result.user;
      // IdP data available using getAdditionalUserInfo(result)
      // ...
    })
    .catch((error) => {
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
      const credential = GoogleAuthProvider.credentialFromError(error);
      // ...
      console.error('Error during sign-in:', error);
    });
}


export const signOutUser = () => {
  signOut(auth).then(() => {
    console.log("Signed Out");
  }).catch((error) => {
    console.log(error);
  });
}


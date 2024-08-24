import express from 'express';
import * as LitJsSdk from "@lit-protocol/lit-node-client";
import { LitNetwork } from '@lit-protocol/constants';

const app = express(); // Initialize Express application

app.locals.litNodeClient = new LitJsSdk.LitNodeClientNodeJs({
  alertWhenUnauthorized: false,
  litNetwork: LitNetwork.Cayenne,
});

(async () => {
  await app.locals.litNodeClient.connect();
  console.log('LitNodeClient connected');
})();

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

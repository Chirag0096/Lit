import { LitNodeClient } from '@lit-protocol/lit-node-client';
import { LitNetwork } from '@lit-protocol/constants';

const client = new LitNodeClient({
  litNetwork: LitNetwork.Cayenne,
});

(async () => {
  try {
    await client.connect();
    console.log('LitNodeClient connected on client-side');
  } catch (error) {
    console.error('Failed to connect LitNodeClient on client-side:', error);
  }
})();

// import { Ed25519Provider } from "key-did-provider-ed25519";
// import KeyResolver from "key-did-resolver";
// import { DID } from "dids";
// import { CeramicClient } from "@ceramicnetwork/http-client";
// import { TileDocument } from "@ceramicnetwork/stream-tile";

export const wellgorize = (posts) => {
  // TODO: INSERT A MORE INTELLIGENT ALGORITHM HERE
  return posts.sort(() => Math.random() - 0.5);
};

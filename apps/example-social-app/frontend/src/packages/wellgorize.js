// import { Ed25519Provider } from "key-did-provider-ed25519";
// import KeyResolver from "key-did-resolver";
// import { DID } from "dids";
// import { CeramicClient } from "@ceramicnetwork/http-client";
// import { TileDocument } from "@ceramicnetwork/stream-tile";

// got rugged by js module compat issues so couldn't get this working in iris :/
async function demo() {
  let utf8Encode = new TextEncoder();

  const seed = utf8Encode.encode(
    "02ce07ae3358a22d837018261cc9828c542cbefa3c68a6e067ac6ac14a1e9f4b".substring(
      0,
      32
    )
  ); //  32 bytes with high entropy
  console.log(seed.length);
  const provider = new Ed25519Provider(seed);
  const did = new DID({ provider, resolver: KeyResolver.getResolver() });
  await did.authenticate();

  // log the DID
  console.log(did.id);

  // create JWS
  const { jws, linkedBlock } = await did.createDagJWS({ hello: "world" });

  // verify JWS
  await did.verifyJWS(jws);

  // create JWE
  //const jwe = await did.createDagJWE({ very: 'secret' }, [did.id])

  // decrypt JWE
  // const decrypted = await did.decryptDagJWE(jwe)

  // Connect to a Ceramic node
  const API_URL = "https://ceramic-clay.3boxlabs.com";

  // Create the Ceramic object
  const ceramic = new CeramicClient(API_URL);

  ceramic.did = did;

  const ddoc = await TileDocument.deterministic(ceramic, {
    // A single controller must be provided to reference a deterministic document
    controllers: [did.id],
    // A family or tag must be provided in addition to the controller
    family: "myFamily",
  });

  const decrypted = await did.decryptDagJWE(ddoc.content);

  const jwe2 = await did.createDagJWE({ very: "secret2" + decrypted.very }, [
    did.id,
  ]);

  await ddoc.update(jwe2, ddoc.id);

  const newDoc = await TileDocument.load(ceramic, ddoc.id);

  const decrypted2 = await did.decryptDagJWE(newDoc.content);

  console.log(ddoc);
  //console.log(decrypted)
  console.log(decrypted2);
}

export const wellgorize = (posts) => {
  // TODO: INSERT A MORE INTELLIGENT ALGORITHM HERE
  return posts.sort(() => Math.random() - 0.5);
};

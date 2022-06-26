import { useEffect, useState } from "react";
import "./App.css";

import { PrivyClient, SiweSession } from "@privy-io/privy-browser";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const { chains, provider } = configureChains(
  [chain.mainnet],
  [alchemyProvider({ alchemyId: import.meta.env.ALCHEMY_ID }), publicProvider()]
);

const { connectors } = getDefaultWallets({
  appName: "My RainbowKit App",
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});

const App = () => {
  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <TheApp provider={provider} />
      </RainbowKitProvider>
    </WagmiConfig>
  );
};

function TheApp(props) {
  const [state, setState] = useState(null);
  const [count, setCount] = useState(0);
  const [usernameInput, setUsernameInput] = useState("");
  const [likeCount, setLikeCount] = useState("");

  window.process = {};

  // Initialize the Privy client.
  const session = new SiweSession(
    import.meta.env.VITE_PRIVY_API_KEY,
    props.provider
  );
  const client = new PrivyClient({
    session: session,
  });

  const fetchDataFromPrivy = async () => {
    try {
      // If this is a refresh, we need to pull the address into state
      const address = await session.address();
      if (!address) return;

      // Fetch user's username and like count from Privy
      const [like, username] = await client.get(address, ["like", "username"]);

      setState({
        ...state,
        userId: address,
        username: username?.attributes?.value,
        like: like,
      });
      setUsernameInput(username?.attributes?.value);
      setLikeCount(like?.attributes?.value);
    } catch (error) {
      console.error(error);
    }
  };

  // When the page first loads, check if there is a connected wallet and get
  // user data associated with this wallet from Privy
  useEffect(
    (likeCount) => {
      fetchDataFromPrivy();
    },
    [likeCount]
  );

  /* Connect to a wallet */
  const connectToWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("you're not on ethereum");
        return;
      }

      await session.authenticate();
      const userId = await session.address();
      setState({
        ...state,
        userId: userId,
      });

      // After the wallet has been detected, we try to grab data from Privy if
      // it exists
      fetchDataFromPrivy();
    } catch (error) {
      console.error("ERROR", error);
    }
  };

  /* Write the user's username & like */
  const submitDataToPrivy = async () => {
    const theObject = { username: "ELLIE", age: "28" };
    const [like, username] = await client.put(state?.userId, [
      {
        field: "username",
        value: JSON.stringify(theObject),
      },
      {
        field: "like",
        value: likeCount,
      },
    ]);

    alert(JSON.stringify(theObject));
    setState({
      ...state,
      username: JSON.stringify(theObject),
      like: like.text(),
    });
  };

  // A convenient shortening of a long address
  const placeholderName =
    state?.userId?.substring(0, 5) +
    "..." +
    state?.userId?.substring(state?.userId?.length - 4);

  return (
    <div>
      {!state?.userId ? (
        <>
          <div>To get started, connect with MetaMask!</div>
          <ConnectButton />
        </>
      ) : (
        <div>
          <h1>Hey {placeholderName} 👋</h1>
          <h2>LENS POST</h2>
          <h3>
            click the button below to like this post! *you can like multiple
            times*
          </h3>
          <button
            type="button"
            onClick={() => {
              setCount((count) => count + 1);
              setLikeCount(count);
              submitDataToPrivy();
            }}
          >
            you have 'liked' this post: {likeCount} times
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

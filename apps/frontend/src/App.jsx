import { useEffect, useState } from "react";
import "./App.css";

import { PrivyClient, SiweSession } from "@privy-io/privy-browser";

function App() {
  const [state, setState] = useState(null);
  const [count, setCount] = useState(0);
  const [usernameInput, setUsernameInput] = useState("");
  const [likeCount, setLikeCount] = useState("");

  window.process = {};

  // Initialize the Privy client.
  const provider = typeof window !== "undefined" ? window.ethereum : null;
  const session = new SiweSession(import.meta.env.VITE_PRIVY_API_KEY, provider);
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
        username: address,
        like: like,
      });
      setUsernameInput(address);
      setLikeCount(count);
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

  /* Connect to a MetaMask wallet */
  const connectToWallet = async () => {
    try {
      const { ethereum } = window;

      if (!ethereum) {
        alert("Please install MetaMask for this demo: https://metamask.io/");
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
      console.error(error);
    }
  };

  /* Write the user's username & like */
  const submitDataToPrivy = async () => {
    const [like, username] = await client.put(state?.userId, [
      {
        field: "username",
        value: usernameInput,
      },
      {
        field: "like",
        value: likeCount,
      },
    ]);
    setState({
      ...state,
      username: username.text(),
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
          <button onClick={connectToWallet}>Connect Wallet</button>
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
            you have 'liked' this post: {count} times
          </button>
        </div>
      )}
    </div>
  );
}

export default App;

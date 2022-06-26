import { useEffect, useState } from "react";
import "./App.css";

import { PrivyClient, SiweSession } from "@privy-io/privy-browser";

import "@rainbow-me/rainbowkit/styles.css";

import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { chain, configureChains, createClient, WagmiConfig } from "wagmi";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { publicProvider } from "wagmi/providers/public";
import { ConnectButton } from "@rainbow-me/rainbowkit";

import Logo from "./wellgorithm.svg";
import Lensfrens from "./lensfrens.png";
import Lenster from "./lenster.png";
import Iris from "./iris.png";
import Phaver from "./phaver.png";
import Alphs from "./alphs-finance.png";
import SelectCopy from "./select-copy.svg";

const { chains, provider } = configureChains(
  [chain.mainnet, chain.polygon, chain.optimism],
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

  const [metrics, setMetrics] = useState([
          {
            name: "Audio",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 1,
            actual: 0,
          },
          {
            name: "Text",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 3,
            actual: 3,
          },
          {
            name: "Video",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 2,
            actual: 2,
          },
          {
            name: "Photo",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 0,
            actual: 0,
          },
          {
            name: "Mixed Media",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 2,
            actual: 1,
          },
        ]);

  useEffect(() => {
    const result =document.getElementById("demo")
    console.log(result)
    result.innerHTML = ""
    radar.show("#demo", {
        size: 800,
        metrics,
      });
  }, [metrics])

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

  const handleClick = () => {
    const newMetrics = [
          {
            name: "Audio",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 1,
            actual: 0,
          },
          {
            name: "Text",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 1,
            actual: 1,
          },
          {
            name: "Video",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 2,
            actual: 2,
          },
          {
            name: "Photo",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 3,
            actual: 3,
          },
          {
            name: "Mixed Media",
            range: ["Value 0", "Value 1", "Value 2", "Value 3"],
            target: 2,
            actual: 1,
          },
        ];

        console.log('got here')

        setMetrics(newMetrics)
  }

  // A convenient shortening of a long address
  const placeholderName =
    state?.userId?.substring(0, 5) +
    "..." +
    state?.userId?.substring(state?.userId?.length - 4);

  return (
    <div style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              flexWrap: "nowrap",
              flexDirection: "row",
              marginLeft: 4,
            }}>
          <div class="App-header">
      <img class="App-logo" src={Logo} alt={placeholderName} height={70} />

      {!state?.userId ? (
        <div>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              flexWrap: "wrap",
              flexDirection: "column",
              marginLeft: 4,
            }}
          >
            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                flexWrap: "wrap",
                flexDirection: "column",
                marginLeft: 4,

                marginTop: 150,
              }}
            >
              <div style={{ marginBottom: 16 }}>
                <img src={SelectCopy} alt={placeholderName} width={420} />
              </div>
              <div>
                <img src={Lensfrens} width={90} height={80} />
                <img
                  src={Lenster}
                  width={90}
                  height={80}
                  onClick={() =>
                    window.open("http://localhost:4783/", "_blank")
                  }
                />
                <img
                  src={Iris}
                  width={90}
                  height={80}
                  onClick={() =>
                    window.open("http://localhost:4783/", "_blank")
                  }
                />
                <img src={Phaver} width={90} height={80} />
                <img src={Alphs} width={90} height={80} />
              </div>
            </div>
            {/* <h1> You're connected 💚</h1> */}

            <div
              style={{
                display: "flex",
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                alignContent: "center",
                flexWrap: "wrap",
                flexDirection: "column",
                marginTop: 16,
              }}
            >
              <ConnectButton />
            </div>

            {/* <div style={{ margin: 16 }}>
              <button
                type="button"
                style={{ backgroundColor: "#fa7f69", padding: 20 }}
              >
                View / Customize your algorithm
              </button>
            </div> */}
          </div>
        </div>
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
    <div onClick={handleClick} id="demo"></div>
    </div>

  );
}

export default App;

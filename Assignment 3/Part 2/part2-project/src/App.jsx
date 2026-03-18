import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "./contract";

function App() {
  const [account, setAccount] = useState(null);
  const [contractValue, setContractValue] = useState(null);

  useEffect(() => {
    if (!window.ethereum) return;

    let contract;

    const setupListener = async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();

      contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const value = await contract.value();
      setContractValue(value.toString());

      contract.on("ValueUpdated", (newValue) => {
        setContractValue(newValue.toString());
        console.log("Value updated:", newValue.toString());
      });
    };

    setupListener();

    return () => {
      if (contract) {
        contract.removeAllListeners("ValueUpdated");
      }
    };
  }, []);

  const connectWallet = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const accounts = await provider.send("eth_requestAccounts", []);
    setAccount(accounts[0]);
  };

  return (
    <div style={{ padding: "40px" }}>
      <button onClick={connectWallet}>Connect MetaMask</button>

      {account && <p>Account: {account}</p>}

      <h2>Counter Contract Value</h2>
      <p>{contractValue ?? "Loading..."}</p>
    </div>
  );
}

export default App;

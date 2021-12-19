import { useState } from "react";
import { ethers } from "ethers";
import "./App.css";
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

const greeterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

function App() {
  const [greeting, setGreetingValue] = useState('');

  async function requestAcount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
    //request account info from metamask account - will prompt user
  }

  //check if using metamask
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        console.log("data: ", data);
      } catch (err) {
        console.log("error", err);
      }
    }
  }

  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAcount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(greeting); //greeting user types in
      setGreetingValue("");
      await transaction.wait(); //in prod will take longer
      fetchGreeting(); //logs out new value
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        <button onClick={fetchGreeting}>Fetch Greeting</button>
        <button onClick={setGreeting}>Set Greeting</button>
        <input
          onChange={(e) => setGreetingValue(e.target.value)}
          placeholder="Set Greeting"
          value={greeting}
        />
      </header>
    </div>
  );
}

export default App;

import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Routes, Route } from "react-router-dom";
import Header from "./Header";
import CardsSection from "./CardsSection";
import CardDetail from "./CardDetail";
import { useSDK } from "@metamask/sdk-react";

const App = () => {
  const [account, setAccount] = useState<string>();
  const [balance, setBalance] = useState<string>();
  const [chainName, setChainName] = useState<string>();
  const { sdk, connected, chainId } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      console.warn("Failed to connect:", err);
    }
  };

  const fetchBalance = async () => {
    if (window.ethereum && account) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const balanceWei = await provider.getBalance(account);
      setBalance(ethers.formatEther(balanceWei));
    }
  };

  const fetchChainName = async () => {
    if (window.ethereum) {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      setChainName(network.name);
    }
  };

  useEffect(() => {
    if (connected) {
      fetchBalance();
      fetchChainName();
    }

    if (window.ethereum) {
      window.ethereum.on('chainChanged', () => {
        fetchChainName();
        fetchBalance();
      });

      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        setAccount(accounts[0]);
        fetchBalance();
      });
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('chainChanged', fetchChainName);
        window.ethereum.removeListener('accountsChanged', fetchBalance);
      }
    };
  }, [connected, account]);

  return (
    <>
      <Header
        account={account}
        balance={balance}
        chainName={chainName}
        connect={connect}
      />
      <Routes>
        <Route path="/" element={<CardsSection />} />
        <Route path="/card/:id" element={<CardDetail />} />
      </Routes>
    </>
  );
};

export default App;

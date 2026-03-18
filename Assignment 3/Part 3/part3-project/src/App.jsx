import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { TOKEN_ABI, TOKEN_ADDRESS } from "./token";
import { Card, Button, Input, Typography, Space, message } from "antd";
import { WalletOutlined, SendOutlined, CopyOutlined } from "@ant-design/icons";
import "./App.css";

const { Title, Text } = Typography;

function App() {
  const [token, setToken] = useState(null);
  const [account, setAccount] = useState("");
  const [balance, setBalance] = useState("0");
  const [decimals, setDecimals] = useState(18);
  const [loading, setLoading] = useState(false);
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");

  const connectWallet = async () => {
    try {
      setLoading(true);
      if (!window.ethereum) {
        message.error("Install MetaMask");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const address = await signer.getAddress();

      const contract = new ethers.Contract(TOKEN_ADDRESS, TOKEN_ABI, signer);
      const dec = await contract.decimals();

      setToken(contract);
      setAccount(address);
      setDecimals(dec);
      loadBalance(contract, address, dec);
      message.success("Connected");

    } catch (err) {
      message.error(err.code === 4001 ? "Rejected" : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const loadBalance = async (contract = token, addr = account, dec = decimals) => {
    if (!contract || !addr) return;
    try {
      const bal = await contract.balanceOf(addr);
      setBalance(ethers.formatUnits(bal, dec));
    } catch (err) {
      console.error(err);
    }
  };

  const transferTokens = async () => {
    if (!to || !amount || !token) return;
    
    try {
      setLoading(true);
      const tx = await token.transfer(to, ethers.parseUnits(amount, decimals));
      await tx.wait();
      
      message.success("Sent");
      setTo("");
      setAmount("");
      loadBalance();
    } catch (err) {
      message.error(err.code === "ACTION_REJECTED" ? "Rejected" : "Failed");
    } finally {
      setLoading(false);
    }
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(account);
    message.success("Copied");
  };

  useEffect(() => {
    if (!token || !account) return;

    loadBalance();

    const filter = token.filters.Transfer(null, null);
    const handler = (from, to) => {
      if ([from, to].some(a => a.toLowerCase() === account.toLowerCase())) {
        loadBalance();
      }
    };

    token.on(filter, handler);
    return () => token.removeAllListeners(filter);
  }, [token, account]);

  return (
    <div className="container">
      <Card className="card">
        <Title level={3} style={{ marginBottom: 24 }}>P3T Transfer</Title>
        
        {!account ? (
          <Button
            type="primary"
            size="large"
            icon={<WalletOutlined />}
            loading={loading}
            onClick={connectWallet}
            block
          >
            Connect Wallet
          </Button>
        ) : (
          <Space orientation="vertical" size="large" style={{ width: "100%" }}>
            <div className="account-section">
              <Text type="secondary" style={{ fontSize: 12 }}>Connected</Text>
              <div className="address-row">
                <Text code>
                  {`${account.slice(0, 6)}...${account.slice(-4)}`}
                </Text>
                <Button 
                  type="text" 
                  size="small" 
                  icon={<CopyOutlined />} 
                  onClick={copyAddress}
                />
              </div>
            </div>

            <div className="balance-section">
              <Text type="secondary" style={{ fontSize: 12 }}>Balance</Text>
              <Title level={2} style={{ margin: 0 }}>{balance}</Title>
            </div>

            <div className="transfer-section">
              <Text type="secondary" style={{ fontSize: 12, marginBottom: 8 }}>Transfer</Text>
              
              <Input
                placeholder="To address"
                value={to}
                onChange={(e) => setTo(e.target.value)}
                style={{ marginBottom: 12 }}
              />
              
              <Input
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={{ marginBottom: 16 }}
              />
              
              <Button
                type="primary"
                icon={<SendOutlined />}
                loading={loading}
                onClick={transferTokens}
                block
              >
                Send
              </Button>
            </div>
          </Space>
        )}
      </Card>
    </div>
  );
}

export default App;
import { useEffect, useState } from "react";
import { Layout, Card, Button, Input, List, Typography, Divider } from "antd";
import { ethers } from "ethers";
import { P4T_ABI } from "./abi/p4t";
import { P4NFT_ABI } from "./abi/p4nft";

const { Content } = Layout;
const { Text } = Typography;

const P4T_ADDRESS = "0xb6D418Eca3B7be12b4BEd84E3dd3F9c70A45e42a";
const P4NFT_ADDRESS = "0xa5F4f891290C306b634D475a7f56b9437A6c8b1E";

export default function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [account, setAccount] = useState(null);

  const [tokenInfo, setTokenInfo] = useState({});
  const [balance, setBalance] = useState("0");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [txHash, setTxHash] = useState("");

  const [ownedNFTs, setOwnedNFTs] = useState([]);

  useEffect(() => {
    connectWallet();
  }, []);

  async function connectWallet() {
    const prov = new ethers.BrowserProvider(window.ethereum);
    await prov.send("eth_requestAccounts", []);
    const signer = await prov.getSigner();
    const address = await signer.getAddress();

    setProvider(prov);
    setSigner(signer);
    setAccount(address);

    loadERC20(prov, address);
    loadNFTs(prov, address);
  }

  async function loadERC20(prov, address) {
    const contract = new ethers.Contract(P4T_ADDRESS, P4T_ABI, prov);
    const [name, symbol, decimals, bal] = await Promise.all([
      contract.name(),
      contract.symbol(),
      contract.decimals(),
      contract.balanceOf(address),
    ]);

    setTokenInfo({ name, symbol, decimals });
    setBalance(ethers.formatUnits(bal, decimals));
  }

  async function transferTokens() {
    const contract = new ethers.Contract(P4T_ADDRESS, P4T_ABI, signer);
    const value = ethers.parseUnits(amount, tokenInfo.decimals);
    const tx = await contract.transfer(to, value);
    setTxHash(tx.hash);
    await tx.wait();
    loadERC20(provider, account);
  }

  async function loadNFTs(prov, address) {
    const contract = new ethers.Contract(P4NFT_ADDRESS, P4NFT_ABI, prov);
    const total = await contract.tokenCounter();

    const owned = [];
    for (let i = 0; i < total; i++) {
      try {
        const owner = await contract.ownerOf(i);
        if (owner.toLowerCase() === address.toLowerCase()) {
          const uri = await contract.tokenURI(i);
          owned.push({ id: i, cid: uri });
        }
      } catch {}
    }
    setOwnedNFTs(owned);
  }

  return (
    <Layout style={{ minHeight: "100vh", padding: 24 }}>
      <Content style={{ display: "flex", gap: 24 }}>
        
        <Card title="P4T (ERC-20)" style={{ flex: 1 }}>
          <p>Wallet: {account}</p>
          <p>Balance: {balance}</p>

          <Divider />
          <Input
            placeholder="Recipient address"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
          <Input
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{ marginTop: 8 }}
          />
          <Button type="primary" onClick={transferTokens} style={{ marginTop: 8 }}>
            Transfer
          </Button>

          {txHash && (
            <p style={{ marginTop: 8 }}>
              Tx Hash: <Text code>{txHash}</Text>
            </p>
          )}
        </Card>

        <Card title="P4NFT (ERC-721)" style={{ flex: 1 }}>
          <p>Owned NFTs: {ownedNFTs.length}</p>

          <List
            bordered
            dataSource={ownedNFTs}
            renderItem={(item) => (
              <List.Item>
                <div>
                  <p>Token ID: {item.id}</p>
                  <p>CID: {item.cid}</p>
                  <a
                    href={`https://ipfs.io/ipfs/${item.cid}`}
                    target="_blank"
                    rel="noreferrer"
                  >
                    View Metadata
                  </a>
                </div>
              </List.Item>
            )}
          />
        </Card>

      </Content>
    </Layout>
  );
}

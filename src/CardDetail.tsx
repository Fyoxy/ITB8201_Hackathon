import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, Button, CardMedia, Paper, CircularProgress, LinearProgress, TextField } from '@mui/material';
import { ethers } from 'ethers';

// Static cards data (with file hashes and ETH addresses)
const cards = [
  { 
    id: 1,
    title: 'Eesti heategevusfond', 
    description: 'Fond palub annetusi arve tasumiseks, mis katab toimetulekuraskustes peredele toidu ja eluasemetoetusi kogusummas 5000 eurot.', 
    image: '/vravi.png',
    ethAddress: '0xEd916A368A03305453f35D365Cf27AA7A54787D6', // Static ETH address
    fileHash: '0xabc123xyz456defa4t0ghijk', // Static file hash
  },
  { 
    id: 2,
    title: 'Loomakaitse fond', 
    description: 'Fond palub annetusi, et katta veterinaarteenuste ja ravimite arve, mille kogusumma on 2500 eurot, et päästa ja ravida loomad, kes on kannatanud väärkohtlemise tõttu.', 
    image: '/vloom.png',
    ethAddress: '0xEd916A368A03305453f35D365Cf27AA7A54787D6', // Static ETH address
    fileHash: '0xdef7890xyz123abc456ghijk', // Static file hash
  },
  { 
    id: 3,
    title: 'Punane rist', 
    description: 'Fond küsib annetusi meditsiiniliste vahendite hankimiseks kogusummas 8250 eurot, et aidata kriisiolukordades, nagu sõjad ja looduskatastroofid, vajaliku arstiabi ja ravimitootega inimesi.', 
    image: '/prist.png',
    ethAddress: '0xEd916A368A03305453f35D365Cf27AA7A54787D6', // Static ETH address
    fileHash: '0xghi123xyz789a0xghi123xyz789abc456debc456defgh', // Static file hash
  },
];

const contractABI = [
  {
    "constant": true,
    "inputs": [{"name": "fileHash", "type": "string"}],
    "name": "stringAllowance",
    "outputs": [{"name": "", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"name": "identifier", "type": "string"},
      {"name": "to", "type": "address"}
    ],
    "name": "depositETH",
    "outputs": [],
    "payable": true,
    "stateMutability": "payable",
    "type": "function"
  },
];

//const contractAddress = '0x994F88F36f36D6F134EFD2e9afa5472F6e5D9565'; // The smart contract address

const contractAddress = '0x28cF8e408ADA3eF04A993718d444cd071F00B541'; // The smart contract address


const CardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false); // State to handle loading state of transaction
  const [balance, setBalance] = useState<number>(0); // Smart contract balance (from stringAllowance)
  const [userAmount, setUserAmount] = useState<string>(''); // User input amount
  const [requestedAmount] = useState(0.0001); // Requested amount in Sepolia ETH

  const card = cards.find((c) => c.id === parseInt(id || '', 10));

  // Fetch the smart contract allowance when the card changes
  useEffect(() => {
    const fetchAllowance = async () => {
      if (!window.ethereum) {
        alert("MetaMask is not installed");
        return;
      }

      try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const contract = new ethers.Contract(contractAddress, contractABI, provider);
        
        // Fetch the allowance based on the file hash
        const allowance = await contract.stringAllowance(card?.fileHash || '');
        // Convert the allowance to a number and set it in the state
        setBalance(parseFloat(ethers.formatEther(allowance))); // Convert the string to a number before setting
      } catch (error) {
        console.error("Failed to fetch allowance:", error);
        alert("Failed to fetch allowance.");
      }
    };

    if (card) {
      fetchAllowance();
    }
  }, [card]); // Re-run when the card changes (user navigates to a different card)

  // Calculate the remaining amount to pay
  const remainingAmount = Math.max(requestedAmount - balance, 0); // Ensure we don't end up with a negative value

  const handlePayment = async () => {
    if (!window.ethereum) {
      alert("MetaMask is not installed");
      return;
    }
  
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
  
      // Validate if the user input is a valid number and not exceeding the remaining balance
      const amountToSend = parseFloat(userAmount);
      if (isNaN(amountToSend) || amountToSend <= 0) {
        alert("Please enter a valid amount.");
        return;
      }
  
      // Manually convert the input ETH to Wei (18 decimals)
      const amountInWei = (amountToSend * 1e18).toString(); // This gives the value in Wei as a string
  
      // Log the amount in ETH and Wei before sending
      console.log("Amount to send (ETH):", amountToSend);  // ETH amount
      console.log("Amount to send (Wei):", amountInWei);   // Wei value
  
      // Get the identifier for the current card (assuming you have this from your cards data)
      const identifier = card?.fileHash;  // Use the card's id as the identifier
  
      if (!identifier) {
        alert("No identifier available for this card.");
        return;
      }
  
      // Log the identifier that is being sent to the contract
      console.log("Identifier being sent to contract:", identifier);
  
      // Ensure the 'to' address is correct
      const toAddress = card?.ethAddress;
      if (!ethers.isAddress(toAddress)) {
        alert("Invalid 'to' address.");
        return;
      }
      console.log("To address:", toAddress);
  
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // **Encode the function parameters properly**
      const data = contract.interface.encodeFunctionData("depositETH", [identifier, toAddress]);
  
      // Log the encoded data
      console.log("Encoded function data:", data);
  
      // **Increase the gas limit here** (adjusted gas limit to 25000 or 30000)
      const gasLimit = 3000000; // Try increasing this to 30000 or more if necessary
      console.log("Gas limit:", gasLimit);
  
      // Log chain ID (use Sepolia test network chain ID)
      const chainId = 11155111;
      console.log("Chain ID:", chainId);
  
      // Define the transaction details (sending to contract)
      const transaction = {
        to: contractAddress,
        data: data, // This contains the encoded function data (including identifier and to address)
        value: amountInWei, // Use the manually calculated Wei value to send Ether
        gasLimit: gasLimit, // Adjust if needed
        chainId: chainId, // Sepolia test network
      };
  
      // Log the entire transaction object
      console.log("Full Transaction Object:", transaction);
  
      setLoading(true);
      const txResponse = await signer.sendTransaction(transaction);
      await txResponse.wait();
      setLoading(false);
      alert("Transaction successful!");
    } catch (error) {
      setLoading(false);
      console.error("Transaction failed", error);
      alert("Transaction failed: " + error);
    }
  };
  
  if (!card) return <Typography>Card not found</Typography>;

  return (
    <Box 
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        padding: 4,
      }}
    >

      <CardMedia
        component="img"
        image={card.image}
        alt={card.title}
        sx={{
            width: 400,
            height: 400,
            objectFit: 'cover',
            marginTop: 60,
        }}
      />
      
      <Typography variant="h4" gutterBottom>
        {card.title}
      </Typography>
      
      <Typography variant="body1" paragraph sx={{ maxWidth: 600 }}>
        {card.description}
      </Typography>

      <Paper sx={{ padding: 2, marginBottom: 2, maxWidth: 600 }}>
                <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Arve
        </Typography>
  <CardMedia
    component="img"
    image="/prist_arve.png" // Assuming the image is in the public folder
    alt="ETH Wallet"
    sx={{
      width: '100%',       // Make the image take the full width of the container
      height: 500,         // Set the height as desired (adjust to fit your design)
      objectFit: 'contain' // Ensure the image maintains its aspect ratio within the container
    }}
  />
</Paper>



      <Paper sx={{ padding: 2, marginBottom: 2, maxWidth: 600 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          ETH Wallet Address
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {card.ethAddress}
        </Typography>
      </Paper>

      <Paper sx={{ padding: 2, marginBottom: 2, maxWidth: 600 }}>
        <Typography variant="h6" sx={{ marginBottom: 1 }}>
          Arve kood
        </Typography>
        <Typography variant="body2" color="textSecondary">
          {card.fileHash}
        </Typography>
      </Paper>

      {/* Progress Bar showing contract allowance coverage */}
      <Box sx={{ width: '100%', maxWidth: 600, marginTop: 3 }}>
        <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 1 }}>
          Contract Allowance: {balance.toFixed(8)} ETH
        </Typography>
        <Typography variant="body2" sx={{ marginBottom: 1 }}>
          Requested Amount: 0.0001 SepoliaETH
        </Typography>
        <LinearProgress 
          variant="determinate"
          value={(balance / requestedAmount) * 100} 
          sx={{
              height: 10,
              borderRadius: 5,
              backgroundColor: 'rgba(0, 0, 0, 0.1)',
              '& .MuiLinearProgress-bar': {
                  backgroundColor: (balance >= requestedAmount) ? 'green' : 'red',
                },
            }}
        />
        <Typography variant="body2" color="textSecondary" sx={{ marginTop: 1 }}>
          {((balance / requestedAmount) * 100).toFixed(0)}% of the requested balance is covered by the contract allowance.
        </Typography>
      </Box>

      {/* Input Field for User Amount */}
      <TextField
        label="Amount to Pay (ETH)"
        value={userAmount}
        onChange={(e) => setUserAmount(e.target.value)}
        type="number"
        fullWidth
        variant="outlined"
        margin="normal"
        inputProps={{ step: "0.00000001", min: "0.00000001" }}
        helperText={`Max amount: ${requestedAmount.toFixed(4)} ETH`}
        sx={{ width: 250 }}  // Set a fixed width in pixels (adjust as needed)
      />

      <Button
        variant="contained"
        color="primary"
        onClick={handlePayment}
        disabled={loading || parseFloat(userAmount) <= 0}
        sx={{ marginTop: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : 'Toeta'}
      </Button>

    {/* Back Button */}
    <Button 
        variant="outlined" 
        color="primary" 
        onClick={() => navigate(-1)} // Go back to the previous page
        sx={{ marginTop: 3 }}
    >
        Back
    </Button>
    </Box>
  );
};

export default CardDetail;

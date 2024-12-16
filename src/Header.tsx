import React from 'react';
import { AppBar, Toolbar, Typography, Box, Button } from '@mui/material';
import { useSDK } from "@metamask/sdk-react";

const Header = ({ account, balance, chainName, connect }: any) => {
  return (
    <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
        Läibepaistev heategevus plokiahela tehnoloogiaga
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {account ? (
            <>
              <Typography variant="body1">Account: {account}</Typography>
              <Typography variant="body1">Balance: {balance} ETH</Typography>
              <Typography variant="body1">Network: {chainName}</Typography>
            </>
          ) : (
            <Button color="inherit" onClick={connect}>
              Connect Wallet
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;

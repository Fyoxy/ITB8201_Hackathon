# Charity Transparency Platform (Hackathon Demo)

**This project is for demonstration purposes only. No copyright infringement is intended for any images or names of charities used in this example project.**

---

## Overview

This project was developed during the ITB8201 Nutilepingud ja DeFi plokiahelas (2024) / **Smart Contract and DeFi Blockchain Hackathon** by a team of 5 people. Our goal was to create a fully transparent system for funding charities using blockchain technology.

### Project Proposal

The idea was to:
1. Allow charities to upload invoices to the platform.
2. Enable individuals to pay for these invoices directly using cryptocurrencies (ETH in this case).
3. Develop a secondary feature where users could deposit funds into a "charity bank," distributing the funds among selected charities.

While the frontend focuses on the first feature (paying invoices directly), the backend includes draft code for the second feature, allowing for distribution of funds between multiple charities.

---

## Key Features

- **Smart Contracts**: 
  - The main contract allows users to pay for charity invoices using a unique invoice identifier (hash) and specifies the wallet address for withdrawal.
  - A second contract, `heategevus.sol`, provides functionality for depositing funds and distributing them to selected charities.

- **Frontend**: Built with **React** to enable a quick user-friendly interface for managing charity invoices.

- **Blockchain Network**: Backend is powered by Ethereum Sepolia Testnet.

- **Demo Smart Contract**: [Sepolia Etherscan Link](https://sepolia.etherscan.io/address/0x28cF8e408ADA3eF04A993718d444cd071F00B541#code)

---

## Technology Stack

- **Frontend**: React.js / Metamask
- **Blockchain**: Ethereum (Sepolia Testnet)
- **Smart Contract Language**: Solidity

---

## Getting Started

To set up and run the project locally:

1. **Clone the repository**  
   Open a terminal and run:  
   ```bash
   git clone <repository-url>
   cd <repository-folder>
   ```

2. **Install dependencies**  
   Run the following command:  
   ```bash
   yarn install
   ```

3. **Run the development server**  
   Start the application by running:  
   ```bash
   yarn start
   ```

4. **Environment Configuration**  
   Create a `.env` file in the project root and add the following variable:  
   ```
   REACT_APP_INFURA_API_KEY=xxx
   ```
   *Note: Based on usage statistics, this project does not send requests to Infura, but this configuration is included as a precaution.*

---

## Files and Contracts

- **Frontend Logic**: Implemented for direct invoice payment functionality.
- **Smart Contracts**:
  - `Main Contract`: Handles invoice payments.
  - `heategevus.sol`: Implements the charity bank and fund distribution logic.

---

## Acknowledgements

We extend our gratitude to the **hackathon hosts** for organizing an incredible event and providing a platform for creativity and collaboration. A special thanks for the **pizza** that fueled us during the ~18-hour hackathon (minus 8 hours of sleep 😴).  

Finally, a big shoutout to my teammates for their contributions and innovative ideas that made this project possible!

---

**Disclaimer**: This project is a proof-of-concept developed under tight time constraints. It is not intended for production use. Contributions are welcome for further development or refinement!

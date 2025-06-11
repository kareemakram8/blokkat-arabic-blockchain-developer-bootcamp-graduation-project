# DonationPlatform - Decentralized Charity DApp

A beautiful, production-ready decentralized donation platform built with Next.js and Ethereum smart contracts.

## Features

- 🔗 **Wallet Integration**: Connect with MetaMask and other Web3 wallets
- 💝 **Create Causes**: Users can create fundraising causes with target amounts
- 💰 **Donate**: Make donations directly to causes with ETH
- 📊 **Progress Tracking**: Visual progress bars showing fundraising goals
- 🏦 **Withdraw Funds**: Cause owners can withdraw collected donations
- 🔒 **Security**: Built with security best practices and reentrancy protection
- 🌙 **Dark Mode**: Beautiful light and dark theme support
- 📱 **Responsive**: Works perfectly on desktop and mobile devices

## Smart Contract Features

- **Transparent Donations**: All transactions recorded on blockchain
- **Minimum Donation**: 0.001 ETH minimum to prevent spam
- **Cause Limits**: Maximum 5 active causes per address
- **Owner Controls**: Withdraw funds and deactivate causes
- **Donation History**: Track all donations and donors
- **Security**: ReentrancyGuard and access control

## Getting Started

### Prerequisites

- Node.js 16+ and npm
- MetaMask or compatible Web3 wallet
- Ethereum testnet ETH for testing

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd donation-platform
```

2. Install dependencies:
```bash
npm install
```

3. Update the contract address in `contexts/wallet-context.tsx`:
```typescript
const CONTRACT_ADDRESS = "YOUR_DEPLOYED_CONTRACT_ADDRESS";
```

4. Start the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Smart Contract Deployment

1. Deploy the `DonationPlatform.sol` contract to your preferred Ethereum network
2. Update the `CONTRACT_ADDRESS` in the wallet context
3. Ensure your MetaMask is connected to the same network

## Usage

### For Donors

1. **Connect Wallet**: Click "Connect Wallet" to connect your MetaMask
2. **Browse Causes**: View all active fundraising causes
3. **Make Donations**: Enter amount and click "Donate" (minimum 0.001 ETH)
4. **Track Progress**: See real-time progress towards funding goals

### For Cause Creators

1. **Connect Wallet**: Ensure your wallet is connected
2. **Create Cause**: Click "Create Cause" and fill in details
3. **Set Target**: Define your fundraising goal in ETH
4. **Manage Funds**: Withdraw collected donations anytime
5. **Deactivate**: Close your cause when complete

## Technology Stack

- **Frontend**: Next.js 13, React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui components
- **Blockchain**: Ethereum, ethers.js
- **Smart Contract**: Solidity 0.8.19, OpenZeppelin

## Smart Contract Functions

### Public Functions

- `createCause(title, description, targetAmount)` - Create a new cause
- `donateToCause(causeId)` - Donate ETH to a cause
- `withdrawFunds(causeId)` - Withdraw funds (owner only)
- `deactivateCause(causeId)` - Deactivate cause (owner only)

### View Functions

- `causes(causeId)` - Get cause details
- `getDonationHistory(causeId)` - Get donation history
- `getCurrentCauseId()` - Get next cause ID
- `getCauseStatus(causeId)` - Check if cause exists and is active

## Security Features

- **ReentrancyGuard**: Prevents reentrancy attacks
- **Access Control**: Owner-only functions protected
- **Input Validation**: All inputs validated on-chain
- **Checks-Effects-Interactions**: Secure withdrawal pattern

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the smart contract code

---

Built with ❤️ for the decentralized future of charity and social impact.
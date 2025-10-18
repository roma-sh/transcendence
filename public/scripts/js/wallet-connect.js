class WalletConnect {
    constructor() {
        // Explicit MetaMask EIP-1193 provider (ignores Core/others)
        this.ethereum = null;
        this.currentWallet = {
            address: '',
            network: '',
            balance: '',
            isConnected: false
        };
        // Avalanche Fuji Testnet configuration
        this.avalancheConfig = {
            chainId: '0xA869',
            chainName: 'Avalanche Fuji Testnet',
            nativeCurrency: {
                name: 'Avalanche',
                symbol: 'AVAX',
                decimals: 18
            },
            rpcUrls: ['https://api.avax-test.network/ext/bc/C/rpc'],
            blockExplorerUrls: ['https://testnet.snowtrace.io/']
        };
        this.ethereum = this.getMetaMaskProvider();
        this.checkWalletConnection();
    }
    // Check if wallet was previously connected
    checkWalletConnection() {
        const savedWallet = localStorage.getItem('walletInfo');
        if (savedWallet) {
            this.currentWallet = JSON.parse(savedWallet);
            if (this.currentWallet.isConnected) {
                this.updateUI();
            }
        }
    }
    // Pick MetaMask provider if multiple wallets inject providers
    getMetaMaskProvider() {
        const eth = window.ethereum;
        if (!eth)
            return null;
        if (Array.isArray(eth.providers)) {
            // Brave and multi-injectors expose an array
            const metamask = eth.providers.find((p) => p && p.isMetaMask);
            return metamask || null;
        }
        return eth.isMetaMask ? eth : null;
    }
    // Connect to MetaMask
    async connectWallet() {
        try {
            if (!this.ethereum) {
                alert('MetaMask not detected. Please install/enable MetaMask and try again.');
                return false;
            }
            // Request account access
            const accounts = await this.ethereum.request({
                method: 'eth_requestAccounts'
            });
            if (accounts.length === 0) {
                throw new Error('No accounts found');
            }
            // Switch to Avalanche Fuji testnet
            await this.switchToAvalancheNetwork();
            // Get wallet info
            const address = accounts[0];
            const network = await this.getNetwork();
            const balance = await this.getBalance(address);
            this.currentWallet = {
                address,
                network,
                balance,
                isConnected: true
            };
            // Save to localStorage
            localStorage.setItem('walletInfo', JSON.stringify(this.currentWallet));
            this.updateUI();
            return true;
        }
        catch (error) {
            console.error('Error connecting wallet:', error);
            alert('Failed to connect wallet: ' + error.message);
            return false;
        }
    }
    // Switch to Avalanche Fuji network
    async switchToAvalancheNetwork() {
        try {
            await this.ethereum.request({
                method: 'wallet_switchEthereumChain',
                params: [{ chainId: this.avalancheConfig.chainId }],
            });
        }
        catch (switchError) {
            // This error code indicates that the chain has not been added to MetaMask
            if (switchError.code === 4902) {
                try {
                    await this.ethereum.request({
                        method: 'wallet_addEthereumChain',
                        params: [this.avalancheConfig],
                    });
                }
                catch (addError) {
                    throw new Error('Failed to add Avalanche network to MetaMask');
                }
            }
            else {
                throw new Error('Failed to switch to Avalanche network');
            }
        }
    }
    // Get current network
    async getNetwork() {
        try {
            if (!this.ethereum)
                return 'Unknown Network';
            const chainId = await this.ethereum.request({
                method: 'eth_chainId'
            });
            switch (chainId) {
                case '0xA869': return 'Avalanche Fuji Testnet';
                case '0xA86A': return 'Avalanche Mainnet';
                default: return `Unknown Network (${chainId})`;
            }
        }
        catch (error) {
            return 'Unknown Network';
        }
    }
    // Get balance in AVAX
    async getBalance(address) {
        try {
            if (!this.ethereum)
                return '0 AVAX';
            const balance = await this.ethereum.request({
                method: 'eth_getBalance',
                params: [address, 'latest']
            });
            // Convert from wei to AVAX (1 AVAX = 10^18 wei)
            const balanceInAVAX = parseInt(balance, 16) / 1e18;
            return balanceInAVAX.toFixed(4) + ' AVAX';
        }
        catch (error) {
            return '0 AVAX';
        }
    }
    // Disconnect wallet
    disconnectWallet() {
        this.currentWallet = {
            address: '',
            network: '',
            balance: '',
            isConnected: false
        };
        localStorage.removeItem('walletInfo');
        this.updateUI();
    }
    // Update UI with wallet info
    updateUI() {
        const connectButton = document.querySelector('.js-connect-wallet-button');
        const walletAddressSpan = document.getElementById('wallet-address');
        const walletNetworkSpan = document.getElementById('wallet-network');
        const walletBalanceSpan = document.getElementById('wallet-balance');
        if (this.currentWallet.isConnected) {
            // Update connect button text
            if (connectButton) {
                connectButton.textContent = 'CONNECTED';
                connectButton.style.backgroundColor = '#4CAF50';
            }
            // Update wallet info page
            if (walletAddressSpan)
                walletAddressSpan.textContent = this.formatAddress(this.currentWallet.address);
            if (walletNetworkSpan)
                walletNetworkSpan.textContent = this.currentWallet.network;
            if (walletBalanceSpan)
                walletBalanceSpan.textContent = this.currentWallet.balance;
        }
        else {
            // Reset connect button
            if (connectButton) {
                connectButton.textContent = 'CONNECT WALLET';
                connectButton.style.backgroundColor = '';
            }
        }
    }
    // Format address for display
    formatAddress(address) {
        return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
    }
    // Get current wallet info
    getWalletInfo() {
        return this.currentWallet;
    }
    // Listen for account changes
    setupEventListeners() {
        if (this.ethereum) {
            this.ethereum.on('accountsChanged', (accounts) => {
                if (accounts.length === 0) {
                    this.disconnectWallet();
                }
                else {
                    this.connectWallet();
                }
            });
            this.ethereum.on('chainChanged', () => {
                window.location.reload();
            });
        }
    }
}
// Create and export wallet instance
export const wallet = new WalletConnect();
// Initialize wallet connection
export function initWalletConnect() {
    const connectButton = document.querySelector('.js-connect-wallet-button');
    const disconnectButton = document.querySelector('.js-disconnect-wallet');
    const backButton = document.querySelector('.js-back-to-welcome');
    if (connectButton) {
        connectButton.addEventListener('click', async () => {
            const connected = await wallet.connectWallet();
            if (connected) {
                location.hash = '#wallet-info-page';
            }
        });
    }
    if (disconnectButton) {
        disconnectButton.addEventListener('click', () => {
            wallet.disconnectWallet();
            location.hash = '#welcome-page';
        });
    }
    if (backButton) {
        backButton.addEventListener('click', () => {
            location.hash = '#welcome-page';
        });
    }
    // Setup event listeners for account/network changes
    wallet.setupEventListeners();
}

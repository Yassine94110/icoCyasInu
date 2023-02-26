import './App.css';
import React from 'react';
import { ethers } from 'ethers';
import Contract from './artifacts/contracts/IcoForCyasInu.sol/IcoForCyasInu.json';
import { WagmiConfig, createClient } from 'wagmi'
import Profile from './Profile';
import { getDefaultProvider } from 'ethers'


const client = createClient({
    autoConnect: true,
    provider: getDefaultProvider(),
})



const contractAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512"

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentAccount: "0x00000000000000000000",
            contract: null,
            provider: null,
            hardcap: 0,
            tokenAmount: 0,
            balancesToken: 0
        };
    }
    async componentDidMount() {
        await this.requestAccountAndDatas();
    }

    requestAccountAndDatas = async () => {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        if (accounts.length !== 0) {
            this.setState({ currentAccount: accounts[0] });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            const contract = new ethers.Contract(contractAddress, Contract.abi, signer);
            this.setState({ contract: contract, provider: provider }, () => { this.requestDatas() });
        }
    }

    requestDatas = async () => {
        const hardcap = await this.state.contract.hardCap();
        const tokenAmount = await this.state.contract.tokenAmount();
        const balancesToken = await this.state.contract.getBalanceToken();
        this.setState({ hardcap: ethers.utils.formatEther(hardcap), tokenAmount: ethers.utils.formatEther(tokenAmount), balancesToken: ethers.utils.formatEther(balancesToken) });
    }

    buyTokens = async (amount) => {
        const data = await this.state.contract.buyTokens({ value: ethers.utils.parseEther(amount) });
        this.state.provider.once(data.hash, (transaction) => {
            this.requestDatas();
        })
    }

    withdrawTokens = async () => {
        await this.state.contract.withdrawTokens();
    }

    render() {
        return (
            <div className="App mx-20 my-10">
                <WagmiConfig client={client}>
                    <Profile />
                </WagmiConfig>

                <p className="text-base text-white">
                    Vous avez : {this.state.balancesToken} $CYAS
                </p>
                <h2 className="text-2xl text-white my-2">$CYAS pour seulement 0.00001 ETH seulement {this.state.hardcap - this.state.tokenAmount} restant   :</h2>
                <div className='flex justify-between'> <button type="button"
                    onClick={() => this.buyTokens("0.05")}
                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    5000 $CYAS pour 0.05 ETH
                </button>

                    <button type="button"
                        onClick={() => this.buyTokens("0.1")}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        10000 $CYAS pour 0.1 ETH
                    </button>

                    <button type="button"
                        onClick={() => this.buyTokens("0.25")}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        25000 $CYAS pour 0.25 ETH
                    </button>

                    <button type="button"
                        onClick={() => this.buyTokens("0.5")}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        50000 $CYAS pour 0.5 ETH
                    </button>
                    <button type="button"
                        onClick={() => this.buyTokens("1")}
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                        100000 $CYAS pour 1 ETH
                    </button>
                </div>
                <div className="flex justify-between mb-1">
                    <span className="text-base font-medium text-blue-700 dark:text-white">{this.state.tokenAmount} $CYAS</span>
                    <span className="text-sm font-medium text-blue-700 dark:text-white">Max : {this.state.hardcap}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                    <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: (this.state.tokenAmount * 100 / this.state.hardcap) + "%" }}></div>
                </div>
                <button type="button"
                    onClick={() => this.withdrawTokens()}
                    className="mt-4 text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                    Claim $CYAS
                </button>
            </div>
        );
    }
}

export default App;

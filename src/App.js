import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

// Refer to the README doc for more information about using API
// keys in client-side code. You should never do this in production
// level code.
const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};


// In this week's lessons we used ethers.js. Here we are using the
// Alchemy SDK is an umbrella library with several different packages.
//
// You can read more about the packages here:
//   https://docs.alchemy.com/reference/alchemy-sdk-api-surface-overview#api-surface
const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [finalBlocksState, setFinalBlockState] = useState({
    finalBlocks: [],
    selected: null,
  });
  const [moreInfoSelectedBlock, setMoreInfoSelectedBlock] = useState();
  const [showTransaction, setShowTransaction] = useState();
  const [totalBalance, setTotalBalance] = useState(0);

  const handleSelectBlock = async (block) => {
    let moreInfoAboutBlock = await alchemy.core.getBlockWithTransactions(block);
    setMoreInfoSelectedBlock(moreInfoAboutBlock);
    setFinalBlockState({ ...finalBlocksState, selected: block });
  };

  const handleGetBalance = async (e) => {
    e.preventDefault();
    try {
      let getBalance = await alchemy.core.getBalance(
        e.target[0].value,
        "latest"
      );
      setTotalBalance(Utils.formatUnits(getBalance));
    } catch (error) {
      console.log(error);
      setTotalBalance(0);
      alert("Wrong address!!");
    }
    console.log(e.target[0].value);
  };

  useEffect(() => {
    async function getBlockNumber() {
      let lastBlockNumber = await alchemy.core.getBlockNumber();
      setBlockNumber(lastBlockNumber);
      let arr = [];
      for (let i = lastBlockNumber; i >= lastBlockNumber - 6; i--) {
        arr.push(i);
      }
      setFinalBlockState({ ...finalBlocksState, finalBlocks: arr });
    }

    getBlockNumber();
  });

  return (<div className="App">Block Number: {blockNumber}</div>);
}

export default App;

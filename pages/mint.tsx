import { useWeb3React } from '@web3-react/core';
import type { NextPage } from 'next'
import Image from 'next/image'
import { useState, useEffect } from 'react';
import { bossAbi, bossAddress } from '../config';
import { ethers } from "ethers";
import { injected, networks } from '../connectors';
import { UserRejectedRequestError } from '@web3-react/injected-connector';

const imageUrlBoss = "https://spacebank.mypinata.cloud/ipfs/QmchGvzW47SMNL7NFn4tEdN1Cjc2ymHGtx8CJk3sSDtR7s/images/$id.png";

const Mint: NextPage = ({ }): any => {
  const web3 = useWeb3React();
  web3.active
    ? console.log("You are connected to Space Bank developed by @0xNaut via", web3.account)
    : console.log("Web3 not connected");

  const [tokensLeftBoss, setTokensLeftBoss]: any = useState();

  const [bossImg, setBossImg]: any = useState();

  const loadContractData = async () => {
    try {
      let bossContract = new ethers.Contract(
        bossAddress,
        bossAbi,
        web3.library.getSigner(web3.account)
      );

      let totalBossSupply = await bossContract.totalSupply();
      setTokensLeftBoss(5000 - totalBossSupply.toNumber());
      console.log("Currently ", tokensLeftBoss, " NFTs Remaining");
      if (tokensLeftBoss === 0) setTxStateBoss('SOLDOUT');

    } catch (err) {
      console.error(err);
    }
  };

  const [txStateBoss, setTxStateBoss]: any = useState('MINT');
  // const [nftImg, setNftImg]: any = useState();

  const mintMobBossNft = async ({ }: any) => {
    try {
      let contract = new ethers.Contract(
        bossAddress,
        bossAbi,
        web3.library.getSigner(web3.account)
      );
      console.log(contract);

      let tx = await contract.mint(web3.account, 1, { value: ethers.utils.parseEther("3000") });
      console.log(tx)
      setTxStateBoss('PENDING...');
      let t = await tx.wait();
      setTxStateBoss('COMPLETE!');
      let tokenId = t.events[0].args["tokenId"].toNumber();
      let nftImg = imageUrlBoss.replace("$id", tokenId);
      setBossImg(nftImg)

    } catch (err: any) {
      console.error(err.message);
    }
  };

  const [nftId, setNftId]: any = useState();

  const handleMintMobBoss = async (e: any) => {
    e.preventDefault();
    await mintMobBossNft({});
  };

  useEffect(() => {
    loadContractData();
  }, [mintMobBossNft]);

  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (web3.active || web3.error) {
      setConnecting(false);
    }
  }, [web3.active, web3.error]);

  if (web3.error) return null;

  return (
    <div className="z-50 flex flex-col items-center justify-center h-full w-screen bg-[#e3e3e3] py-36">

      <div className="z-10 flex flex-col pl-12 sm:pl-36 md:pl-48 w-full text-left space-y-4">
        <div className="h-0.5 bg-white w-full rounded-full" />
        <div className='flex-col justify-center items-center w-full'>
          <p className="text-white font-saira-b text-4xl sm:text-5xl flex text-left w-full">
            MINT YOUR SPACE CREW!
          </p>
        </div>
      </div>

      <div className='z-10 flex flex-wrap gap-12 sm:gap-24 md:gap-36 lg:gap-48 xl:gap-64
      items-center justify-center mt-16'>
       
        <div className='flex-col bg-[#e3e3e3] items-center w-72 p-3 space-y-4
        shadow-lg shadow-primary/60'>
          <div className='flex w-full justify-between text-black text-xl'>
            <span className='font-saira-sb text-2xl'>MOB BOSS</span>
            <span>{tokensLeftBoss}/5000</span>
          </div>

          <div className='h-[247px] bg-slate-800'>
          {bossImg !== undefined ?
            <Image
              src={bossImg}
              height={1}
              width={1}
              layout="responsive"
              className="shadow-md shadow-primary/75"
            />
            :
            <Image
              src='/mobboss_gif.gif'
              height={1}
              width={1}
              layout="responsive"
              className="shadow-md shadow-primary/75"
            />}
          </div>

          <div className='flex w-full justify-between text-black text-base'>
            <span>MINT PRICE</span>
            <span className='font-saira-m'>3000 $ONE</span>
          </div>

          {typeof web3.account === "string" ? (
             <>
             {web3.chainId !== 1666600000 ? (
               <button onClick={changeToHarmonyOneMainnet}
               className='bg-gradient-to-r from-[#F03A47] to-[#CE653B] flex w-full py-4 items-center text-2xl justify-center
               transition-all hover:scale-105 duration-300 ease-in-out hover:shadow-primary/60 hover:shadow-md'>
                 SWITCH NETWORK
               </button>
             ) : (
              <button onClick={handleMintMobBoss}
              className='bg-gradient-to-r from-[#F03A47] to-[#CE653B] flex w-full py-4 items-center text-2xl justify-center
              transition-all hover:scale-105 duration-300 ease-in-out hover:shadow-primary/60 hover:shadow-md'>
                {txStateBoss}
              </button>
             )}
             </>): 
             <>
              <button onClick={() => {
                web3.activate(injected, undefined, true).catch((error) => {
                  // ignore the error if it's a user rejected request
                  if (error instanceof UserRejectedRequestError) {
                    console.log(
                      "Connecting Web3 to Space Bank developed by @0xNaut"
                    )
                  } else {
                    console.log(web3)
                    console.error(
                      "Please use a Web3-enabled browser like Chrome or Brave."
                    );
                  }
                });
              }}
              className='bg-gradient-to-r from-[#F03A47] to-[#CE653B] flex w-full py-4 items-center text-2xl justify-center
              transition-all hover:scale-105 duration-300 ease-in-out hover:shadow-primary/60 hover:shadow-md'>
                CONNECT
              </button>
             </>}
        </div>

      </div>

      {/* Background */}
      <div className="z-0">
        <Image src='/bg_02.png' layout="fill" />
      </div>

    </div>
  )
}

export default Mint

export const changeToHarmonyOneMainnet = async () => {
  try {
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{...networks['harmony']}]
      }).then(() => {
        console.log('Switched to Harmony One Mainnet 👍')
      })
    }
  } catch (err: any) {
    console.error(err.message);
  }
}

export const changeToHarmonyOneTestnet = async () => {
  try {
    if (window.ethereum) {
      window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [{...networks['testnet']}]
      }).then(() => {
        console.log('Switched to Harmony One Testnet Shard 0 👍')
      })
    }
  } catch (err: any) {
    console.error(err.message);
  }
}

declare let window: any
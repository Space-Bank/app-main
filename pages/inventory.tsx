import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { BigNumber, ethers } from "ethers";
import type { NextPage } from "next";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  bossAddress,
  bossAbi,
  tokenAbi,
  tokenAddress,
  stakingAddress,
  stakingAbi,
} from "../config";
import { injected } from "../connectors";
import { changeToHarmonyOneMainnet } from "./mint";
import { Stake } from "../components/Stake";

const imageUrlBoss =
  "https://space-bank.s3.us-west-1.amazonaws.com/mobboss/images/$id.png";

const Inventory: NextPage = () => {
  const web3 = useWeb3React();
  web3.active
    ? console.log(
        "You are connected to Space Bank developed by @0xNaut via",
        web3.account
      )
    : console.log("Web3 not connected");

  const [totalOwned, setTotalOwned] = useState();
  const [totalOwnedBoss, setTotalOwnedBoss] = useState(0);
  const [loadingNfts, setLoadingNfts] = useState(true);

  const [ownedBossNfts, setOwnedBossNfts]: any[] = useState();

  const stakeNft = async (i: number) => {
    try {
      let stakingContract = new ethers.Contract(
        stakingAddress,
        stakingAbi,
        web3.library.getSigner(web3.account)
      );

      let bossContract = new ethers.Contract(
        bossAddress,
        bossAbi,
        web3.library.getSigner(web3.account)
      );

      let approval = await bossContract.approve(stakingAddress, i);
      let a = await approval.wait();
      let tx = await stakingContract.mobBossStake(i);
      let t = await tx.wait();
    } catch (e: any) {
      console.error(e);
    }
  };

  const loadInventory = async () => {
    try {
      let bossContract = new ethers.Contract(
        bossAddress,
        bossAbi,
        web3.library.getSigner(web3.account)
      );

      let balanceBoss = await bossContract.balanceOf(web3.account);
      setTotalOwnedBoss(balanceBoss.toNumber());

      setTotalOwned(balanceBoss.toNumber());

      console.log("You own " + totalOwned + " NFTs. ");

      let dataBoss: any = [];
      for (var i = 0; i < totalOwnedBoss; i++) {
        await bossContract
          .tokenOfOwnerByIndex(web3.account, i)
          .then((i: any) => {
            dataBoss.push(i.toNumber());
          });
      }
      setOwnedBossNfts(dataBoss);

      // let bossRewards: any = []
      // for (var i = 0; i < totalOwnedBoss; i++) {
      //   await bossContract.viewRewardAmount(ownedBossNfts[i]).then((i: any) => {
      //     console.log(ethers.utils.formatEther(BigNumber.from(i)))
      //     bossRewards.push(Number(ethers.utils.formatEther(BigNumber.from(i))).toFixed(2));
      //   });
      // }
      // setClaimableRewardsBoss(bossRewards)

      setLoadingNfts(false);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (web3.account) loadInventory();
  }, [loadingNfts, web3.account]);

  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (web3.active || web3.error) {
      setConnecting(false);
    }
  }, [web3.active, web3.error]);

  if (web3.error) return null;

  return (
    <div className="z-20 flex flex-col items-center justify-center h-full w-screen py-36">
      <div className="z-10 flex flex-col pl-12 sm:pl-36 md:pl-48 w-full text-left space-y-4 pb-12">
        <div className="h-0.5 bg-white w-full rounded-full" />
        <div className="text-white flex flex-wrap space-x-20 space-y-4 justify-start items-center w-full pb-4">
          <p className="font-saira-b text-4xl sm:text-5xl flex text-left">
            INVENTORY
          </p>

          <div>
            <p className="font-saira-sb text-2xl">{totalOwnedBoss}</p>
            <p className="text-lg font-saira-sb text-secondary">MOB BOSS</p>
          </div>
        </div>
      </div>

      {/* Inventory */}
      <div className="z-40 space-y-12">
        <div className="flex items-center justify-center flex-col space-y-6">
          {typeof web3.account === "string" ? (
            <>
              {loadingNfts ? (
                <></>
              ) : (
                <>
                  <p className="text-2xl sm:text-3xl text-white/90 text-shadow border-b border-white/10 shadow-sm">
                    MOB BOSS
                  </p>
                  <div className="flex flex-wrap items-center justify-center rounded-md shadow gap-10">
                    {ownedBossNfts?.map((i: any, idx: any) => (
                      <div
                        key={i}
                        className="flex flex-col space-y-2 items-center justify-center
                        bg-gradient-to-tr from-white/40 to-white/10 mx-auto p-2
                        rounded ring-1 ring-rose-100/75 shadow-sm shadow-rose-100/40
                        hover:shadow-md hover:shadow-rose-100/60"
                      >
                        <div className="flex justify-center flex-col items-center">
                          <span className="flex space-x-1 items-center px-1 pb-1.5">
                            <span className="font-saira-sb text-xl mr-1.5">
                              MOB BOSS
                            </span>{" "}
                            {i}
                          </span>
                          <a
                            href={`https://nftkey.app/collections/spacebankmobboss/token-details/?tokenId=${i}`}
                            target="_blank"
                            rel="noreferrer"
                          >
                            <Image
                              src={imageUrlBoss.replace("$id", i)}
                              layout="responsive"
                              height={1}
                              width={1}
                              className="rounded"
                            />
                          </a>
                          <button
                            onClick={(e: any) => {
                              e.preventDefault();
                              stakeNft(i);
                            }}
                            className="w-4/5 bg-primary px-3 py-2 hover:scale-105 duration-300 transition-all ease-in-out"
                          >
                            STAKE
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Stake />

                  {/* Generations */}
                  <div className="items-center flex flex-col justify-center">
                    <div className="text-white font-saira-sb text-center text-xl">
                      MOB BOSS
                      <p className="border-b border-white shadow-sm">
                        GENERATIONS
                      </p>
                    </div>

                    <div className="flex flex-col space-y-12 mt-8">
                      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-12 md:space-x-20 lg:space-x-32 w-full px-8">
                        <div>
                          <div className="bg-white h-0.5 w-full pr-2 mb-1" />
                          Gen 01
                          <p className="text-xs text-white/90 font-saira-b w-32">
                            MOB BOSS 1-199
                          </p>
                        </div>

                        <div className="flex flex-col text-white">
                          <div className="flex flex-col w-full text-xl font-saira-sb">
                            <div className="bg-primary h-1 w-32 pr-2 mb-1 rounded-full" />
                            300% Staking Boost
                          </div>

                          <div className="mt-4 w-64 list-disc space-y-2 font-saira-m">
                            Earn extra $GSM Rewards, as well as an in-game EXP
                            Boost and Unique in game title!
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-12 md:space-x-20 lg:space-x-32 w-full px-8">
                        <div>
                          <div className="bg-white h-0.5 w-full pr-2 mb-1" />
                          Gen 02
                          <p className="text-xs text-white/90 font-saira-b w-32">
                            MOB BOSS 200-399
                          </p>
                        </div>

                        <div className="flex flex-col text-white">
                          <div className="flex flex-col w-full text-xl font-saira-sb">
                            <div className="bg-secondary h-1 w-32 pr-2 mb-1 rounded-full" />
                            100% Staking Boost
                          </div>

                          <div className="mt-4 w-64 list-disc space-y-2 font-saira-m">
                            Earn extra $GSM Rewards, as well as an in-game EXP
                            Boost!
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-12 md:space-x-20 lg:space-x-32 w-full px-8">
                        <div>
                          <div className="bg-white h-0.5 w-full pr-2 mb-1" />
                          Gen 03
                          <p className="text-xs text-white/90 font-saira-b w-32">
                            MOB BOSS 400-1000
                          </p>
                        </div>

                        <div className="flex flex-col text-white">
                          <div className="flex flex-col w-full text-xl font-saira-sb">
                            <div className="bg-altBlue h-1 w-32 pr-2 mb-1 rounded-full" />
                            50% Staking Boost
                          </div>

                          <div className="mt-4 w-64 list-disc space-y-2 font-saira-m">
                            Earn extra $GSM Rewards, as well as an in-game EXP!
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          ) : (
            <>
              {typeof web3.account === "string" ? (
                <>
                  {web3.chainId !== 1666600000 ? (
                    <button
                      onClick={changeToHarmonyOneMainnet}
                      className="bg-gradient-to-r from-[#F03A47] to-[#CE653B] flex py-1.5 items-center text-base sm:text-lg justify-center
                                transition-all hover:scale-105 duration-300 ease-in-out hover:shadow-primary/60 hover:shadow-md w-48 rounded font-saira-m"
                    >
                      SWITCH NETWORK
                    </button>
                  ) : (
                    <></>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => {
                      web3
                        .activate(injected, undefined, true)
                        .catch((error) => {
                          // ignore the error if it's a user rejected request
                          if (error instanceof UserRejectedRequestError) {
                            console.log(
                              "Connecting Web3 to Space Bank developed by @0xNaut"
                            );
                          } else {
                            console.log(web3);
                            console.error(
                              "Please use a Web3-enabled browser like Chrome or Brave."
                            );
                          }
                        });
                    }}
                    className="bg-gradient-to-r from-[#F03A47] to-[#CE653B] flex w-48 py-1.5 items-center text-2xl justify-center
              transition-all hover:scale-105 duration-300 ease-in-out hover:shadow-primary/60 hover:shadow-md"
                  >
                    CONNECT
                  </button>
                </>
              )}
            </>
          )}
        </div>
      </div>

      {/* Background */}
      <div className="z-0">
        <Image src="/bg_02.png" layout="fill" />
      </div>
    </div>
  );
};

export default Inventory;

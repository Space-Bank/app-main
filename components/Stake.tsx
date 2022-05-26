import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import { ethers, BigNumber } from "ethers";
import Image from "next/image";
import { useEffect, useState } from "react";
import { stakingAddress, stakingAbi, tokenAbi, tokenAddress } from "../config";
import { injected } from "../connectors";
import { changeToHarmonyOneMainnet } from "../pages/mint";

const imageUrlBoss =
  "https://space-bank.s3.us-west-1.amazonaws.com/mobboss/images/$id.png";

export const Stake = () => {
  const web3 = useWeb3React();
  web3.active
    ? console.log(
        "You are connected to Space Bank developed by @0xNaut via",
        web3.account
      )
    : console.log("Web3 not connected");

  const [claimableGsm, setClaimableGsm] = useState(0);
  const [gsmBalance, setGsmBalance] = useState(0);
  const [loadingNfts, setLoadingNfts] = useState(true);
  const [totalStaked, setTotalStaked] = useState(0);
  const [stakedNfts, setStakedNfts]: any[] = useState();

  const loadInventory = async () => {
    try {
      let stakingContract = new ethers.Contract(
        stakingAddress,
        stakingAbi,
        web3.library.getSigner(web3.account)
      );

      let tokenContract = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        web3.library.getSigner(web3.account)
      );

      let currentGsm = await tokenContract.balanceOf(web3.account);
      setGsmBalance(
        Number(ethers.utils.formatEther(BigNumber.from(currentGsm)))
      );

      let stakedMobBosses = await stakingContract.getMobBossStakedNFTTokens(
        web3.account
      );
      setTotalStaked(stakedMobBosses.length);

      let data: any = [];
      for (var i = 0; i < totalStaked; i++) {
        data.push(
          Number(ethers.utils.formatEther(BigNumber.from(stakedMobBosses[i]))) *
            10 ** 18
        );
      }
      setStakedNfts(data);

      let totalRewardAmount = await stakingContract.getMobBossRewardTotalAmount(
        web3.account
      );
      setClaimableGsm(
        Number(ethers.utils.formatEther(BigNumber.from(totalRewardAmount)))
      );

      setLoadingNfts(false);
    } catch (err) {
      console.error(err);
    }
  };

  const unstakeNft = async (i: number) => {
    try {
      let stakingContract = new ethers.Contract(
        stakingAddress,
        stakingAbi,
        web3.library.getSigner(web3.account)
      );

      // let bossContract = new ethers.Contract(
      //   bossAddress,
      //   bossAbi,
      //   web3.library.getSigner(web3.account)
      // );

      // let approval = await bossContract.approve(stakingAddress, i)
      // let a = await approval.wait()
      let tx = await stakingContract.mobBossUnstake(i);
      let t = await tx.wait();
    } catch (e: any) {
      console.error(e);
    }
  };

  const claimGsmNft = async (i: number) => {
    try {
      let stakingContract = new ethers.Contract(
        stakingAddress,
        stakingAbi,
        web3.library.getSigner(web3.account)
      );

      // let approval = await bossContract.approve(stakingAddress, i)
      // let a = await approval.wait()
      let tx = await stakingContract.mobBossClaimRewardId(i);
      let t = await tx.wait();
    } catch (e: any) {
      console.error(e);
    }
  };
  const claimGsmAll = async () => {
    try {
      let stakingContract = new ethers.Contract(
        stakingAddress,
        stakingAbi,
        web3.library.getSigner(web3.account)
      );

      let stakedMobBosses = await stakingContract.getMobBossStakedNFTTokens(
        web3.account
      );

      // let approval = await bossContract.approve(stakingAddress, i)
      // let a = await approval.wait()
      let tx = await stakingContract.mobBossClaimReward(stakedMobBosses);
      let t = await tx.wait();
    } catch (e: any) {
      console.error(e);
    }
  };

  useEffect(() => {
    loadInventory();
  }, [loadingNfts]);

  return (
    <div className="z-20 flex flex-col items-center justify-center h-full w-screen py-36">
      <div className="z-10 flex flex-col pl-12 sm:pl-36 md:pl-48 w-full text-left space-y-4 pb-12">
        <div className="h-0.5 bg-white w-full rounded-full" />
        <div className="text-white flex flex-wrap space-x-20 space-y-4 justify-start items-center w-full pb-4">
          <p className="font-saira-b text-4xl sm:text-5xl flex text-left">
            STAKED
          </p>

          <div>
            <p className="font-saira-sb text-2xl">{gsmBalance}</p>
            <p className="text-lg font-saira-sb text-primary">
              <span className="text-white">$</span>GSM
            </p>
          </div>
        </div>
      </div>

      {/* Staking */}
      <div className="z-40 space-y-12 mx-6 flex-col flex items-center">
        <div className="w-full max-w-2xl flex items-center justify-between rounded-sm bg-gradient-to-tr to-white/20 from-white/40 ring-1 ring-white/40 shadow-md p-2">
          <div className="flex flex-col mr-3">
            <p className="text-white font-saira-b text-lg">REWARD</p>
            <p>You have {claimableGsm} unclaimed $GSM</p>
          </div>

          <button
            onClick={(e: any) => {
              e.preventDefault();
              claimGsmAll();
            }}
            className="flex py-2 px-3 bg-primary hover:scale-105 duration-300 transition-all ease-in-out"
          >
            CLAIM ALL
          </button>
        </div>

        <div className="flex items-center justify-center flex-col space-y-6">
          {typeof web3.account === "string" ? (
            <div className="justify-center w-full  items-center mx-1.5 flex flex-col space-y-4">
              <div className="font-saira-sb p-3 bg-gradient-to-tr to-primary from-primary/80 rounded-full shadow">
                300% GSM BONUS
              </div>
              <div className="flex items-center w-full justify-between">
                <div className="border-b shadow-md border-white/40 text-xl font-saira-m sm:text-2xl text-white mr-12">
                  STAKED
                </div>
                <div className="text-white">
                  {20 * totalStaked}{" "}
                  <span className="text-lg font-saira-sb text-primary">
                    <span className="text-white">$</span>GSM
                  </span>{" "}
                  PER DAY
                </div>
              </div>

              <div className="-translate-y-3 max-w-4xl flex rounded-smshadow-md p-2">
                <div className="flex flex-wrap items-center justify-center rounded-md shadow gap-10">
                  {stakedNfts?.map((i: any, idx: any) => (
                    <div
                      key={i}
                      className="flex flex-col space-y-2 items-center justify-center
                        bg-gradient-to-tr from-white/40 to-white/10 mx-auto p-2
                        rounded ring-1 ring-rose-100/75 shadow-sm shadow-rose-100/40
                        hover:shadow-md hover:shadow-rose-100/60"
                    >
                      <div className="">
                        <span className="flex space-x-1 items-center px-1 pb-1.5">
                          <span className="font-saira-m text-2xl mr-1.5">
                            MOB BOSS
                          </span>{" "}
                          {i}
                        </span>
                        <Image
                          src={imageUrlBoss.replace("$id", i)}
                          layout="responsive"
                          height={1}
                          width={1}
                          className="rounded-sm"
                        />
                      </div>
                      <button
                        onClick={(e: any) => {
                          e.preventDefault();
                          unstakeNft(i);
                        }}
                        className="flex py-2 px-3 bg-primary hover:scale-105 duration-300 transition-all ease-in-out"
                      >
                        UNSTAKE
                      </button>

                      <button
                        onClick={(e: any) => {
                          e.preventDefault();
                          claimGsmNft(i);
                        }}
                        className="flex py-2 px-3 bg-primary hover:scale-105 duration-300 transition-all ease-in-out"
                      >
                        CLAIM $GSM
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
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
    </div>
  );
};

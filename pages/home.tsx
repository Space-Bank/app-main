import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Escrow } from "../components/Escrow";
import { Nfts } from "../components/Nfts";

const Home: NextPage = () => {
  return (
    <div className="text-white items-center justify-center flex flex-col
    w-screen overflow-x-hidden">
      
      <div id='home' className="lg:mt-0 flex flex-col lg:flex-row z-10 w-full justify-evenly items-center h-full py-48">
        <div className="z-0 backdrop-blur rounded-full hidden lg:flex mx-6">
        <Image
          src="/hero.png"
          height={666}
          width={666}
        />
        </div>

        <div className="text-white text-3xl sm:text-4xl md:text-5xl lg:text-6xl flex flex-col
        text-left max-w-[40rem] ml-20">

          <div className="pr-20 font-saira-b">
            <p>HARMONY&apos;S</p>
            <p>$ONE STOP SHOP</p>
            <p>TO <span className="text-primary">SELL</span> AND <span className="text-secondary">SWAP</span></p>
            <p className="text-sm sm:text-base mt-4 font-saira-l">
              <span className="">
                OFFERING CROSS-PROJECT NFT ESCROW SERVICES AND A P2E ECOSYSTEM.
              </span>
            </p>  
            </div>

          <div className="flex items-center space-x-8 mt-12 w-screen">
            <Link href='mint'>
            <button className="bg-primary px-3 py-2.5 text-xl min-w-fit
            hover:scale-110 transition-all duration-300 shadow-md hover:shadow-lg
            shadow-primary/50 hover:shadow-primary/60">
              MINT NOW
            </button>
            </Link>
            <div className="bg-primary flex w-full h-0.5 rounded-full" />
          </div>

        </div>
        <div className="z-0 rounded-full lg:hidden mt-20">
        <Image
          src="/hero.png"
          height={444}
          width={444}
        />
        </div>
      </div>

      {/* Background */}
      <div className="z-0">
        <Image src='/bg_02.png' layout="fill" />
      </div>

      <Nfts />
      <div className="py-44 md:pt-2 h-0 z-20 items-center justify-center flex flex-col sm:flex-row space-y-12 sm:space-x-10 sm:space-y-0 w-full px-8">
        <div className="shadow-md shadow-secondary/40 bg-black p-8 flex-col border-b-2 border-secondary py-9">
          <div className="flex flex-col w-full text-2xl text-altBlue">
            <div className="bg-primary h-0.5 w-14 pr-2 mb-1 rounded-full" />
              SPACE BANK HEIST NFTS
          </div>

          <div className="flex flex-col sm:flex-row w-full items-center justify-evenly mt-2 space-y-5 sm:space-y-0 sm:space-x-6">
            <div className="flex flex-col items-start">
              <p className="text-secondary text-4xl font-saira-b">5000</p>
              <p className="text-sm font-saira-b">MOB BOSSES</p>
            </div>
          </div>
        </div>

        <div className="shadow-md shadow-secondary/40 bg-black p-8 flex-col text-white border-b-2 border-secondary">
          <div className="flex flex-col w-full text-2xl text-altBlue">
            <div className="bg-primary h-0.5 w-14 pr-2 mb-1 rounded-full" />
              UTILITY
          </div>
          <div className="mt-2">
          <p>NFT STAKING</p>
          <p>P2E GAMING</p>
          <p>ACCESS TO SPACE BANK FEATURES</p>
          </div>
        </div>
      </div>
      <Escrow />
    </div>
  );
};

export default Home;
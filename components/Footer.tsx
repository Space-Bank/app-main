import React from "react";
import Link from "next/link";
import Image from "next/image";
import { FaTwitter, FaDiscord } from "react-icons/fa";

export const Footer: React.FC = ({ }) => {
  return (
    <footer className="text-center z-0 bg-black bottom-0 py-4 items-center justify-between flex space-y-1 w-screen border-t-2 border-white/60">
      <Link href='/#home'>
        <div className="cursor-pointer ml-4 flex space-x-4
        items-center">
          <div className="hover:-rotate-6 transition-all duration-300 ease-in-out">
            <Image src='/rocket.png' layout='fixed' height={33} width={32} />
          </div>
          <span className="text-2xl hidden md:flex font-saira-black pb-2 text-white/80">
            SPACE BANK
          </span>
        </div>

      </Link>

      <div className="text-sm font-saira-el mx-4">
        Copyright © 2022 SPACE BANK. All Rights Reserved.
      </div>

      <div className="flex space-x-3.5 md:space-x-4 lg:space-x-5 text-[24px] lg:text-[28px] items-center justify-center mr-12 z-50">
        <a href="https://twitter.com/SpaceBankTrade"
          target='_blank'
          rel="noreferrer"
          className="hover:scale-110">
          <FaTwitter />
        </a>
        <a href="https://discord.gg/9GmKadRAUy"
          target='_blank'
          rel="noreferrer"
          className="hover:scale-110">
          <FaDiscord />
        </a>
      </div>
    </footer>
  );
};


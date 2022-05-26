import React, { Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { RiMenu5Line } from "react-icons/ri";
import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";
import useEagerConnect from "../hooks/useEagerConnect";
import Wallet from "./Wallet";

export const Nav = () => {
  let triedToEagerConnect = useEagerConnect();

  return (
    <nav id='nav' className="backdrop-blur-sm text-white py-2 bg-black/70">
      <header className="h-[83px] items-center w-full flex px-1.5 sm:px-3 md:px-8 xl:px-24">
        <div className="">
          <Logo />
        </div>
        <div className="flex w-full items-center justify-end">
          <Tabs />
        </div>
      </header>
    </nav>
  );
};

const Logo = () => (
  <Link href='/#home'>
    <div className="cursor-pointer">
    <div className="lg:hidden hover:-rotate-6 transition-all duration-300 ease-in-out">
    <Image src='/rocket.png' layout='fixed' height={60} width={58} />
    </div>
    <div className="hidden lg:flex">
    <Image src='/logo.png' layout='fixed' height={60} width={243} />
    </div>
    </div>
  </Link>
)

const Tabs = () => {
  return (
    <>
      <div className="flex nav:hidden">
        <Dropdown />
      </div>
      <div className="hidden nav:flex text-lg sm:text-xl space-x-1.5 md:space-x-4 lg:space-x-8 xl:space-x-16">
        <HeaderTab text="MINT" routes={['mint']} />
        <HeaderTab text="INVENTORY" routes={['inventory']} />
        {/* <HeaderScroll text="BUYBACK" id='buyback' /> */}
        <HeaderScroll text="ESCROW" id='escrow' />
        <HeaderScrollDisabled text="GAME" id='' />
      </div>
    </>
  );
};

const Dropdown = () => {
  return (
    <Menu
      as="div"
      className="relative inline-block z-10 focus:outline-none text-lg"
    >
      <>
        <Menu.Button
          className="flex items-center rounded p-2
        shadow-s, text-white/70 text-xl bg-white/10
        hover:-translate-y-0.5 transition-all duration-200 ease-in-out
        hover:ring-slate-200 hover:text-slate-100
        hover:shadow focus:outline-none scale-90 hover:scale-100"
        >
          <RiMenu5Line /> <span className="text-base">&nbsp;MENU</span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items
            className="absolute self-center -ml-[3.69rem] w-36 mt-2
            origin-top bg-black/90 backdrop-blur
            rounded-sm p-1.5 shadow-xl overflow-y-scroll
            z-0 focus:outline-none ring-2 ring-white/40"
          >
            <div className="nav:hidden gap-2 text-center items-center flex flex-col">
              <DropdownHeaderTab text="MINT" routes={['mint']} />
              <DropdownHeaderTab text="INVENTORY" routes={['inventory']} />
              <DropdownHeaderScroll text="ESCROW" sectionId='team' />
              <DropdownHeaderScrollDisabled text="GAME" sectionId='team' />
            </div>
          </Menu.Items>
        </Transition>
      </>
    </Menu>
  );
};

const HeaderTab: React.FC<HeaderTabProps> = ({ text, routes }) => {
  const router = useRouter();
  const isActive = routes?.includes(router.pathname);
  let x
  const _mammoth = 'mammoth'
  text === '$MAMMOTH' ? x = _mammoth : x = text
  return (
    <Link href={x.toLowerCase()}>
      <div
        className={`group
        ${isActive && "font-saira-sb text-white/100"}
        ${
          !isActive &&
          "hover:bg-gray-400/10 text-white/70 hover:text-white/100 hover:shadow-inner"
        }
        flex items-center rounded-md py-2 px-2.5
        bottom-0 hover:cursor-pointer transition-all
        ease-in-out duration-100 origin-center
        text-opacity-60 hover:text-opacity-100
        space-x-1.5`}
      >
        <span>{text}</span>
      </div>
    </Link>
  );
};

const HeaderScroll = ({ text, id }: any) => {
  return (
    <Link href={`../#${id.toLowerCase()}`}>
      <div
        className='hover:bg-gray-400/10 text-white/70 hover:text-white/100 hover:shadow-inner
        flex items-center rounded-md py-2 px-2.5
        bottom-0 hover:cursor-pointer transition-all
        ease-in-out duration-100 origin-center
        text-opacity-60 hover:text-opacity-100
        space-x-1.5`'
      >
        <span>{text}</span>
      </div>
    </Link>
  );
};

const HeaderScrollDisabled = ({ text, id }: any) => {
  return (
      <div
        className='hover:bg-gray-400/10 text-white/70 hover:text-white/100 hover:shadow-inner
        flex items-center rounded-md py-2 px-2.5
        bottom-0 hover:cursor-not-allowed transition-all
        ease-in-out duration-100 origin-center
        text-opacity-60 hover:text-opacity-100
        space-x-1.5`'
      >
        <span>{text}</span>
      </div>
  );
};

const DropdownHeaderTab: React.FC<HeaderTabProps> = ({ text, routes }) => {
  const router = useRouter();
  const isActive = routes?.includes(router.pathname);
  let x
  const _mammoth = 'mammoth'
  text === '$MAMMOTH' ? x = _mammoth : x = text
  return (
    <Link href={x.toLowerCase()}>
      <div
        className={`group
        ${isActive && "font-saira-sb text-white/100"}
        ${
          !isActive &&
          "hover:bg-gray-400/10 text-white/70 hover:text-white/100 hover:shadow-inner"
        }
        flex w-full justify-center py-1.5 hover:cursor-pointer transition-all
        ease-in-out duration-100 origin-center
        text-opacity-60 hover:text-opacity-100
        space-x-1.5 rounded-md`}
      >
        <span>{text}</span>
      </div>
    </Link>
  );
};

const DropdownHeaderScroll = ({ text }: any) => {
  return (
    <Link href={`../#${text.toLowerCase()}`}>
      <div
        className='hover:bg-gray-400/10 text-white/70 hover:text-white/100 hover:shadow-inner
        flex w-full justify-center py-1.5 hover:cursor-pointer transition-all
        ease-in-out duration-100 origin-center
        text-opacity-60 hover:text-opacity-100 rounded-md'
      >
        <span>{text}</span>
      </div>
    </Link>
  );
};

const DropdownHeaderScrollDisabled = ({ text }: any) => {
  return (
      <div
        className='cursor-not-allowed hover:bg-gray-400/10 text-white/70 hover:text-white/100 hover:shadow-inner
        flex w-full justify-center py-1.5 transition-all
        ease-in-out duration-100 origin-center
        text-opacity-60 hover:text-opacity-100 rounded-md'
      >
        <span>{text}</span>
      </div>
  );
};

interface HeaderTabProps {
  routes?: string[];
  icon?: any;
  text: string;
}

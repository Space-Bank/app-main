import { useWeb3React } from "@web3-react/core";
import { UserRejectedRequestError } from "@web3-react/injected-connector";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FiAlertTriangle } from "react-icons/fi";
import { injected } from "../connectors";

type WalletProps = {
  triedToEagerConnect: boolean;
};

const Wallet = ({ triedToEagerConnect }: WalletProps) => {
  const { active, error, activate, chainId, account, setError } =
    useWeb3React();

  // manage connecting state for injected connector
  const [connecting, setConnecting] = useState(false);

  useEffect(() => {
    if (active || error) {
      setConnecting(false);
    }
  }, [active, error]);

  if (error) return null;
  if (!triedToEagerConnect) return null;

  if (typeof account !== "string") {
    // Checks if there is a usable account - returns 'Connect Wallet' if not, and 0x0000.0000 if so
    return (
      <button
        className="cursor-pointer flex items-center rounded py-2 px-2 font-light text-base
        text-white/80 shadow-sm hover:shadow bg-white/10
        transition-all ease-in-out duration-100 hover:text-white/90"
        disabled={connecting}
        onClick={() => {
          setConnecting(true);

          activate(injected, undefined, true).catch((error) => {
            // ignore the error if it's a user rejected request
            if (error instanceof UserRejectedRequestError) {
              setConnecting(false);
            } else {
              setError(error);
            }
          });
        }}
      >
        <span>CONNECT</span>
      </button>
    );
  } else if (chainId !== 1) {
    return (
      <button
        className="cursor-pointer flex items-center rounded py-2 px-2 font-light text-sm
        text-white/80 shadow-sm hover:shadow bg-red-100/10
        transition-all ease-in-out duration-100 hover:text-white/90 space-x-1.5"
        onClick={changeToEthereum}
      >
        <span className="text-red-400"><FiAlertTriangle /></span>
        <span>CONNECT</span>
      </button>
    );
  }
  return (
    <Link href='/profile'>
    <div
      className="cursor-pointer flex items-center rounded py-2 px-2 font-light text-sm
      text-white/80 shadow-sm hover:shadow bg-white/10
      transition-all ease-in-out duration-100 hover:text-white/90"
    >
      {shortenHex(account)}
    </div>
    </Link>
  );
};

export const shortenHex = (hex: string, length = 4) => {
  return `${hex.substring(0, length + 2)}…${hex.substring(
    hex.length - length
  )}`;
};

export default Wallet;

export const changeToEthereum = async () => {
  try {
    if (window.ethereum) {
      window.ethereum
        .request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: '0x1' }],
        })
        .then(() => {
          console.log("Switched to Ethereum Mainnet 👍");
        });
    }
  } catch (err: any) {
    console.error(err.message);
  }
};

declare let window: any;

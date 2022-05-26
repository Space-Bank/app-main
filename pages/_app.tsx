import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Head from 'next/head'
import { Nav } from '../components/Nav';
import { Web3ReactProvider } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Footer } from '../components/Footer';

function MyApp({ Component, pageProps }: AppProps) {
  const getLibrary = (provider: any) => {
    const library = new Web3Provider(provider, 'any');
    library.pollingInterval = 15000;
    return library;
  }

  return (
    <Web3ReactProvider getLibrary={getLibrary}>
    <div className='flex flex-col w-full h-full fixed text-white/80 bg-black backdrop-blur-sm z-0 font-saira'>
      <Head>
        <title>Space Bank</title>
        <meta name='description' content='SPACEBANK | Home of SPACEBANK HEIST and NFT Escrow + Lending and on Harmony ONE' />
        <meta name='keywords' content='space, bank, spacebank, harmony, nfts, defi, p2e, nft, gaming, naut, 0xnaut, harmonyspacebank, space bank' />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <main className='flex flex-col h-full scroll-smooth
        overflow-y-scroll bg-transparent justify-between'>
        <div className='top-0 sticky z-50 h-0'><Nav /></div>
        <div className=''><Component {...pageProps} /></div>
        <footer className='z-0 bottom-0'>
          <Footer />
        </footer>
      </main>

    </div>
    </Web3ReactProvider>
  )}

export default MyApp
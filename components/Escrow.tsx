import Image from "next/image"

export const Escrow = () => {
  return (
    <div id="escrow"
      className="flex flex-col items-center justify-center h-full w-screen bg-[#e3e3e3] py-24 z-10"
    >
      <div className='flex w-full justify-between items-center text-center text-6xl'>
        <div className="bg-black/75 h-0.5 flex w-full rounded-full" />
        <span className="text-black mx-4 w-full justify-center items-center flex font-saira-black">NFT ESCROW</span>
        <div className="bg-black/75 h-0.5 flex w-full rounded-full" />
      </div>

      <p className="text-black max-w-[29rem] text-center mt-14 mx-6 font-saira-m">
        SPACE BANK looks to create a service that would allow to users to trade NFTs without the use of a currency.
      </p>

      <div className="mt-24 flex w-full justify-center flex-wrap gap-12 sm:gap-24 md:gap-36 lg:gap-48 xl:gap-64">

        <div className="flex-col space-y-8">
          <div className="flex flex-col w-full text-2xl text-black font-saira-sb">
            <div className="bg-primary h-1 w-24 pr-2 mb-1 rounded-full" />
            TRADE OFFERS
          </div>

          <div>
            <Image src='/escrow_01.png' width={340} height={243.91} />
          </div>

          <div className="w-[21rem] text-black font-saira-m">
            A feature allowing users to offer an NFT or NFTs in exchange for an-other NFT(s), with the ability to leave their offers on another users profile.
          </div>
        </div>

        <div className="mt-24 sm:mt-0 flex-col space-y-8">
          <div className="flex flex-col w-full text-2xl text-black font-saira-sb">
            <div className="bg-primary h-1 w-24 pr-2 mb-1 rounded-full" />
            LIVE TRADES
          </div>

          <div>
            <Image src='/escrow_02.png' width={340} height={243.91} />
          </div>

          <div className="w-[21rem] text-black font-saira-m">
            A live trade would allow 2 users to operate separate trade windows to allow for a seamless trade experience. Where one could make offers live with a chat window for communication.
          </div>
        </div>

      </div>

    </div>
  )
}
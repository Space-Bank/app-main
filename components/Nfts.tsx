import Image from 'next/image'

export const Nfts: React.FC = ({}) => {
 
  return (
    <div id="nfts"
      className="flex flex-col items-center justify-center h-full w-screen bg-[#e3e3e3] pt-32 pb-96 sm:pb-72 z-10"
    >
      <div className="flex flex-col pl-12 sm:pl-36 md:pl-48 w-full text-left space-y-4">
        <div className="h-0.5 bg-black w-full" />
        <p className="text-black font-saira-black text-6xl">SPACE BANK NFTS</p>
      </div>

      <div className="flex flex-col space-y-12 mt-24"> 
      <div className="flex flex-col sm:flex-row space-y-6 sm:space-y-0 sm:space-x-12 md:space-x-20 lg:space-x-32 w-full px-8">
          <div>
          <div className="text-black">
            <div className="bg-black h-0.5 w-full pr-2 mb-1" />
              01
            </div>
          </div>

          <div>
            <Image 
              src='/nfts_02.png'
              width={365}
              height={365} />
          </div>

          <div className="flex flex-col text-black">
            <div className="flex flex-col w-full text-2xl font-saira-sb">
              <div className="bg-secondary h-1 w-32 pr-2 mb-1 rounded-full" />
              MOB BOSSES
            </div>

            <div className='mt-4 w-64 list-disc space-y-2 font-saira-m'>
              The Mob boss NFTs run the show here in the Space Bank, providing bonuses to all aspects of it. Mob bosses will pay lower transfer taxes in the escrow service, have access to their own planning room for their heists, and be able to take their chances with the vaults.
            </div>

            <ul className='mt-4 w-64 list-disc space-y-2 font-saira-m'>
              <li>EMTS 5 TOKENS PER DAY</li>
              <li>1% TRANSFER TAX IN THE ESCROW SERVICE</li>
              <li>PLANNING ROOM AIRDROP</li>
              <li>MORE TOKENS EARNED IN SPACE BANK HEIST</li>
              <li>EXCLUSIVE BONUSES FOR OFFICIAL SPACE BANK INVADE GAME</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

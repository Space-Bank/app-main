// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract SpaceBankMobBoss is ERC721Enumerable, Ownable {
    using Strings for uint256;
    using SafeERC20 for IERC20;

    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public PRICE_PER_MOB_BOSS = 3000e18; //Scaled upto 26 decimals

    string baseURI;
    string baseExtension = ".json";
    IERC20 GSM;
    bool public paused = false;
    address RPGContract;

    modifier notPaused() {
        require(paused == false);
        _;
    }

    struct MobBoss {
        uint256 tokenID;
        uint256 level;
        uint256 generation;
    }
    MobBoss[] public MobBossesList;

    function changePrice(uint256 _newPrice) external onlyOwner {
        PRICE_PER_MOB_BOSS = _newPrice;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _initBaseURI,
        address _GSM
    ) ERC721(_name, _symbol) {
        GSM = IERC20(_GSM);
        setBaseURI(_initBaseURI);
        mint(0x8279b2950850fF4228ED5AAF84B407Df652664e2, 50);
    }

    function mint(address recipient, uint256 amount) public payable notPaused {
        uint256 totalSupply = totalSupply();
        require(amount > 0, "Mint amount is invalid");
        require(
            totalSupply + amount <= MAX_SUPPLY,
            "Exceeding mob boss max supply"
        );

        if (msg.sender != owner())
            require(
                msg.value >= amount * PRICE_PER_MOB_BOSS,
                "Insufficient ONE"
            );
        uint256 generation;
        for (uint256 i = 1; i <= amount; i++) {
            if (totalSupply + i < 200) {
                generation = 1;
            } else if (totalSupply + i < 400) {
                generation = 2;
            } else if (totalSupply + i < 1000) {
                generation = 3;
            } else {
                generation = 4;
            }
            MobBossesList.push(MobBoss(totalSupply + i, 1, generation));

            _safeMint(recipient, totalSupply + i);
        }
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return baseURI;
    }

    function levelUp(uint256 _tokenId) external onlyOwner {
        MobBossesList[_tokenId].level += 1;
    }

    function returnGeneration(uint256 _tokenId)
        external
        view
        returns (uint256)
    {
        return MobBossesList[_tokenId].generation;
    }

    function returnLevel(uint256 _tokenId) external view returns (uint256) {
        return MobBossesList[_tokenId].level;
    }

    function walletOfOwner(address _owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 ownerTokenCount = balanceOf(_owner);
        uint256[] memory tokenIds = new uint256[](ownerTokenCount);
        for (uint256 i; i < ownerTokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(_owner, i);
        }
        return tokenIds;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory currentBaseURI = _baseURI();
        return
            bytes(currentBaseURI).length > 0
                ? string(
                    abi.encodePacked(
                        currentBaseURI,
                        tokenId.toString(),
                        baseExtension
                    )
                )
                : "";
    }

    function pause() external onlyOwner {
        paused = true;
    }

    function unpause() external onlyOwner {
        paused = false;
    }

    function setBaseURI(string memory _newBaseURI) public onlyOwner {
        baseURI = _newBaseURI;
    }

    function setBaseExtension(string memory _newBaseExtension)
        external
        onlyOwner
    {
        baseExtension = _newBaseExtension;
    }

    function withdraw() external onlyOwner {
        (bool success, ) = payable(msg.sender).call{
            value: address(this).balance
        }("");
        require(success);
    }
}
// SPDX-License-Identifier: unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";
import "hardhat/console.sol";

contract SpaceBankMobBossStaking is Ownable, ERC721Holder {
    IERC20 public rewardsToken;
    IERC721 public MobBossStakingNFT;

    uint256 constant stakingTime = 1 days;
    uint256 public MobBossGSMRewardToken = 5e18;

    struct Staker {
        uint256[] tokenIds;
        mapping(uint256 => uint256) tokenStakingCoolDown;
        uint256 balance;
    }

    constructor(IERC721 _MobBossStakingNFT, IERC20 _rewardToken) {
        MobBossStakingNFT = _MobBossStakingNFT;
        rewardsToken = _rewardToken;
    }

    mapping(address => Staker) public stakers;
    mapping(uint256 => address) public tokenOwner;

    event Staked(address owner, uint256 amount);
    event Unstaked(address owner, uint256 amount);
    event RewardPaid(address indexed user, uint256 reward);

    //@MobBoss NFT Staking
    function mobBossStake(uint256 tokenId) external {
        _stake(msg.sender, tokenId);
    }

    function changeRewardToken(uint256 _newRewardTokenAmount)
        external
        onlyOwner
    {
        MobBossGSMRewardToken = _newRewardTokenAmount;
    }

    function mobBossStakeBatch(uint256[] memory tokenIds) external {
        for (uint256 i = 0; i < tokenIds.length; i++) {
            _stake(msg.sender, tokenIds[i]);
        }
    }

    function _stake(address _user, uint256 _tokenId) internal {
        require(
            MobBossStakingNFT.ownerOf(_tokenId) == _user,
            "This user isn't the owner of token"
        );

        Staker storage staker = stakers[_user];
        staker.tokenIds.push(_tokenId);
        staker.tokenStakingCoolDown[_tokenId] = block.timestamp;

        tokenOwner[_tokenId] = _user;

        MobBossStakingNFT.safeTransferFrom(_user, address(this), _tokenId);
        emit Staked(_user, _tokenId);
    }

    //@Recruit NFT Unstaking
    function mobBossUnstake(uint256 _tokenId) external {
        mobBossClaimRewardId(_tokenId);
        _unstake(msg.sender, _tokenId);
    }

    function mobBossUnstakeBatch(uint256[] memory _tokenIds) public {
        mobBossClaimReward(_tokenIds);
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            if (tokenOwner[_tokenIds[i]] == msg.sender) {
                _unstake(msg.sender, _tokenIds[i]);
            }
        }
    }

    function _unstake(address _user, uint256 _tokenId) internal {
        require(
            tokenOwner[_tokenId] == _user,
            "User must be the owner of the staked nft"
        );
        Staker storage staker = stakers[_user];

        if (staker.tokenIds.length > 0) {
            uint256 lastIndex = staker.tokenIds.length - 1;
            uint256 lastIndexKey = staker.tokenIds[lastIndex];
            for (uint256 i = 0; i <= lastIndex; i++) {
                if (_tokenId == staker.tokenIds[i]) {
                    staker.tokenIds[i] = lastIndexKey;
                }
            }
            staker.tokenIds.pop();
            staker.tokenStakingCoolDown[_tokenId] = 0;
            delete tokenOwner[_tokenId];

            MobBossStakingNFT.safeTransferFrom(address(this), _user, _tokenId);
            if (staker.tokenIds.length == 0) {
                delete stakers[_user];
            }
            emit Unstaked(_user, _tokenId);
        }
    }

    //@Recruit Claim
    function mobBossClaimReward(uint256[] memory _tokenIds) public {
        updateReward(_tokenIds);
        require(stakers[msg.sender].balance > 0, "This user has 0 rewards yet");

        Staker storage staker = stakers[msg.sender];
        uint256 rewardsamount = staker.balance;

        uint256 rewardBal = rewardsToken.balanceOf(address(this));
        if (rewardsamount > rewardBal) {
            rewardsamount = rewardBal;
        }
        rewardsToken.transfer(msg.sender, rewardsamount);
        staker.balance = 0;
        emit RewardPaid(msg.sender, rewardsamount);


    }

    function updateReward(uint256[] memory _tokenIds) internal {
        Staker storage staker = stakers[msg.sender];
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            if (
                staker.tokenStakingCoolDown[_tokenIds[i]] <
                block.timestamp + stakingTime &&
                staker.tokenStakingCoolDown[_tokenIds[i]] > 0 &&
                tokenOwner[_tokenIds[i]] == msg.sender
            ) {
                uint256 stakedDays = (
                    (block.timestamp -
                        uint256(staker.tokenStakingCoolDown[_tokenIds[i]]))
                ) / stakingTime;
                uint256 partialTime = (
                    (block.timestamp -
                        uint256(staker.tokenStakingCoolDown[_tokenIds[i]]))
                ) % stakingTime;
                uint boostMultiplier;

                if(staker.tokenIds[i] < 200){
                    boostMultiplier  = 300;



                }
                else if (staker.tokenIds[i] < 400){
                     boostMultiplier  = 100;


                }
                else if (staker.tokenIds[i] < 1000){
                     boostMultiplier  = 50;


                }
                else{
                    boostMultiplier = 0;
                }
                
                staker.balance += MobBossGSMRewardToken * stakedDays; 
                staker.balance += ((MobBossGSMRewardToken * stakedDays) / 100) * boostMultiplier; // add boost
                boostMultiplier = 0;


                staker.tokenStakingCoolDown[_tokenIds[i]] =
                    block.timestamp +
                    partialTime;
            }
        }
    }

    function mobBossClaimRewardId(uint256 _tokenId) public {
        require(
            tokenOwner[_tokenId] == msg.sender,
            "User must be the owner of the staked nft"
        );
        Staker storage staker = stakers[msg.sender];
        if (
            staker.tokenStakingCoolDown[_tokenId] <
            block.timestamp + stakingTime &&
            staker.tokenStakingCoolDown[_tokenId] > 0
        ) {
            uint256 stakedDays = (
                (block.timestamp -
                    uint256(staker.tokenStakingCoolDown[_tokenId]))
            ) / stakingTime;
            uint256 partialTime = (
                (block.timestamp -
                    uint256(staker.tokenStakingCoolDown[_tokenId]))
            ) % stakingTime;

                    uint boostMultiplier;

                if(_tokenId < 200){
                    boostMultiplier  = 300;



                }
                else if (_tokenId < 400){
                     boostMultiplier  = 100;


                }
                else if (_tokenId< 1000){
                     boostMultiplier  = 50;


                }
                else{
                    boostMultiplier = 0;
                }

              
              

            uint256 rewardToken = MobBossGSMRewardToken * stakedDays;
            rewardToken        +=  ((MobBossGSMRewardToken * stakedDays) / 100) * boostMultiplier; // add boost
            boostMultiplier = 0;



            require(rewardToken > 0, "This user has 0 rewards yet");
            rewardsToken.transfer(msg.sender, rewardToken);
            staker.tokenStakingCoolDown[_tokenId] =
                block.timestamp +
                partialTime;

            emit RewardPaid(msg.sender, rewardToken);
        }
    }

    //@View functions for Frontend
    function getMobBossStakedNFTTokens(address _user)
        public
        view
        returns (uint256[] memory tokenIds)
    {
        return stakers[_user].tokenIds;
    }

    function getMobBossRewardTotalAmount(address _user)
        public
        view
        returns (uint256 rewardAmount)
    {
        Staker storage staker = stakers[_user];
        uint256[] storage _tokenIds = staker.tokenIds;
        uint256 rewardTokens = 0;
        for (uint256 i = 0; i < _tokenIds.length; i++) {
            if (
                staker.tokenStakingCoolDown[_tokenIds[i]] <
                block.timestamp + stakingTime &&
                staker.tokenStakingCoolDown[_tokenIds[i]] > 0 &&
                tokenOwner[_tokenIds[i]] == msg.sender
            ) {
                uint256 stakedDays = (
                    (block.timestamp -
                        uint256(staker.tokenStakingCoolDown[_tokenIds[i]]))
                ) / stakingTime;
                rewardTokens += MobBossGSMRewardToken * stakedDays;
            }
        }
        return rewardTokens;
    }

    function getMobBossRewardTokenAmount(address _user, uint256 _tokenId)
        public
        view
        returns (uint256 rewardAmount)
    {
        require(
            tokenOwner[_tokenId] == _user,
            "User must be the owner of the staked nft"
        );
        Staker storage staker = stakers[_user];
        uint256 stakedDays = (
            (block.timestamp - uint256(staker.tokenStakingCoolDown[_tokenId]))
        ) / stakingTime;
        uint256 rewardToken = MobBossGSMRewardToken * stakedDays;
        require(rewardToken > 0, "This user has 0 rewards for this NFT yet");
        return rewardToken;
    }
}
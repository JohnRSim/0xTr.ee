// SPDX-License-Identifier: MIT

pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/draft-ERC20Permit.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract TreeToken is ERC20, ERC20Permit, ERC20Votes, Ownable {
    /* 
      This should be an ERC or OpenZeppelin standard 
      Look up various L2 token contract addresses from ETH L1 using the chainId
    */
    mapping(uint => address) public crossChain;

    constructor() ERC20("TreeToken", "TREE") ERC20Permit("TreeToken") {
      _mint(msg.sender, 20000000 ether); // need to mint some to seed liquidity pool
    }

    /* 
        Functions to lookup same token deployed on other chains
        Ethereum mainnet will hold the master token which maps
        to all the other alt L1's and L2's.
    */
    function addCrossChainContract(uint256 _chainId, address _tokenContractAddress) public onlyOwner {
      crossChain[_chainId] = _tokenContractAddress;
    }

    function removeCrossChainContract(uint256 _chainId) public onlyOwner {
      delete crossChain[_chainId];
    }

    function crossChainLookup(uint256 _chainId) public view returns (address) {
        return crossChain[_chainId];
    }

    // Internals
    function _afterTokenTransfer(address from, address to, uint256 amount) internal override(ERC20, ERC20Votes) {
      super._afterTokenTransfer(from, to, amount);
    }

    function _mint(address to, uint256 amount) internal override(ERC20, ERC20Votes) {
      super._mint(to, amount);
    }

    function _burn(address account, uint256 amount) internal override(ERC20, ERC20Votes) {
      super._burn(account, amount);
    }

    /*
      Mint & burn functions required for TREE contract to create new tokens & burn buybacks
      owner is a contract not a dev wallet
    */
    function mint(address _to, uint256 _amount) public onlyOwner {
      _mint(_to, _amount);
    }

    function burn(uint256 _amount) public onlyOwner {
      _burn(msg.sender, _amount);
    }

}

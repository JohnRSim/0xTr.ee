//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestNFT is ERC721("TestNFT", "TNFT") {
	function mint(address _recipient, uint256 _id) public {
		_mint(_recipient, _id);
	}
}
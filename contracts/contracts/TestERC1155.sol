//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";

contract TestERC1155 is ERC1155("https://jamesbachini.com") {
	function mint(address _recipient, uint256 _id) public {
		_mint(_recipient, _id,1,"");
	}
}
// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity 0.8.7;

import '@uniswap/v3-periphery/contracts/interfaces/ISwapRouter.sol';

interface IERC20 {
  function approve(address spender, uint amount) external returns (bool);
}

contract SwapExample {
    // Mumbai Testnet
    address public constant ROUTER = 0xE592427A0AEce92De3Edee1F18E0157C05861564;
    address public constant DAI = 0x001B3B4d0F3714Ca98ba10F6042DaEbF0B1B7b6F;
    address public constant WMATIC = 0x9c3C9283D3e44854697Cd22D3Faa240Cfb032889;

    uint24 public constant poolFee = 3000;
    uint256 public constant amountIn = 100000;

    function swapExactInputSingle() external returns (uint256 amountOut) {
        IERC20(DAI).approve(ROUTER, amountIn);
        ISwapRouter.ExactInputSingleParams memory params =
            ISwapRouter.ExactInputSingleParams({
                tokenIn: DAI,
                tokenOut: WMATIC,
                fee: poolFee,
                recipient: address(this),
                deadline: block.timestamp,
                amountIn: amountIn,
                amountOutMinimum: 0,
                sqrtPriceLimitX96: 0
            });
        amountOut = ISwapRouter(ROUTER).exactInputSingle(params);
    }
    receive () external payable {}
}
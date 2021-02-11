pragma solidity ^0.6.2;

import "./Math.sol";


contract MathProxy {
    using Math for uint256;
    using Math for int256;

    function add(uint256 a, uint256 b) public pure returns (uint256) {
        return a.add(b);
    }

    function sub(uint256 a, uint256 b) public pure returns (uint256) {
        return a.sub(b);
    }

    function mul(uint256 a, uint256 b) public pure returns (uint256) {
        return a.mul(b);
    }

    function div(uint256 a, uint256 b) public pure returns (uint256) {
        return a.div(b);
    }

    function signedAdd(int256 a, uint256 b) public pure returns (int256) {
        return a.signedAdd(b);
    }

    function signedSub(int256 a, uint256 b) public pure returns (int256) {
        return a.signedSub(b);
    }

    function minus(uint256 a, int256 b) public pure returns (uint256) {
        return a.minus(b);
    }
}

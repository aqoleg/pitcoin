pragma solidity ^0.6.2;


library Math {
    /// @return uint256 = a + b
    function add(uint256 a, uint256 b) internal pure returns (uint256) {
        uint256 c = a + b;
        assert(c >= a);
        return c;
    }

    /// @return uint256 = a - b
    function sub(uint256 a, uint256 b) internal pure returns (uint256) {
        require(b <= a, "too big value");
        return a - b;
    }

    /// @return uint256 = a * b
    function mul(uint256 a, uint256 b) internal pure returns (uint256) {
        if (a == 0) {
            return 0;
        }
        uint256 c = a * b;
        assert(c / a == b);
        return c;
    }

    /// @return uint256 = a / b
    function div(uint256 a, uint256 b) internal pure returns (uint256) {
        return a / b;
    }

    /// @return int256 = a + b
    function signedAdd(int256 a, uint256 b) internal pure returns (int256) {
        int256 c = a + int256(b);
        assert(c >= a);
        return c;
    }

    /// @return int256 = a - b
    function signedSub(int256 a, uint256 b) internal pure returns (int256) {
        int256 c = a - int256(b);
        assert(c <= a);
        return c;
    }

    /// @return uint256 = a - b
    function minus(uint256 a, int256 b) internal pure returns (uint256) {
        if (b < 0) {
            return add(a, uint256(-b));
        } else {
            uint256 c = uint256(b);
            if (c > a) {
                return 0;
            }
            return a - c;
        }
    }
}

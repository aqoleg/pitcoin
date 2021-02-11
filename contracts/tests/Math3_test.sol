pragma solidity ^0.6.2;

import "remix_tests.sol";
import "./Math.sol";
import "./MathProxy.sol";


contract Math1_test {
    using Math for uint256;

    MathProxy private proxy;
    uint256 private a = 2**256 - 10;
    uint256 private b = 10;
    uint256 private zero = 0;

    function beforeAll() public {
        proxy = new MathProxy();
    }

    function minus1() public {
        Assert.ok(zero - 1 > 0, "0 - 1");

        bytes memory payload = abi.encodeWithSignature("minus(uint256,int256)", 1000, -50);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "1000 - (-50)");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 1050, "1000 - (-50)");

        payload = abi.encodeWithSignature("minus(uint256,int256)", zero, 1);
        (success, data) = address(proxy).call(payload);
        Assert.ok(success, "0 - 1");
        result = abi.decode(data, (uint256));
        Assert.equal(result, 0, "0 - 1");

        payload = abi.encodeWithSignature("minus(uint256,int256)", 2**255, -(2**255));
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "2**255 - (-(2**255))");

        Assert.equal(a.minus(0), a, "(2**256 - 10) - 0");
        Assert.equal(b.minus(10), 0, "10 - 10");
        Assert.equal(b.minus(-1000), 1010, "10 - (-1000)");
        uint256 c = 2**254;
        Assert.equal(c.minus(-(2**254)), 2**255, "2**254 - (-2**254)");
        Assert.equal(zero.minus(-1), 1, "0 - (-1)");
        Assert.equal(zero.minus(-(2**100)), 2**100, "0 - (-(2**100))");
        Assert.equal(b.minus(10 - 2**255), 2**255, "10 - (10 - 2**255)");
        c = 2**250;
        Assert.equal(c.minus(-(2**250)), 2**251, "2**250 - (-(2**250))");
        Assert.equal(c.minus(2**249), 2**249, "2**250 - 2**249");
    }

    function subSigned2() public {
        bytes memory payload = abi.encodeWithSignature("minus(uint256,int256)", 2**255, 1);
        (bool success,bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "2**255 - 1");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 2**255 - 1, "2**255 - 1");

        payload = abi.encodeWithSignature("minus(uint256,int256)", a, -100);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "(2**256 - 10) - (-100)");

        Assert.equal(b.minus(-(2**255)), 10 + 2**255, "10 - (-(2**255))");
        Assert.equal(b.minus(-(2**255 - 10)), 2**255, "10 - (-(2**255 - 10))");
        Assert.equal(b.minus(11), 0, "10 - 11");
    }
}

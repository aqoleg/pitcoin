pragma solidity ^0.6.2;

import "remix_tests.sol";
import "./Math.sol";
import "./MathProxy.sol";


contract Math1_test {
    using Math for int256;

    MathProxy private proxy;
    uint256 private a = 2**256 - 10;

    function beforeAll() public {
        proxy = new MathProxy();
    }

    function signedAdd1() public {
        int256 c = 2**255 - 1;
        Assert.ok(c + 1 < 0, "(2**255 - 1) + 1");

        bytes memory payload = abi.encodeWithSignature("signedAdd(int256,uint256)", -1000, 50);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "-1000 + 50");
        int256 result = abi.decode(data, (int256));
        Assert.equal(result, -950, "-1000 + 50");

        payload = abi.encodeWithSignature("signedAdd(int256,uint256)", c, 1);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "(2**255 - 1) + 1");

        Assert.equal(c.signedAdd(0), c, "(2**255 - 1) + 0)");
        int256 d = -(2**255);
        Assert.equal(d.signedAdd(a), 2**255 - 10, "-(2**255) + (2**256 - 10)");
        d = -100;
        Assert.equal(d.signedAdd(2**255), 2**255 - 100, "-100 + 2**255");
        Assert.equal(d.signedAdd(10), -90, "-100 + 10");
    }

    function signedAdd2() public {
        Assert.equal(int256(1 + a), -9, "1 + (2**256 - 10)");

        bytes memory payload = abi.encodeWithSignature("signedAdd(int256,uint256)", -(2**255), 2**255);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "-(2**255) + 2**255");
        int256 result = abi.decode(data, (int256));
        Assert.equal(result, 0, "-(2**255) + 2**255");

        payload = abi.encodeWithSignature("signedAdd(int256,uint256)", -100, a);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "-100 + (2**256 - 10)");

        int256 c = -(2**250);
        Assert.equal(c.signedAdd(2**251), 2**250, "-(2**250) + 2**251");
        Assert.equal(c.signedAdd(2**255), 31*2**250, "-(2**250) + 2**255");
        Assert.equal(c.signedAdd(0), c, "-(2**250) + 0");
        c = 2**250;
        Assert.equal(c.signedAdd(2**250), 2**251, "2**250 + 2**250");
        c = -(2**254);
        Assert.equal(c.signedAdd(2**255 + 100), 2**254 + 100, "-(2**254) + (2**255 + 100)");
    }

    function signedSub1() public {
        int256 c = -(2**255);
        Assert.ok(c < 0 && c - 1 > 0, "-(2**255) - 1");

        bytes memory payload = abi.encodeWithSignature("signedSub(int256,uint256)", -1000, 50);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "-1000 - 50");
        int256 result = abi.decode(data, (int256));
        Assert.equal(result, -1050, "-1000 - 50");

        payload = abi.encodeWithSignature("signedSub(int256,uint256)", c, 1);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "-(2**255) - 1");

        Assert.equal(c.signedSub(0), c, "-(2**255) - 0");
        c = -(2**254);
        Assert.equal(c.signedSub(2**254), -(2**255), "-(2**254) - 2**254");
        c = 0;
        Assert.equal(c.signedSub(1), -1, "0 - 1");
        Assert.equal(c.signedSub(2**100), -(2**100), "0 - 2**100");
        c = 2**255 - 10;
        Assert.equal(c.signedSub(a), -(2**255), "(2**255 - 10) - (2**256 - 10)");
    }

    function signedSub2() public {
        Assert.equal(int256(1 - a), 11, "1 - (2**256 - 10)");

        bytes memory payload = abi.encodeWithSignature("signedSub(int256,uint256)", 2**255 - 1, 2**255);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "(2**255 - 1) - 2**255");
        int256 result = abi.decode(data, (int256));
        Assert.equal(result, -1, "(2**255 - 1) - 2**255");

        payload = abi.encodeWithSignature("signedSub(int256,uint256)", 100, a);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "100 - (2**256 - 10)");

        int256 c = 2**250;
        Assert.equal(c.signedSub(2**251), -(2**250), "2**250 - 2**251");
        Assert.equal(c.signedSub(2**255), -31*2**250, "2**250 - 2**255");
        Assert.equal(c.signedSub(0), c, "2**250 - 0");
        c = -(2**250);
        Assert.equal(c.signedSub(2**250), -(2**251), "-(2**250) - 2**250");
        c = 2**254;
        Assert.equal(c.signedSub(2**255 + 100), -(2**254 + 100), "2**254 - (2**255 + 100)");
    }
}

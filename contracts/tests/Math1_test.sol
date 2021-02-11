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

    function add1() public {
        Assert.equal(a + 11, 1, "(2**256 - 10) + 11");

        bytes memory payload = abi.encodeWithSignature("add(uint256,uint256)", 1244, 2555);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "1244 + 2555");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 3799, "1244 + 2555");

        payload = abi.encodeWithSignature("add(uint256,uint256)", a, b);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "(2**256 - 10) + 10");

        Assert.equal(a.add(0), a, "(2*256 - 10) + 0");
        Assert.equal(b.add(17858999000), 17858999010, "10 + 17858999000");
    }

    function add2() public {
        // only one throw because it use "assert" and burn all the gas
        bytes memory payload = abi.encodeWithSignature("add(uint256,uint256)", b, a);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(!success, "10 + (2**256 - 10)");

        payload = abi.encodeWithSignature("add(uint256,uint256)", b, b);
        (success, data) = address(proxy).call(payload);
        Assert.ok(success, "10 + 10");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 20, "10 + 10");

        Assert.equal(zero.add(1388832933), 1388832933, "0 + 1388832933");
        Assert.equal(a.add(8), 2**256 - 2, "(256*256 - 10) + 8");
    }

    function sub() public {
        Assert.equal(b - a, 20, "10 - (2**256 - 10)");

        bytes memory payload = abi.encodeWithSignature("sub(uint256,uint256)", 1000, 50);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "1000 - 50");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 950, "1000 - 50");

        payload = abi.encodeWithSignature("sub(uint256,uint256)", b, a);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "10 - (2**256 - 10)");

        payload = abi.encodeWithSignature("sub(uint256,uint256)", 0, a);
        (success, data) = address(proxy).call(payload);
        Assert.ok(!success, "0 - (2**256 - 10)");

        payload = abi.encodeWithSignature("sub(uint256,uint256)", a, a);
        (success, data) = address(proxy).call(payload);
        Assert.ok(success, "(2**256 - 10) - (2*256 + 10)");
        result = abi.decode(data, (uint256));
        Assert.equal(result, 0, "(2**256 - 10) - (2*256 + 10)");

        Assert.equal(a.sub(0), a, "(2*256 - 10) - 0");
        Assert.equal(zero.sub(0), 0, "0 - 0");
        Assert.equal(a.sub(b), 2**256 - 20, "(2**256 - 10) - 10");
        Assert.equal(b.sub(3), 7, "10 - 3");
        Assert.equal(a.sub(24), 2**256 - 34, "(2**256 - 10) - 24");
    }

    function mul1() public {
        uint256 c = 2**200;
        Assert.equal(c * c, 0, "(2**200) * (2**200)");

        bytes memory payload = abi.encodeWithSignature("mul(uint256,uint256)", 1000, 50);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "1000 * 50");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 50000, "1000 * 50");

        payload = abi.encodeWithSignature("mul(uint256,uint256)", c, c);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "(2**200) * (2**200)");

        Assert.equal(zero.mul(a), 0, "(2**256 - 10) * 0");
        Assert.equal(b.mul(0), 0, "10 * 0");
        Assert.equal(c.mul(2), 2**201, "(2**200) * 2");
    }

    function mul2() public {
        bytes memory payload = abi.encodeWithSignature("mul(uint256,uint256)", b, a);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(!success, "10 * (2**256 - 10)");

        payload = abi.encodeWithSignature("mul(uint256,uint256)", b, b);
        (success, data) = address(proxy).call(payload);
        Assert.ok(success, "10 * 10");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 100, "10 * 10");

        Assert.equal(b.mul(1000000000), 10000000000, "10 * 1000000000");
        Assert.equal(zero.mul(0), 0, "0 * 0");
        Assert.equal(a.mul(1), a, "(2**256 - 10) * 1");
    }

    function div() public {
        bytes memory payload = abi.encodeWithSignature("div(uint256,uint256)", 1000, 50);
        (bool success, bytes memory data) = address(proxy).call(payload);
        Assert.ok(success, "1000 / 50");
        uint256 result = abi.decode(data, (uint256));
        Assert.equal(result, 20, "1000 / 50");

        payload = abi.encodeWithSignature("div(uint256,uint256)", b, 0);
        (success,) = address(proxy).call(payload);
        Assert.ok(!success, "10 / 0");

        payload = abi.encodeWithSignature("div(uint256,uint256)", 1000, 13);
        (success, data) = address(proxy).call(payload);
        Assert.ok(success, "1000 / 13");
        result = abi.decode(data, (uint256));
        Assert.equal(result, 76, "1000 / 13");

        Assert.equal(zero.div(10), 0, "0 / 10");
        Assert.equal(a.div(a), 1, "(2**256 - 10) / (2**256 - 10)");
        uint256 c = 2**200;
        Assert.equal(c.div(2**100), 2**100, "(2**200) / (2**100)");
        Assert.equal(b.div(11), 0, "10 / 11");
        Assert.equal(b.div(7), 1, "10 / 7");
    }
}

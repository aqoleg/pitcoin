pragma solidity ^0.6.6;

import "./Token.sol";
import "./Proxy.sol";


contract Test1 {
    Token private token;
    Proxy private a;
    Proxy private b;
    Proxy private c;

    constructor() public payable {
    }

    function init() public {
        token = new Token("name", "S");
        a = new Proxy(address(token));
        b = new Proxy(address(token));
        c = new Proxy(address(token));
        (bool successful, ) = address(a).call{value: 10000000000000000000, gas: 200000}("");
        require(successful);
        (successful, ) = address(b).call{value: 10000000000000000000, gas: 200000}("");
        require(successful);
        (successful, ) = address(c).call{value: 10000000000000000000, gas: 200000}("");
        require(successful);
    }

    function test() public {
        // a.bal = 0
        // a.div = 0
        // a.ref = 0
        // a.wei = 10,000000000,000000000
        // b.bal = 0
        // b.div = 0
        // b.ref = 0
        // b.wei = 10,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,000000000,000000000

        a.send(1000000000000000000); // 1
        // a.bal = 0 + 10,000000000,000000000 = 10,000000000,000000000
        // a.div = 0
        // a.ref = 0
        // a.wei = 10,000000000,000000000 - 1,000000000,000000000 = 9,000000000,000000000
        // b.bal = 0
        // b.div = 0
        // b.ref = 0
        // b.wei = 10,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,000000000,000000000
        (uint256 balance,, uint256 dividends, uint256 refDividends, uint256 weiBalance) = a.data();
        require(balance == 10000000000000000000);
        require(dividends == 0);
        require(refDividends == 0);
        require(weiBalance == 9000000000000000000);

        b.buy(address(a), 2000000000000000000); // 2
        // a.bal = 10,000000000,000000000
        // a.div = 0 + 1,399999999,999999999 = 1,399999999,999999999
        // a.ref = 0 + 600000000,000000000 = 600000000,000000000
        // a.wei = 9,000000000,000000000
        // b.bal = 0 + 18,000000000,000000000 = 18,000000000,000000000
        // b.div = 0
        // b.ref = 0
        // b.wei = 10,000000000,000000000 - 2,000000000,000000000 = 8,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,000000000,000000000
        (,, dividends, refDividends,) = a.data();
        require(dividends == 1399999999999999999);
        require(refDividends == 600000000000000000);
        (balance,, dividends, refDividends, weiBalance) = b.data();
        require(balance == 18000000000000000000);
        require(dividends == 0);
        require(refDividends == 0);
        require(weiBalance == 8000000000000000000);

        b.transfer(address(c), 1000000000000000000); // 1
        // a.bal = 10,000000000,000000000
        // a.div = 1,399999999,999999999 + 18552875,695732839 = 1,418552875,695732838
        // a.ref = 600000000,000000000
        // a.wei = 9,000000000,000000000
        // b.bal = 18,000000000,000000000 - 1,050000000,000000000 = 16,950000000,000000000
        // b.div = 0 + 31447124,304267160 = 31447124,304267160
        // b.ref = 0
        // b.wei = 8,000000000,000000000
        // c.bal = 0 + 1,000000000,000000000 = 1,000000000,000000000
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,000000000,000000000
        (,, dividends,,) = a.data();
        require(dividends == 1418552875695732838);
        (balance,, dividends,,) = b.data();
        require(balance == 16950000000000000000);
        require(dividends == 31447124304267160);
        (balance,, dividends, refDividends, weiBalance) = c.data();
        require(balance == 1000000000000000000);
        require(dividends == 0);
        require(refDividends == 0);
        require(weiBalance == 10000000000000000000);

        b.approve(address(c), 1000000000000000000); // 1
        c.transferFrom(address(b), address(a), 900000000000000000); // 0.9
        require(token.allowance(address(b), address(c)) == 100000000000000000); // 0.1
        // a.bal = 10,000000000,000000000 + 900000000,000000000 = 10,900000000,000000000
        // a.div = 1,418552875,695732838 + 16663580,818366969 = 1,435216456,514099807
        // a.ref = 600000000,000000000
        // a.wei = 9,000000000,000000000
        // b.bal = 16,950000000,000000000 - 945000000,000000000 = 16,005000000,000000000
        // b.div = 31447124,304267160 + 26670061,099796333 = 58117185,404063493
        // b.ref = 0
        // b.wei = 8,000000000,000000000
        // c.bal = 1,000000000,000000000
        // c.div = 0 + 1666358,081836697 = 1666358,081836697
        // c.ref = 0
        // c.wei = 10,000000000,000000000
        (balance,, dividends,,) = a.data();
        require(balance == 10900000000000000000);
        require(dividends == 1435216456514099807);
        (balance,, dividends,,) = b.data();
        require(balance == 16005000000000000000);
        require(dividends == 58117185404063493);
        (,, dividends,,) = c.data();
        require(dividends == 1666358081836697);

        a.withdraw();
        // a.bal = 10,900000000,000000000
        // a.div = 1,435216456,514099807 - 1,435216456,514099807 = 0
        // a.ref = 600000000,000000000 - 600000000,000000000 = 0
        // a.wei = 9,000000000,000000000 + 203521645,651409980 = 9,203521645,651409980
        // b.bal = 16,005000000,000000000
        // b.div = 58117185,404063493
        // b.ref = 0
        // b.wei = 8,000000000,000000000
        // c.bal = 1,000000000,000000000
        // c.div = 1666358,081836697
        // c.ref = 0
        // c.wei = 10,000000000,000000000
        require(token.totalSupply() == 27905000000000000000); // 27.905
        (,, dividends, refDividends, weiBalance) = a.data();
        require(dividends == 0);
        require(refDividends == 0);
        require(weiBalance == 9203521645651409980);

        a.buy(address(b), 1000000000000000000); // 1
        // a.bal = 10,900000000,000000000 + 9,000000000,000000000 = 19,900000000,000000000
        // a.div = 0 + 273427701,128829958 = 273427701,128829958
        // a.ref = 0
        // a.wei = 9,203521645,651409980 - 1,000000000,000000000 = 8,203521645,651409980
        // b.bal = 16,005000000,000000000
        // b.div = 58117185,404063493 + 401487188,675864540 = 459604374,079928033
        // b.ref = 0 + 300000000,000000000 = 300000000,000000000
        // b.wei = 8,000000000,000000000
        // c.bal = 1,000000000,000000000
        // c.div = 1666358,081836697 + 25085110,195305501 = 26751468,277142198
        // c.ref = 0
        // c.wei = 10,000000000,000000000
        (balance,, dividends,, weiBalance) = a.data();
        require(balance == 19900000000000000000);
        require(dividends == 273427701128829958);
        require(weiBalance == 8203521645651409980);
        (,, dividends, refDividends,) = b.data();
        require(dividends == 459604374079928033);
        require(refDividends == 300000000000000000);
        (,, dividends,,) = c.data();
        require(dividends == 26751468277142198);

        c.sell(1000000000000000000); // 1
        c.withdraw();
        // a.bal = 19,900000000,000000000
        // a.div = 273427701,128829958 + 55424035,649630970 = 328851736,778460928
        // a.ref = 0
        // a.wei = 8,203521645,651409980
        // b.bal = 16,005000000,000000000
        // b.div = 459604374,079928033 + 44575964,350369029 = 504180338,430297062
        // b.ref = 300000000,000000000
        // b.wei = 8,000000000,000000000
        // c.bal = 1,000000000,000000000 - 1,000000000,000000000 = 0
        // c.div = 26751468,277142198 - 26751468,277142198 = 0
        // c.ref = 0
        // c.wei = 10,000000000,000000000 + 92675146,827714219 = 10,092675146,827714219
        (,, dividends,,) = a.data();
        require(dividends == 328851736778460928);
        (,, dividends,,) = b.data();
        require(dividends == 504180338430297062);
        (balance,, dividends,, weiBalance) = c.data();
        require(balance == 0);
        require(dividends == 0);
        require(weiBalance == 10092675146827714219);
    }
}
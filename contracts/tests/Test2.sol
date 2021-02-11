pragma solidity ^0.6.6;

import "./Token.sol";
import "./Proxy.sol";


contract Test2 {
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
        address(a).call{value: 10000000000000000000, gas: 200000}("");
        address(b).call{value: 10000000000000000000, gas: 200000}("");
        address(c).call{value: 10000000000000000000, gas: 200000}("");
        a.send(1000000000000000000);
        b.buy(address(a), 2000000000000000000);
        b.transfer(address(c), 1000000000000000000);
        b.approve(address(c), 1000000000000000000);
        c.transferFrom(address(b), address(a), 900000000000000000);
        a.withdraw();
        a.buy(address(b), 1000000000000000000);
        c.sell(1000000000000000000);
        c.withdraw();
    }

    function test() public {
        // a.bal = 19,900000000,000000000
        // a.div = 328851736,778460928
        // a.ref = 0
        // a.wei = 8,203521645,651409980
        // b.bal = 16,005000000,000000000
        // b.div = 504180338,430297062
        // b.ref = 300000000,000000000
        // b.wei = 8,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,092675146,827714219
        require(a.contractBalance() == 3703803207520875801);

        b.reinvest();
        // a.bal = 19,900000000,000000000
        // a.div = 328851736,778460928
        // a.ref = 0
        // a.wei = 8,203521645,651409980
        // b.bal = 16,005000000,000000000 + 804180338,430297062 = 16,809180338,430297062
        // b.div = 504180338,430297062 - 504180338,430297062 = 0
        // b.ref = 300000000,000000000 - 300000000,000000000 = 0
        // b.wei = 8,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,092675146,827714219
        (uint256 balance,, uint256 dividends, uint256 refDividends, uint256 weiBalance) = b.data();
        require(balance == 16809180338430297062);
        require(dividends == 0);
        require(refDividends == 0);
        require(weiBalance == 8000000000000000000);

        a.sell(19900000000000000000); // 19.9
        // a.bal = 19,900000000,000000000 - 19,900000000,000000000 = 0
        // a.div = 328851736,778460928 + 17,910000000,000000000 = 18,238851736,778460928
        // a.ref = 0
        // a.wei = 8,203521645,651409980
        // b.bal = 16,809180338,430297062
        // b.div = 0 + 1,990000000,000000000 = 1,990000000,000000000
        // b.ref = 0
        // b.wei = 8,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,092675146,827714219
        (balance,, dividends,,) = a.data();
        require(balance == 0);
        require(dividends == 18238851736778460928);
        (,, dividends,,) = b.data();
        require(dividends == 1990000000000000000);

        a.withdraw();
        b.sell(6000000000000000000); // 6
        // a.bal = 0
        // a.div = 18,238851736,778460928 - 18,238851736,778460928 = 0
        // a.ref = 0
        // a.wei = 8,203521645,651409980 + 1,823885173,677846092 = 10,027406819,329256072
        // b.bal = 16,809180338,430297062 - 6,000000000,000000000 = 10,809180338,430297062
        // b.div = 1,990000000,000000000 + 5,999999999,999999999 = 7,989999999,999999999
        // b.ref = 0
        // b.wei = 8,000000000,000000000
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,092675146,827714219
        (,, dividends,, weiBalance) = a.data();
        require(dividends == 0);
        require(weiBalance == 10027406819329256072);
        (balance,, dividends, refDividends, weiBalance) = b.data();
        require(balance == 10809180338430297062);
        require(dividends == 7989999999999999999);

        b.withdraw();
        // a.bal = 0
        // a.div = 0
        // a.ref = 0
        // a.wei = 10,027406819,329256072
        // b.bal = 10,809180338,430297062
        // b.div = 7,989999999,999999999 - 7,989999999,999999999 = 0
        // b.ref = 0
        // b.wei = 8,000000000,000000000 + 798999999,999999999 = 8,798999999,999999999
        // c.bal = 0
        // c.div = 0
        // c.ref = 0
        // c.wei = 10,092675146,827714219
        (,, dividends,, weiBalance) = b.data();
        require(dividends == 0);
        require(weiBalance == 8798999999999999999);

        require(token.totalSupply() == 10809180338430297062);
        require(a.contractBalance() == 1080918033843029710);
    }
}
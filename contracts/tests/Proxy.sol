pragma solidity ^0.6.6;


interface TokenInterface {
    function clean(address _contract, uint256 _value) external;

    function sell(uint256 _tokens) external;

    function withdraw() external;

    function reinvest() external;

    function buy(address _ref) external payable;

    function transfer(address _to, uint256 _value) external returns (bool);

    function transferFrom(address _from, address _to, uint256 _value) external returns (bool);

    function approve(address _spender, uint256 _value) external returns (bool);

    function balanceOf(address _owner) external view returns (uint256);

    function payoutsOf(address _owner) external view returns (int256);

    function dividendsOf(address _owner) external view returns (uint256);

    function refDividendsOf(address _owner) external view returns (uint256);
}


contract Proxy {
    TokenInterface private token;

    constructor(address _token) public payable {
        token = TokenInterface(_token);
    }

    receive() external payable {
    }

    function send(uint256 _wei) external {
        (bool successful, ) = address(token).call{value: _wei, gas: 200000}("");
        require(successful, "throw");
    }

    function clean(address _contract, uint256 _value) external {
        token.clean(_contract, _value);
    }

    function sell(uint256 _tokens) external {
        token.sell(_tokens);
    }

    function withdraw() external {
        token.withdraw();
    }

    function reinvest() external {
        token.reinvest();
    }

    function buy(address _ref, uint256 _wei) external {
        token.buy{value: _wei}(_ref);
    }

    function transfer(address _to, uint256 _value) external {
        require(token.transfer(_to, _value), "false");
    }

    function transferFrom(address _from, address _to, uint256 _value) external {
        require(token.transferFrom(_from, _to, _value), "false");
    }

    function approve(address _spender, uint256 _value) external {
        require(token.approve(_spender, _value), "false");
    }

    function data() external view returns (
        uint256 _balance,
        int256 _payouts,
        uint256 _dividends,
        uint256 _refDividends,
        uint256 _wei
    ) {
        return (
            token.balanceOf(address(this)),
            token.payoutsOf(address(this)),
            token.dividendsOf(address(this)),
            token.refDividendsOf(address(this)),
            address(this).balance
        );
    }

    function contractBalance() external view returns (uint256) {
        return address(token).balance;
    }
}
"use strict";

(function () {
    var network = null;

    window.onload = function () {
        var script = document.createElement("script");
        script.src = "../assets/web3.min.js";
        script.onload = function () {
            if (typeof window.ethereum === "undefined") {
                alert("no-ethereum browser detected");
            } else {
                document.getElementById("write").onclick = write;
                document.getElementById("verify").onclick = verify;

                window.web3 = new Web3(ethereum);
                ethereum.on("networkChanged", function (newNetwork) {
                    network = Number(newNetwork);
                    document.getElementById("writeMessage").innerHTML = "";
                    document.getElementById("verifyMessage").innerHTML = "";
                });
                ethereum.autoRefreshOnNetworkChange = false;
            }
        }
        document.body.appendChild(script);
    }

    function write() {
        var name = document.getElementById("name").value;
        if (name === "") {
            document.getElementById("name").placeholder = "enter name";
            return;
        }
        var symbol = document.getElementById("symbol").value;
        if (symbol === "") {
            document.getElementById("symbol").placeholder = "enter symbol";
            return;
        }
        document.getElementById("write").onclick = "";

        var account;
        ethereum.enable().then(function (accounts) {
            account = accounts[0];
            return web3.eth.net.getId();
        }).then(function (newNetwork) {
            network = Number(newNetwork);
            deploy(account, name, symbol);
        }).catch(function (error) {
            alert(error.message);
            document.getElementById("write").onclick = write;
        });
    }

    function deploy(account, name, symbol) {
        var bytecode = "60806040523480156200001157600080fd5b506040516200262138038062002621833981810160405260408110156200003757600080fd5b81019080805160405193929190846401000000008211156200005857600080fd5b838201915060208201858111156200006f57600080fd5b82518660018202830111640100000000821117156200008d57600080fd5b8083526020830192505050908051906020019080838360005b83811015620000c3578082015181840152602081019050620000a6565b50505050905090810190601f168015620000f15780820380516001836020036101000a031916815260200191505b50604052602001805160405193929190846401000000008211156200011557600080fd5b838201915060208201858111156200012c57600080fd5b82518660018202830111640100000000821117156200014a57600080fd5b8083526020830192505050908051906020019080838360005b838110156200018057808201518184015260208101905062000163565b50505050905090810190601f168015620001ae5780820380516001836020036101000a031916815260200191505b506040525050508160039080519060200190620001cd929190620001ef565b508060049080519060200190620001e6929190620001ef565b5050506200029e565b828054600181600116156101000203166002900490600052602060002090601f016020900481019282601f106200023257805160ff191683800117855562000263565b8280016001018555821562000263579182015b828111156200026257825182559160200191906001019062000245565b5b50905062000272919062000276565b5090565b6200029b91905b80821115620002975760008160009055506001016200027d565b5090565b90565b61237380620002ae6000396000f3fe60806040526004361061012c5760003560e01c806395d89b41116100ab578063d2fe23bb1161006f578063d2fe23bb14610693578063d74e5efa146106be578063dd62ed3e146106e9578063e4849b321461076e578063f088d547146107a9578063fdb5a03e146107ed5761013d565b806395d89b411461049b578063a035b1fe1461052b578063a54cbf7714610556578063a9059cbb146105bb578063b7d45a151461062e5761013d565b806323b872dd116100f257806323b872dd14610300578063313ce567146103935780633ccfd60b146103c45780634f56133e146103db57806370a08231146104365761013d565b806265318b14610142578062fa081a146101a757806306fdde03146101d2578063095ea7b31461026257806318160ddd146102d55761013d565b3661013d5761013b6000610804565b005b600080fd5b34801561014e57600080fd5b506101916004803603602081101561016557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610d99565b6040518082815260200191505060405180910390f35b3480156101b357600080fd5b506101bc610ea0565b6040518082815260200191505060405180910390f35b3480156101de57600080fd5b506101e7610ead565b6040518080602001828103825283818151815260200191508051906020019080838360005b8381101561022757808201518184015260208101905061020c565b50505050905090810190601f1680156102545780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561026e57600080fd5b506102bb6004803603604081101561028557600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff16906020019092919080359060200190929190505050610f4b565b604051808215151515815260200191505060405180910390f35b3480156102e157600080fd5b506102ea6110df565b6040518082815260200191505060405180910390f35b34801561030c57600080fd5b506103796004803603606081101561032357600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506110e5565b604051808215151515815260200191505060405180910390f35b34801561039f57600080fd5b506103a861120c565b604051808260ff1660ff16815260200191505060405180910390f35b3480156103d057600080fd5b506103d9611211565b005b3480156103e757600080fd5b50610434600480360360408110156103fe57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291908035906020019092919050505061146e565b005b34801561044257600080fd5b506104856004803603602081101561045957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611511565b6040518082815260200191505060405180910390f35b3480156104a757600080fd5b506104b0611529565b6040518080602001828103825283818151815260200191508051906020019080838360005b838110156104f05780820151818401526020810190506104d5565b50505050905090810190601f16801561051d5780820380516001836020036101000a031916815260200191505b509250505060405180910390f35b34801561053757600080fd5b506105406115c7565b6040518082815260200191505060405180910390f35b34801561056257600080fd5b506105a56004803603602081101561057957600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115cc565b6040518082815260200191505060405180910390f35b3480156105c757600080fd5b50610614600480360360408110156105de57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803590602001909291905050506115e4565b604051808215151515815260200191505060405180910390f35b34801561063a57600080fd5b5061067d6004803603602081101561065157600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff1690602001909291905050506115fb565b6040518082815260200191505060405180910390f35b34801561069f57600080fd5b506106a8611613565b6040518082815260200191505060405180910390f35b3480156106ca57600080fd5b506106d3611619565b6040518082815260200191505060405180910390f35b3480156106f557600080fd5b506107586004803603604081101561070c57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050611625565b6040518082815260200191505060405180910390f35b34801561077a57600080fd5b506107a76004803603602081101561079157600080fd5b810190808035906020019092919050505061164a565b005b6107eb600480360360208110156107bf57600080fd5b81019080803573ffffffffffffffffffffffffffffffffffffffff169060200190929190505050610804565b005b3480156107f957600080fd5b5061080261198e565b005b600061081a600a34611cf190919063ffffffff16565b90506000610832600a83611d2890919063ffffffff16565b90506108478183611d3c90919063ffffffff16565b9150600073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff1614610ab3573373ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff16141561091f576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f5f7265662069732073656e64657200000000000000000000000000000000000081525060200191505060405180910390fd5b678ac7230489e80000600160008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205410156109dc576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f736d616c6c2062616c616e63650000000000000000000000000000000000000081525060200191505060405180910390fd5b6000610a05600a6109f7600385611cf190919063ffffffff16565b611d2890919063ffffffff16565b9050610a1a8183611d3c90919063ffffffff16565b9150610a6e81600760008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611dbf90919063ffffffff16565b600760008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550505b60008090506000805414610b1357610af1600054610ae36801000000000000000085611cf190919063ffffffff16565b611d2890919063ffffffff16565b9050610b0881600554611dbf90919063ffffffff16565b600581905550610b29565b610b268284611dbf90919063ffffffff16565b92505b610b7b83600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611dbf90919063ffffffff16565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550610bd383600054611dbf90919063ffffffff16565b6000819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a36000610c7168010000000000000000610c6360055487611cf190919063ffffffff16565b611d2890919063ffffffff16565b9050610cc581600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ddb90919063ffffffff16565b600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff167f89f5adc174562e07c9c9b1cae7109bbecb21cf9d1b2847e550042b8653c54a0e868685604051808473ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001838152602001828152602001935050505060405180910390a25050505050565b600080610e0b68010000000000000000610dfd600554600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611cf190919063ffffffff16565b611d2890919063ffffffff16565b90506000600660008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205490506000811215610e7957610e708160000383611dbf90919063ffffffff16565b92505050610e9b565b600081905082811115610e925760009350505050610e9b565b80830393505050505b919050565b6801000000000000000081565b60038054600181600116156101000203166002900480601f016020809104026020016040519081016040528092919081815260200182805460018160011615610100020316600290048015610f435780601f10610f1857610100808354040283529160200191610f43565b820191906000526020600020905b815481529060010190602001808311610f2657829003601f168201915b505050505081565b60008073ffffffffffffffffffffffffffffffffffffffff168373ffffffffffffffffffffffffffffffffffffffff161415610fef576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f7a65726f205f7370656e6465720000000000000000000000000000000000000081525060200191505060405180910390fd5b81600260003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060008573ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055508273ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167f8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0f7b2291e5b200ac8c7c3b925846040518082815260200191505060405180910390a36001905092915050565b60005481565b600061117682600260008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611d3c90919063ffffffff16565b600260008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002060003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611201848484611df7565b600190509392505050565b601281565b600061121c33610d99565b905061127081600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ddb90919063ffffffff16565b600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611305600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205482611dbf90919063ffffffff16565b90506000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060008114156113c3576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f7a65726f206469766964656e647300000000000000000000000000000000000081525060200191505060405180910390fd5b3373ffffffffffffffffffffffffffffffffffffffff167f884edad9ce6fa2440d8a54cc123490eb96d2768479d49ff9c7366125a9424364826040518082815260200191505060405180910390a23373ffffffffffffffffffffffffffffffffffffffff166108fc61143f600a84611d2890919063ffffffff16565b9081150290604051600060405180830381858888f1935050505015801561146a573d6000803e3d6000fd5b5050565b8173ffffffffffffffffffffffffffffffffffffffff1663a9059cbb33836040518363ffffffff1660e01b8152600401808373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200182815260200192505050600060405180830381600087803b1580156114f557600080fd5b505af1158015611509573d6000803e3d6000fd5b505050505050565b60016020528060005260406000206000915090505481565b60048054600181600116156101000203166002900480601f0160208091040260200160405190810160405280929190818152602001828054600181600116156101000203166002900480156115bf5780601f10611594576101008083540402835291602001916115bf565b820191906000526020600020905b8154815290600101906020018083116115a257829003601f168201915b505050505081565b600a81565b60066020528060005260406000206000915090505481565b60006115f1338484611df7565b6001905092915050565b60076020528060005260406000206000915090505481565b60055481565b678ac7230489e8000081565b6002602052816000526040600020602052806000526040600020600091509150505481565b6000611660600a83611d2890919063ffffffff16565b905060006116778284611d3c90919063ffffffff16565b90506116cb83600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611d3c90919063ffffffff16565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061172383600054611d3c90919063ffffffff16565b6000819055506000805414156117a1576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260118152602001807f7a65726f20746f74616c20737570706c7900000000000000000000000000000081525060200191505060405180910390fd5b600073ffffffffffffffffffffffffffffffffffffffff163373ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3600061184b61183c6801000000000000000061182e60055488611cf190919063ffffffff16565b611d2890919063ffffffff16565b83611dbf90919063ffffffff16565b905061189f81600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461232190919063ffffffff16565b600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060006119146000546119066801000000000000000087611cf190919063ffffffff16565b611d2890919063ffffffff16565b905061192b81600554611dbf90919063ffffffff16565b6005819055503373ffffffffffffffffffffffffffffffffffffffff167fed7a144fad14804d5c249145e3e0e2b63a9eb455b76aee5bc92d711e9bba3e4a8683604051808381526020018281526020019250505060405180910390a25050505050565b600061199933610d99565b905060006119ef600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205483611dbf90919063ffffffff16565b90506000600760003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055506000811415611aad576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600e8152602001807f7a65726f206469766964656e647300000000000000000000000000000000000081525060200191505060405180910390fd5b611aff81600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611dbf90919063ffffffff16565b600160003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611b5781600054611dbf90919063ffffffff16565b6000819055503373ffffffffffffffffffffffffffffffffffffffff16600073ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef836040518082815260200191505060405180910390a36000611c07611bf868010000000000000000611bea60055486611cf190919063ffffffff16565b611d2890919063ffffffff16565b84611dbf90919063ffffffff16565b9050611c5b81600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ddb90919063ffffffff16565b600660003373ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff167fbd654390d0d973e8c8376ed6053be8658870df892687852cc5c914d700291b87836040518082815260200191505060405180910390a2505050565b600080831415611d045760009050611d22565b6000828402905082848281611d1557fe5b0414611d1d57fe5b809150505b92915050565b6000818381611d3357fe5b04905092915050565b600082821115611db4576040517f08c379a000000000000000000000000000000000000000000000000000000000815260040180806020018281038252600d8152602001807f746f6f206269672076616c75650000000000000000000000000000000000000081525060200191505060405180910390fd5b818303905092915050565b600080828401905083811015611dd157fe5b8091505092915050565b600080828401905083811215611ded57fe5b8091505092915050565b600073ffffffffffffffffffffffffffffffffffffffff168273ffffffffffffffffffffffffffffffffffffffff161415611e9a576040517f08c379a00000000000000000000000000000000000000000000000000000000081526004018080602001828103825260088152602001807f7a65726f205f746f00000000000000000000000000000000000000000000000081525060200191505060405180910390fd5b6000611eb0601483611d2890919063ffffffff16565b90506000611ec78284611dbf90919063ffffffff16565b9050611f1b81600160008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611d3c90919063ffffffff16565b600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002081905550611fb083600160008773ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611dbf90919063ffffffff16565b600160008673ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555061200882600054611d3c90919063ffffffff16565b6000819055508373ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef856040518082815260200191505060405180910390a3600073ffffffffffffffffffffffffffffffffffffffff168573ffffffffffffffffffffffffffffffffffffffff167fddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef846040518082815260200191505060405180910390a3600061210b680100000000000000006120fd60055485611cf190919063ffffffff16565b611d2890919063ffffffff16565b905061215f81600660008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000205461232190919063ffffffff16565b600660008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff1681526020019081526020016000208190555060006121e66121bc86600054611d3c90919063ffffffff16565b6121d86801000000000000000087611cf190919063ffffffff16565b611d2890919063ffffffff16565b90506121fd81600554611dbf90919063ffffffff16565b6005819055506122336801000000000000000061222560055488611cf190919063ffffffff16565b611d2890919063ffffffff16565b915061228782600660008973ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff16815260200190815260200160002054611ddb90919063ffffffff16565b600660008873ffffffffffffffffffffffffffffffffffffffff1673ffffffffffffffffffffffffffffffffffffffff168152602001908152602001600020819055503373ffffffffffffffffffffffffffffffffffffffff167f30a3c50752f2552dcc2b93f5b96866280816a986c0c0408cb6778b9fa198288f826040518082815260200191505060405180910390a250505050505050565b60008082840390508381131561233357fe5b809150509291505056fea26469706673582212208fe178f4f5026beeb9606ad79501ab5dac3912d1261efb2eb85be16d958e212a64736f6c63430006060033";
        var abi = [
            {
                "inputs": [
                    {
                        "internalType": "string",
                        "name": "_name",
                        "type": "string"
                    },
                    {
                        "internalType": "string",
                        "name": "_symbol",
                        "type": "string"
                    }
                ],
                "stateMutability": "nonpayable",
                "type": "constructor"
            }
        ];

        var waitMessage;
        new web3.eth.Contract(abi).deploy({
            data: bytecode,
            arguments: [name, symbol]
        }).send({
            from: account
        }).on("transactionHash", function (hash) {
            document.getElementById("name").placeholder = "";
            document.getElementById("symbol").placeholder = "";
            document.getElementById("write").onclick = write;
            waitMessage = document.createElement("span");
            waitMessage.innerHTML = " waiting confirmation...";
            var message = getMessage(hash, "tx/" + hash, waitMessage);
            document.getElementById("writeMessage").appendChild(message);
        }).on("error", function (error, receipt) {
            alert(error.message);
            document.getElementById("write").onclick = write;
            if (waitMessage) {
                waitMessage.innerHTML = " error";
            }
        }).then(function (contract) {
            var address = contract.options.address;
            waitMessage.innerHTML = " confirmed";
            var message = getMessage(address, "address/" + address);
            document.getElementById("writeMessage").appendChild(message);
            document.getElementById("address").value = address;
        });
    }

    function verify() {
        var name = document.getElementById("name").value;
        if (name === "") {
            document.getElementById("name").placeholder = "enter name";
            return;
        }
        var symbol = document.getElementById("symbol").value;
        if (symbol === "") {
            document.getElementById("symbol").placeholder = "enter symbol";
            return;
        }
        var address = document.getElementById("address").value;
        if (!web3.utils.isAddress(address)) {
            document.getElementById("address").value = "";
            document.getElementById("address").placeholder = "enter correct address";
            return;
        }

        var arguements = web3.eth.abi.encodeParameters(
            ["string", "string"],
            [name, symbol]
        ).substring(2);

        var comments = document.getElementById("comments").value;
        document.getElementById("verify").onclick = "";
        var code = 'pragma solidity ^0.6.6;\n\n\ninterface Erc20 {\n    function transfer(address _to, uint256 _value) external;\n}\n\n\nlibrary Math {\n    /// @return uint256 = a + b\n    function add(uint256 a, uint256 b) internal pure returns (uint256) {\n        uint256 c = a + b;\n        assert(c >= a);\n        return c;\n    }\n\n    /// @return uint256 = a - b\n    function sub(uint256 a, uint256 b) internal pure returns (uint256) {\n        require(b <= a, "too big value");\n        return a - b;\n    }\n\n    /// @return uint256 = a * b\n    function mul(uint256 a, uint256 b) internal pure returns (uint256) {\n        if (a == 0) {\n            return 0;\n        }\n        uint256 c = a * b;\n        assert(c / a == b);\n        return c;\n    }\n\n    /// @return uint256 = a / b\n    function div(uint256 a, uint256 b) internal pure returns (uint256) {\n        return a / b;\n    }\n\n    /// @return int256 = a + b\n    function signedAdd(int256 a, uint256 b) internal pure returns (int256) {\n        int256 c = a + int256(b);\n        assert(c >= a);\n        return c;\n    }\n\n    /// @return int256 = a - b\n    function signedSub(int256 a, uint256 b) internal pure returns (int256) {\n        int256 c = a - int256(b);\n        assert(c <= a);\n        return c;\n    }\n}\n\n\ncontract Token {\n    using Math for uint256;\n    using Math for int256;\n\n    uint256 public totalSupply; // tokens, erc20\n    mapping(address => uint256) public balanceOf; // tokens, erc20\n    mapping(address => mapping(address => uint256)) public allowance; // tokens = allowance[owner][spender], erc20\n    uint8 public constant decimals = 18; // erc20\n    string public name; // erc20\n    string public symbol; // erc20\n\n    // wei*price = totalSupply + totalSupply*profitPerToken/multiplicator - sum(payoutsOf) + sum(refDividendsOf)\n    // dividendsOf = balanceOf*profitPerToken/multiplicator - payoutsOf\n    // allDividends = dividendsOf + refDividendsOf\n    uint256 public constant price = 10; // tokens/wei\n    uint256 public profitPerToken;\n    uint256 public constant multiplicator = 2**64;\n    mapping(address => int256) public payoutsOf; // tokens\n    mapping(address => uint256) public refDividendsOf; // tokens\n    uint256 public constant refRequirement = 10**19; // tokens\n\n    /// @dev erc20\n    event Transfer(address indexed _from, address indexed _to, uint256 _value);\n\n    /// @dev erc20\n    event Approval(address indexed _owner, address indexed _spender, uint256 _value);\n\n    /// @param _increase increase of the dividends, tokens*2**-64\n    event Sell(address indexed _seller, uint256 _value, uint256 _increase);\n\n    event Withdraw(address indexed _owner, uint256 _value);\n\n    event Reinvest(address indexed _owner, uint256 _value);\n\n    /// @param _increase increase of the dividends, tokens*2**-64\n    event Buy(address indexed _buyer, address _referral, uint256 _tokens, uint256 _increase);\n\n    /// @param _increase increase of the dividends, tokens*2**-64\n    event Send(address indexed _sender, uint256 _increase);\n\n    constructor(string memory _name, string memory _symbol) public {\n        name = _name;\n        symbol = _symbol;\n    }\n\n    /// @notice converts 90% of incoming eth in tokens, spreads rest as dividends\n    receive() external payable {\n        buy(address(0));\n    }\n\n    /// @notice keep clean from other tokens\n    function clean(address _contract, uint256 _value) external {\n        Erc20(_contract).transfer(msg.sender, _value);\n    }\n\n    /// @notice converts 90% in user dividends, spreads rest as dividends\n    function sell(uint256 _tokens) external {\n        // w*pr = T + T*ppt/m - P + R\n        // w*pr = T-t + (T-t)*(ppt + f*m/(T-t))/m - (P - ((t-f) + t*ppt/m)) + R\n\n        uint256 fee = _tokens.div(10);\n        uint256 withdraw = _tokens.sub(fee);\n\n        balanceOf[msg.sender] = balanceOf[msg.sender].sub(_tokens);\n        totalSupply = totalSupply.sub(_tokens);\n        require(totalSupply != 0, "zero total supply");\n        emit Transfer(msg.sender, address(0), _tokens);\n\n        uint256 payout = withdraw.add(_tokens.mul(profitPerToken).div(multiplicator));\n        payoutsOf[msg.sender] = payoutsOf[msg.sender].signedSub(payout);\n\n        uint256 increaseProfitPerToken = fee.mul(multiplicator).div(totalSupply);\n        profitPerToken = profitPerToken.add(increaseProfitPerToken);\n\n        emit Sell(msg.sender, _tokens, increaseProfitPerToken);\n    }\n\n    /// @notice withdraws all of the dividends, including referral\n    function withdraw() external {\n        // w*pr = T + T*ppt/m - P + R\n        // (w - (d+r)/pr)*pr = T + T*ppt/m - (P + d) + (R - r)\n\n        uint256 dividends = dividendsOf(msg.sender);\n        payoutsOf[msg.sender] = payoutsOf[msg.sender].signedAdd(dividends);\n\n        dividends = dividends.add(refDividendsOf[msg.sender]);\n        refDividendsOf[msg.sender] = 0;\n\n        require(dividends != 0, "zero dividends");\n\n        emit Withdraw(msg.sender, dividends);\n\n        msg.sender.transfer(dividends.div(price));\n    }\n\n    /// @notice converts all of the dividends (including referral) in tokens\n    function reinvest() external {\n        // w*pr = T + T*ppt/m - P + R\n        // w*pr = T+d+r + (T+d+r)*ppt/m - (P + d + (d+r)*ppt/m) + (R - r)\n\n        uint256 dividends = dividendsOf(msg.sender);\n\n        uint256 allDividends = dividends.add(refDividendsOf[msg.sender]);\n        refDividendsOf[msg.sender] = 0;\n\n        require(allDividends != 0, "zero dividends");\n\n        balanceOf[msg.sender] = balanceOf[msg.sender].add(allDividends);\n        totalSupply = totalSupply.add(allDividends);\n        emit Transfer(address(0), msg.sender, allDividends);\n\n        uint256 payout = dividends.add(allDividends.mul(profitPerToken).div(multiplicator));\n        payoutsOf[msg.sender] = payoutsOf[msg.sender].signedAdd(payout);\n\n        emit Reinvest(msg.sender, allDividends);\n    }\n\n    /// @notice converts 90% of incoming eth in tokens, spreads rest as dividends\n    /// @param _ref referral address that gets 3%, or zero address\n    function buy(address _ref) public payable {\n        // w*pr = T + T*ppt/m - P + R\n        // with ref\n        // in*pr = t + f + r\n        // (w + in)*pr = T+t + (T+t)*(ppt + f*m/T)/m - (P + t*(ppt + f*m/T)/m) + (R + r)\n        // no ref\n        // in*pr = t + f\n        // (w + in)*pr = T+t + (T+t)*(ppt + f*m/T)/m - (P + t*(ppt + f*m/T)/m) + R\n        // first\n        // in*pr = t\n        // (w + in)*pr = T+t + (T+t)*ppt/m - (P + t*ppt/m) + R\n\n        uint256 tokens = msg.value.mul(price);\n        uint256 fee = tokens.div(10);\n        tokens = tokens.sub(fee);\n\n        if (_ref != address(0)) {\n            require(_ref != msg.sender, "_ref is sender");\n            require(balanceOf[_ref] >= refRequirement, "small balance");\n            uint256 refBonus = fee.mul(3).div(10);\n            fee = fee.sub(refBonus);\n            refDividendsOf[_ref] = refDividendsOf[_ref].add(refBonus);\n        }\n\n        uint256 increaseProfitPerToken = 0;\n        if (totalSupply != 0) {\n            increaseProfitPerToken = fee.mul(multiplicator).div(totalSupply);\n            profitPerToken = profitPerToken.add(increaseProfitPerToken);\n        } else {\n            tokens = tokens.add(fee);\n        }\n\n        balanceOf[msg.sender] = balanceOf[msg.sender].add(tokens);\n        totalSupply = totalSupply.add(tokens);\n        emit Transfer(address(0), msg.sender, tokens);\n\n        uint256 payout = tokens.mul(profitPerToken).div(multiplicator);\n        payoutsOf[msg.sender] = payoutsOf[msg.sender].signedAdd(payout);\n\n        emit Buy(msg.sender, _ref, tokens, increaseProfitPerToken);\n    }\n\n    /// @notice transfers tokens, spreads plus 5% among all\n    /// @dev erc20\n    function transfer(address _to, uint256 _value) public returns (bool) {\n        send(msg.sender, _to, _value);\n\n        return true;\n    }\n\n    /// @notice transfers tokens, spreads plus 5% among all\n    /// @dev erc20\n    function transferFrom(address _from, address _to, uint256 _value) public returns (bool) {\n        allowance[_from][msg.sender] = allowance[_from][msg.sender].sub(_value);\n\n        send(_from, _to, _value);\n\n        return true;\n    }\n\n    /// @notice approves other address to spend your tokens\n    /// @dev erc20\n    function approve(address _spender, uint256 _value) public returns (bool) {\n        require(_spender != address(0), "zero _spender");\n\n        allowance[msg.sender][_spender] = _value;\n        emit Approval(msg.sender, _spender, _value);\n\n        return true;\n    }\n\n    /// @notice not including referral dividends\n    function dividendsOf(address _owner) public view returns (uint256) {\n        // dividendsOf = balanceOf*profitPerToken/multiplicator - payoutsOf\n\n        uint256 a = balanceOf[_owner].mul(profitPerToken).div(multiplicator);\n        int256 b = payoutsOf[_owner];\n        // a - b\n        if (b < 0) {\n            return a.add(uint256(-b));\n        } else {\n            uint256 c = uint256(b);\n            if (c > a) {\n                return 0;\n            }\n            return a - c;\n        }\n    }\n\n    function send(address _from, address _to, uint256 _value) private {\n        // w*pr = T + T*ppt/m - P + R\n        // newPpt = ppt + f*m/(T-v-f)\n        // w*pr = T-f + (T-f)*newPpt/m - (P - (v+f)*ppt/m + v*newPpt/m) + R\n\n        require(_to != address(0), "zero _to");\n        uint256 fee = _value.div(20);\n        uint256 cost = _value.add(fee);\n\n        balanceOf[_from] = balanceOf[_from].sub(cost);\n        balanceOf[_to] = balanceOf[_to].add(_value);\n        totalSupply = totalSupply.sub(fee);\n        emit Transfer(_from, _to, _value);\n        emit Transfer(_from, address(0), fee);\n\n        uint256 payout = cost.mul(profitPerToken).div(multiplicator);\n        payoutsOf[_from] = payoutsOf[_from].signedSub(payout);\n\n        uint256 increaseProfitPerToken = fee.mul(multiplicator).div(totalSupply.sub(_value));\n        profitPerToken = profitPerToken.add(increaseProfitPerToken);\n\n        payout = _value.mul(profitPerToken).div(multiplicator);\n        payoutsOf[_to] = payoutsOf[_to].signedAdd(payout);\n\n        emit Send(msg.sender, increaseProfitPerToken);\n    }\n}';
        if (comments !== "") {
            code = "/*\n" + comments + "\n*/\n\n" + code;
        }

        if (network !== null) {
            doVerify(arguements, address, code);
            return;
        }
        web3.eth.net.getId().then(function (newNetwork) {
            network = Number(newNetwork);
            doVerify(arguements, address, code);
        });
    }

    function doVerify(arguements, address, code) {
        var url;
        if (network === 1) {
            url = "https://api.etherscan.io/api";
        } else if (network === 3) {
            url = "https://api-ropsten.etherscan.io/api";
        } else if (network === 5) {
            url = "https://api-goerli.etherscan.io/api";
        } else {
            alert("unknown network");
            document.getElementById("verify").onclick = verify;
            return;
        }

        var data = new FormData();
        data.append("apikey", "P7DVQSZUEUF81TJF7EQSMPQW8UNQ96EYPH");
        data.append("module", "contract");
        data.append("action", "verifysourcecode");
        data.append("contractaddress", address);
        data.append("sourceCode", code);
        data.append("codeformat", "solidity-single-file");
        data.append("contractname", "Token");
        data.append("compilerversion", "v0.6.6+commit.6c089d02");
        data.append("optimizationUsed", "0");
        data.append("runs", "200");
        data.append("constructorArguements", arguements);
        data.append("evmversion", "");
        data.append("licenseType", "1");

        fetch(url, {
            method: "POST",
            body: data
        }).then(function (response) {
            if (response.status != 200) {
                response.text().then(function (text) {
                    alert(text);
                    document.getElementById("verify").onclick = verify;
                });
                return;
            }
            response.json().then(function (json) {
                if (json.status != 1) {
                    alert(JSON.stringify(json));
                } else {
                    document.getElementById("name").placeholder = "";
                    document.getElementById("symbol").placeholder = "";
                    var waitMessage = document.createElement("span");
                    waitMessage.innerHTML = " verifying...";
                    var message = getMessage(address, "address/" + address + "#code", waitMessage);
                    document.getElementById("verifyMessage").appendChild(message);
                    setTimeout(function () {
                        check(url, json.result, waitMessage);
                    }, 5000);
                }
                document.getElementById("verify").onclick = verify;
            });
        }).catch(function (error) {
            alert(error.message);
            document.getElementById("verify").onclick = verify;
        });
    }

    function check(url, guid, message) {
        var data = new FormData();
        data.append("apikey", "P7DVQSZUEUF81TJF7EQSMPQW8UNQ96EYPH");
        data.append("module", "contract");
        data.append("action", "checkverifystatus");
        data.append("guid", guid);

        fetch(url, {
            method: "POST",
            body: data
        }).then(function (response) {
            if (response.status != 200) {
                response.text().then(function (text) {
                    alert(text);
                    message.innerHTML = " error";
                });
                return;
            }
            response.json().then(function (json) {
                if (json.status == 1) {
                    message.innerHTML = " verified";
                } else if (json.result == "Pending in queue") {
                    setTimeout(function () {
                        check(url, guid, message);
                    }, 5000);
                } else {
                    alert(JSON.stringify(json));
                    message.innerHTML = " error";
                }
            });
        }).catch(function (error) {
            alert(error.message);
            message.innerHTML = " error";
        });
    }

    function getMessage(message, path, span) {
        var p = document.createElement("p");
        p.classList.add("onestring");
        var a = document.createElement("a");
        a.innerHTML = message;
        if (network === 1) {
            a.href = "https://etherscan.io/" + path;
        } else if (network === 3) {
            a.href = "https://ropsten.etherscan.io/" + path;
        } else if (network === 5) {
            a.href = "https://goerli.etherscan.io/" + path;
        } 
        a.setAttribute("target", "_blank");
        a.setAttribute("rel", "noopener");
        p.appendChild(a);
        if (span) {
            p.appendChild(span);
        }
        return p;
    }
})();
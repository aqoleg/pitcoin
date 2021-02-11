'use strict';

(function () {
    var ethAddress = '0x99cbe93AFee15456a1115540e7F534F6629bAB3f';
    var ropstenAddress = '0x6342A5c056F71E7E3a6Bf89560Dc1F97210bDb51';
    var goerliAddress = '0x6011b6573fA152ded3d3188Ee6a90842BEa38b42';
    var tronAddress = 'TBxWTtKLUX4JcBbow9C41Q5EomdtQNZp97';
    var shastaAddress = 'TKd1M1kRJ2gJV5KwTphxE9a7jPNHztZzc7';
    var networkEth = 1;
    var networkRopsten = 3;
    var networkGoerli = 5;
    var networkTron = 'https://api.trongrid.io';
    var networkTronStack = 'https://api.tronstack.io';
    var networkShasta = 'https://api.shasta.trongrid.io';
    var abi = [
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "balanceOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_ref",
                    "type": "address"
                }
            ],
            "name": "buy",
            "outputs": [],
            "stateMutability": "payable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "_owner",
                    "type": "address"
                }
            ],
            "name": "dividendsOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "address",
                    "name": "",
                    "type": "address"
                }
            ],
            "name": "refDividendsOf",
            "outputs": [
                {
                    "internalType": "uint256",
                    "name": "",
                    "type": "uint256"
                }
            ],
            "stateMutability": "view",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "reinvest",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [
                {
                    "internalType": "uint256",
                    "name": "_tokens",
                    "type": "uint256"
                }
            ],
            "name": "sell",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        },
        {
            "inputs": [],
            "name": "withdraw",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
        }
    ];

    var eth = false;
    var web3loaded = false;
    var network = null;
    var contract = null;
    var account = null;
    var accountTokens = null;

    window.onload = function () {
        document.getElementById('eth').onclick = function () {
            setEth(true);
        };
        document.getElementById('trx').onclick = function () {
            setEth(false);
        };
        document.getElementById('connect').onclick = connect;
        document.getElementById('buy').onclick = buy;
        document.getElementById('sell').onclick = sell;
        document.getElementById('reinvest').onclick = reinvest;
        document.getElementById('withdraw').onclick = withdraw;

        if (window.tronWeb) {
            load();
            addEventListener('message', function (event) {
                if (event.data.message && !eth) {
                    load();
                }
            });
        }
        if (window.ethereum) {
            var script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/web3@latest/dist/web3.min.js';
            script.onload = function () {
                web3loaded = true;
                window.web3 = new Web3(ethereum);
                if (eth) {
                    load();
                }
                if (ethereum.on) {
                    ethereum.on('chainChanged', function () {
                        if (eth) {
                            load();
                        }
                    });
                    ethereum.on('accountsChanged', function () {
                        if (eth) {
                            load();
                        }
                    });
                }
            };
            document.body.appendChild(script);
        }
        setEth(false);

        document.getElementById('buyValue').onkeyup = function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                buy();
            } else if (event.keyCode === 27) {
                document.getElementById('buyValue').value = '';
            }
        };
        document.getElementById('sellValue').onkeyup = function (event) {
            if (event.keyCode === 13) {
                event.preventDefault();
                sell();
            } else if (event.keyCode === 27) {
                document.getElementById('sellValue').value = '';
            }
        };
    };

    function setEth(isEth) {
        eth = isEth;
        network = null;
        contract = null;
        account = null;
        document.getElementById('eth').className = eth ? 'active' : '';
        document.getElementById('trx').className = eth ? '' : 'active';
        var list = document.getElementsByClassName('currency');
        for (var i = 0; i < list.length; i++) {
            list[i].innerHTML = eth ? 'eth' : 'trx';
        }
        document.getElementById('price').innerHTML = eth ? '0.1' : '1';
        document.getElementById('refAmount').innerHTML = eth ? '10' : '1000';
        clearContractBalance();
        clearAccount();
        clearLogs();
        if (eth) {
            if (!window.ethereum) {
                printContractLink(networkEth);
                document.getElementById('startMessage').innerHTML = 'install ' +
                    '<a target="_blank" rel="noopener" href="https://metamask.io/download.html">' +
                    'metamask</a> or use ' +
                    '<a target="_blank" rel="noopener" href="https://opera.com">opera</a>';
            } else if (!web3loaded) {
                printContractLink(networkEth);
                document.getElementById('startMessage').innerHTML = 'loading...';
            } else {
                load();
            }
        } else {
            document.getElementById('connect').style.display = 'none';
            if (!window.tronWeb) {
                printContractLink(networkTron);
                document.getElementById('startMessage').innerHTML = 'install ' +
                    '<a target="_blank" rel="noopener" href="https://chrome.google.com/webstore/' +
                    'detail/tronlink/ibnejdfjmmkpcnlpebklmnkoeoihofec">tronlink</a> or use ' +
                    '<a target="_blank" rel="noopener" href="https://opera.com">opera</a> mobile';
            } else {
                load();
            }
        }
    }

    function load() {
        if (eth) {
            web3.eth.getChainId().then(function (newNetwork) {
                newNetwork = Number(newNetwork);
                if (newNetwork !== networkEth && newNetwork !== networkRopsten &&
                    newNetwork !== networkGoerli) {
                    network = null;
                    account = null;
                    document.getElementById('connect').style.display = 'block';
                    document.getElementById('startMessage').innerHTML =
                        'switch to the main, ropsten or goerli network';
                    printContractLink(networkEth);
                    clearContractBalance();
                    clearAccount();
                    clearLogs();
                    return;
                }
                if (network !== newNetwork) {
                    network = newNetwork;
                    account = null;
                    if (network === networkEth) {
                        contract = new web3.eth.Contract(abi, ethAddress);
                    } else if (network === networkRopsten) {
                        contract = new web3.eth.Contract(abi, ropstenAddress);
                    } else if (network === networkGoerli) {
                        contract = new web3.eth.Contract(abi, goerliAddress);
                    }
                    document.getElementById('startMessage').innerHTML = '';
                    printContractLink(network);
                    clearContractBalance();
                    loadContractBalance();
                    clearLogs();
                    contract.events.allEvents().on('data', function () {
                        if (eth && network) {
                            loadContractBalance();
                            if (account) {
                                loadAccount();
                            }
                        }
                    });
                }

                web3.eth.getAccounts().then(function (accounts) {
                    if (accounts.length === 0) {
                        account = null;
                        document.getElementById('connect').style.display = 'block';
                        clearAccount();
                        clearLogs();
                        return;
                    }
                    if (accounts[0] === account) {
                        return;
                    }
                    account = accounts[0];
                    document.getElementById('connect').style.display = 'none';
                    clearAccount();
                    loadAccount();
                    logNetwork();
                    logAccount();
                }).catch(error);
            }).catch(error);
        } else {
            document.getElementById('connect').style.display = 'none';
            var newAccount = tronWeb.defaultAddress.base58;
            var newNetwork = tronWeb.solidityNode.host;
            if (!newAccount) {
                network = null;
                contract = null;
                account = null;
                document.getElementById('startMessage').innerHTML = 'open tronlink';
                printContractLink(networkTron);
                clearContractBalance();
                clearAccount();
                clearLogs();
                return;
            }
            if (newNetwork !== networkTron && newNetwork !== networkTronStack &&
                newNetwork !== networkShasta) {
                network = null;
                contract = null;
                account = null;
                document.getElementById('startMessage').innerHTML =
                    'switch to the main or shasta network';
                printContractLink(networkTron);
                clearContractBalance();
                clearAccount();
                clearLogs();
                return;
            }
            if (network !== newNetwork) {
                network = newNetwork;
                contract = null;
                var address;
                if (network === networkTron || network === networkTronStack) {
                    address = tronAddress;
                } else if (network === networkShasta) {
                    address = shastaAddress;
                }
                tronWeb.contract().at(address).then(function (tronContract) {
                    contract = tronContract;
                    loadContractBalance();
                    loadAccount();
                    contract.Transfer().watch(function (error, result) {
                        if (!error && !eth && network && contract) {
                            loadContractBalance();
                            loadAccount();
                        }
                    });
                    contract.Withdraw().watch(function (error, result) {
                        if (!error && !eth && network && contract) {
                            loadContractBalance();
                            loadAccount();
                        }
                    });
                }).catch(function (error) {
                    network = null;
                    console.error(error);
                    if (error.message) {
                        error = error.message;
                    }
                    alert(error);
                });
                account = newAccount;
                document.getElementById('startMessage').innerHTML = '';
                printContractLink(network);
                clearContractBalance();
                clearLogs();
                logNetwork();
                logAccount();
            } else {
                if (account !== newAccount) {
                    account = newAccount;
                    logAccount();
                }
                if (contract) {
                    loadContractBalance();
                    loadAccount();
                }
            }
        }
    }

    function connect() {
        if (eth) {
            if (!window.ethereum) {
                alert('ethereum is not supported');
                return;
            }
            var f;
            startLoading();
            if (!ethereum.request) {
                f = ethereum.enable();
            } else {
                f = ethereum.request({method: 'eth_requestAccounts'});
            }
            f.then(function () {
                return web3.eth.getChainId();
            }).then(function (newNetwork) {
                stopLoading();
                newNetwork = Number(newNetwork);
                if (newNetwork !== networkEth && newNetwork !== networkRopsten &&
                    newNetwork !== networkGoerli) {
                    alert('switch to the main, ropsten or goerli network');
                }
            }).catch(error);
        }
    }

    function buy() {
        document.getElementById('buyValueHint').innerHTML = '';
        if (!check()) {
            return;
        }
        var value = new BigNumber(document.getElementById('buyValue').value);
        if (value.isNaN()) {
            document.getElementById('buyValueHint').innerHTML = 'enter a number';
            document.getElementById('buyValue').focus();
            return;
        } else if (value.isNegative() || value.isZero()) {
            document.getElementById('buyValueHint').innerHTML = 'enter a positive number';
            document.getElementById('buyValue').focus();
            return;
        }
        startLoading();
        var f;
        if (eth) {
            f = web3.eth.getBalance(account);
        } else {
            f = tronWeb.trx.getUnconfirmedBalance(account);
        }
        f.then(function (balance) {
            balance = new BigNumber(balance).shiftedBy(eth ? -18 : -6);
            if (balance.isZero()) {
                document.getElementById('buyValueHint').innerHTML = 'you have no ' +
                    (eth ? 'eth' : 'trx');
                stopLoading();
                return;
            } else if (value.isGreaterThan(balance)) {
                document.getElementById('buyValueHint').innerHTML =
                    'enter a number less than ' + balance.toFixed(6, BigNumber.ROUND_FLOOR);
                document.getElementById('buyValue').focus();
                stopLoading();
                return;
            }
            checkRef();
        }).catch(error);

        function checkRef() {
            var ref = parse(eth ? 'eth' : 'trx');
            if (ref === account) {
                console.log('using you address as ref');
                ref = null;
            }
            if (ref) {
                if ((eth && !web3.utils.isAddress(ref)) || (!eth && !tronWeb.isAddress(ref))) {
                    console.log('incorrect ref');
                    ref = null;
                }
            }
            if (eth) {
                if (ref) {
                    contract.methods.balanceOf(ref).call().then(function (balance) {
                        if (new BigNumber(balance).shiftedBy(-18).isLessThan(10)) {
                            console.log('not a ref');
                            ref = '0xcF43aF087aCa4D354A01298d6abc8ED34D715F08';
                        }
                        doEthTx(ref);
                    }).catch(error);
                } else {
                    doEthTx('0xcF43aF087aCa4D354A01298d6abc8ED34D715F08');
                }
            } else {
                doTronTx(ref ? ref : 'TKiYW9t4Tr5MFgrTQvu5Qu3e57oNG41HGU');
            }
        }

        function doEthTx(ref) {
            var message;
            contract.methods.buy(ref).send({
                from: account,
                value: value.shiftedBy(18)
            }).on('transactionHash', function (hash) {
                document.getElementById('buyValue').value = '';
                message = logTx('purchase for ' + value + ' eth', hash);
                stopLoading();
            }).on('confirmation', function (confirmationNumber, receipt) {
                if (confirmationNumber != 0) {
                    return;
                }
                if (!receipt.status) {
                    message.innerHTML = ' - rejected';
                } else {
                    loadContractBalance();
                    loadAccount();
                    message.innerHTML = ' - confirmed';
                }
            }).catch(error);
        }

        function doTronTx(ref) {
            var message;
            contract.buy(ref).send({
                callValue: value.shiftedBy(6)
            }).then(function (hash) {
                document.getElementById('buyValue').value = '';
                message = logTx('purchase for ' + value + ' trx', hash);
                stopLoading();
                checkTronTx(hash, message);
            }).catch(error);
        }
    }

    function sell() {
        document.getElementById('sellValueHint').innerHTML = '';
        if (!check()) {
            return;
        }
        if (accountTokens && accountTokens.isZero()) {
            document.getElementById('sellValueHint').innerHTML = 'you have no tokens';
            document.getElementById('buyValue').focus();
            return;
        }
        var value = new BigNumber(document.getElementById('sellValue').value);
        if (value.isNaN()) {
            document.getElementById('sellValueHint').innerHTML = 'enter a number';
            document.getElementById('sellValue').focus();
            return;
        } else if (value.isNegative() || value.isZero()) {
            document.getElementById('sellValueHint').innerHTML = 'enter a positive number';
            document.getElementById('sellValue').focus();
            return;
        } else if (accountTokens && value.isGreaterThan(accountTokens)) {
            document.getElementById('sellValueHint').innerHTML = 'insufficient balance';
            document.getElementById('sellValue').value = accountTokens.toFixed(18);
            document.getElementById('sellValue').focus();
            return;
        }
        startLoading();
        var message;
        if (eth) {
            contract.methods.sell(value.shiftedBy(18).toFixed(0)).send({
                from: account
            }).on('transactionHash', function (hash) {
                document.getElementById('sellValue').value = '';
                message = logTx('sale of ' + value + ' pit', hash);
                stopLoading();
            }).on('confirmation', function (confirmationNumber, receipt) {
                if (confirmationNumber != 0) {
                    return;
                }
                if (!receipt.status) {
                    message.innerHTML = ' - rejected';
                } else {
                    loadAccount();
                    message.innerHTML = ' - confirmed';
                }
            }).catch(error);
        } else {
            contract.sell(value.shiftedBy(18).toFixed(0)).send().then(function (hash) {
                document.getElementById('sellValue').value = '';
                message = logTx('sale of ' + value + ' pit', hash);
                stopLoading();
                checkTronTx(hash, message);
            }).catch(error);
        }
    }

    function withdraw() {
        if (!check()) {
            return;
        }
        startLoading();
        var message;
        if (eth) {
            contract.methods.withdraw().send({
                from: account
            }).on('transactionHash', function (hash) {
                message = logTx('withdrawal', hash);
                stopLoading();
            }).on('confirmation', function (confirmationNumber, receipt) {
                if (confirmationNumber != 0) {
                    return;
                }
                if (!receipt.status) {
                    message.innerHTML = ' - rejected';
                } else {
                    loadContractBalance();
                    loadAccount();
                    message.innerHTML = ' - confirmed';
                }
            }).catch(error);
        } else {
            contract.withdraw().send().then(function (hash) {
                message = logTx('withdrawal', hash);
                stopLoading();
                checkTronTx(hash, message);
            }).catch(error);
        }
    }

    function reinvest() {
        if (!check()) {
            return;
        }
        startLoading();
        var message;
        if (eth) {
            contract.methods.reinvest().send({
                from: account
            }).on('transactionHash', function (hash) {
                message = logTx('reinvest', hash);
                stopLoading();
            }).on('confirmation', function (confirmationNumber, receipt) {
                if (confirmationNumber != 0) {
                    return;
                }
                if (!receipt.status) {
                    message.innerHTML = ' - rejected';
                } else {
                    loadAccount();
                    message.innerHTML = ' - confirmed';
                }
            }).catch(error);
        } else {
            contract.reinvest().send().then(function (hash) {
                message = logTx('reinvest', hash);
                stopLoading();
                checkTronTx(hash, message);
            }).catch(error);
        }
    }

    function check() {
        if (eth && !window.ethereum) {
            alert('ethereum is not supported');
        } else if (eth && !web3loaded) {
            alert('loading...');
        } else if (!eth && !window.tronWeb) {
            alert('tron is not supported');
        } else if (!eth && !tronWeb.defaultAddress.base58) {
            alert('open tronlink');
        } else if (!network) {
            if (eth) {
                alert('switch to the main, ropsten or goerli network');
            } else {
                alert('switch to the main or shasta network');
            }
        } else if (!contract) {
            alert('loading...');
        } else if (eth && !account) {
            connect();
        } else {
            return true;
        }
        return false;
    }

    function printValue(value, element) {
        if (value.isZero()) {
            element.title = '';
            element.innerHTML = '0';
        } else {
            element.title = value.toFixed(18);
            if (value.isGreaterThan(0.001)) {
                element.innerHTML = value.toFixed(3, BigNumber.ROUND_DOWN);
            } else if (value.isGreaterThan(0.000001)) {
                element.innerHTML = value.toFixed(6, BigNumber.ROUND_DOWN);
            } else {
                element.innerHTML = value.toExponential(3, BigNumber.ROUND_DOWN);
            }
        }
    }

    function checkTronTx(hash, message) {
        setTimeout(function () {
            if (eth || !network || !contract) {
                return;
            }
            loadContractBalance();
            loadAccount();
            tronWeb.trx.getConfirmedTransaction(hash).then(function (tx) {
                if (tx.ret[0].contractRet === 'SUCCESS') {
                    message.innerHTML = ' - confirmed';
                } else {
                    message.innerHTML = ' - rejected';
                }
            }).catch(function (error) {
                if (error.toString().includes('not found')) {
                    checkTronTx(hash, message);
                }
            });
        }, 3000);
    }

    function error(error) {
        stopLoading();
        console.error(error);
        if (error.message) {
            error = error.message;
        }
        alert('error: ' + error);
    }

    function printContractLink(network) {
        if (eth) {
            if (network === networkEth) {
                document.getElementById('contract').innerHTML = ethAddress;
                document.getElementById('contract').href =
                    'https://etherscan.io/address/' + ethAddress;
            } else if (network === networkRopsten) {
                document.getElementById('contract').innerHTML = ropstenAddress;
                document.getElementById('contract').href =
                    'https://ropsten.etherscan.io/address/' + ropstenAddress;
            } else if (network === networkGoerli) {
                document.getElementById('contract').innerHTML = goerliAddress;
                document.getElementById('contract').href =
                    'https://goerli.etherscan.io/address/' + goerliAddress;
            }
        } else {
            if (network === networkTron || network === networkTronStack) {
                document.getElementById('contract').innerHTML = tronAddress;
                document.getElementById('contract').href =
                    'https://tronscan.org/#/contract/' + tronAddress;
            } else if (network === networkShasta) {
                document.getElementById('contract').innerHTML = shastaAddress;
                document.getElementById('contract').href =
                    'https://shasta.tronscan.org/#/contract/' + shastaAddress;
            }
        }
    }

    function clearContractBalance() {
        document.getElementById('contractBalance').title = '';
        document.getElementById('contractBalance').innerHTML = '...';
    }

    function loadContractBalance() {
        if (eth) {
            web3.eth.getBalance(contract.options.address).then(function (balance) {
                balance = new BigNumber(balance).shiftedBy(-18);
                printValue(balance, document.getElementById('contractBalance'));
            }).catch(error);
        } else {
            tronWeb.trx.getUnconfirmedBalance(contract.address).then(function (balance) {
                balance = new BigNumber(balance).shiftedBy(-6);
                printValue(balance, document.getElementById('contractBalance'));
            }).catch(error);
        }
    }

    function clearAccount() {
        accountTokens = null;
        document.getElementById('balance').title = '';
        document.getElementById('balance').innerHTML = '...';
        document.getElementById('buyValueHint').innerHTML = '';
        document.getElementById('buyValue').value = '';
        document.getElementById('sellValueHint').innerHTML = '';
        document.getElementById('sellValue').value = '';
        document.getElementById('dividend').title = '';
        document.getElementById('dividend').innerHTML = '...';
        document.getElementById('refDividend').title = '';
        document.getElementById('refDividend').innerHTML = '...';
        document.getElementById('ref').style.display = 'none';
        document.getElementById('reflink').innerHTML = '';
    }

    function loadAccount() {
        var refDividend;
        if (eth) {
            contract.methods.refDividendsOf(account).call().then(function (dividends) {
                refDividend = new BigNumber(dividends).shiftedBy(-19);
                printValue(refDividend, document.getElementById('refDividend'));
                return contract.methods.dividendsOf(account).call();
            }).then(function (dividends) {
                if (dividends == '1') {
                    dividends = '0';
                }
                dividends = new BigNumber(dividends).shiftedBy(-19).plus(refDividend);
                printValue(dividends, document.getElementById('dividend'));
            }).catch(error);
            contract.methods.balanceOf(account).call().then(function (balance) {
                accountTokens = new BigNumber(balance).shiftedBy(-18);
                printValue(accountTokens, document.getElementById('balance'));
                if (accountTokens >= 10) {
                    var link = window.location.hostname + window.location.pathname + '?eth=' + account;
                    document.getElementById('ref').style.display = 'block';
                    document.getElementById('reflink').innerHTML = '<a target="_blank" rel="noopener" ' +
                        'href="https://' + link + '">' + link + '</a>';
                }
            }).catch(error);
        } else {
            contract.refDividendsOf(account).call().then(function (dividends) {
                refDividend = new BigNumber(dividends).shiftedBy(-18);
                printValue(refDividend, document.getElementById('refDividend'));
                return contract.dividendsOf(account).call();
            }).then(function (dividends) {
                if (dividends == '1') {
                    dividends = '0';
                }
                dividends = new BigNumber(dividends).shiftedBy(-18).plus(refDividend);
                printValue(dividends, document.getElementById('dividend'));
            }).catch(error);
            contract.balanceOf(account).call().then(function (balance) {
                accountTokens = new BigNumber(balance).shiftedBy(-18);
                printValue(accountTokens, document.getElementById('balance'));
                if (accountTokens >= 1000) {
                    var link = window.location.hostname + window.location.pathname + '?trx=' + account;
                    document.getElementById('ref').style.display = 'block';
                    document.getElementById('reflink').innerHTML = '<a target="_blank" rel="noopener" ' +
                        'href="https://' + link + '">' + link + '</a>';
                } else {
                    document.getElementById('ref').style.display = 'none';
                    document.getElementById('reflink').innerHTML = '';
                }
            }).catch(error);
        }
    }

    function clearLogs() {
        document.getElementById('logs').innerHTML = '';
    }

    function logNetwork() {
        var div = document.getElementById('logs');
        if (div.innerHTML !== '') {
            return;
        }
        var p = document.createElement('p');
        if (eth) {
            if (network === networkEth) {
                p.innerHTML = 'ethereum mainnet';
            } else if (network === networkRopsten) {
                p.innerHTML = 'ethereum ropsten test network';
            } else if (network === networkGoerli) {
                p.innerHTML = 'ethereum goerli test network';
            }
        } else {
            if (network === networkTron || network === networkTronStack) {
                p.innerHTML = 'tron mainnet';
            } else if (network === networkShasta) {
                p.innerHTML = 'tron shasta test network';
            }
        }
        div.insertBefore(p, div.firstChild);
    }

    function logAccount() {
        var p = document.createElement('p');
        p.className = 'onestring';
        var span = document.createElement('span');
        span.innerHTML = 'account ';
        p.appendChild(span);
        var a = document.createElement('a');
        if (eth) {
            a.innerHTML = web3.utils.toChecksumAddress(account);
            if (network === networkEth) {
                a.href = 'https://etherscan.io/address/' + account;
            } else if (network === networkRopsten) {
                a.href = 'https://ropsten.etherscan.io/address/' + account;
            } else if (network === networkGoerli) {
                a.href = 'https://goerli.etherscan.io/address/' + account;
            }
        } else {
            a.innerHTML = account;
            if (network === networkTron || network === networkTronStack) {
                a.href = 'https://tronscan.org/#/address/' + account;
            } else if (network === networkShasta) {
                a.href = 'https://shasta.tronscan.org/#/address/' + account;
            }
        }
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        p.appendChild(a);
        var div = document.getElementById('logs');
        div.insertBefore(p, div.firstChild);
    }

    function logTx(message, hash) {
        var p = document.createElement('p');
        p.classList.add('onestring');
        var span = document.createElement('span');
        span.innerHTML = message + ', tx ';
        p.appendChild(span);
        var a = document.createElement('a');
        a.innerHTML = hash;
        if (eth) {
            if (network === networkEth) {
                a.href = 'https://etherscan.io/tx/' + hash;
            } else if (network === networkRopsten) {
                a.href = 'https://ropsten.etherscan.io/tx/' + hash;
            } else if (network === networkGoerli) {
                a.href = 'https://goerli.etherscan.io/tx/' + hash;
            }
        } else {
            if (network === networkTron || network === networkTronStack) {
                a.href = 'https://tronscan.org/#/transaction/' + hash;
            } else if (network === networkShasta) {
                a.href = 'https://shasta.tronscan.org/#/transaction/' + hash;
            }
        }
        a.setAttribute('target', '_blank');
        a.setAttribute('rel', 'noopener');
        p.appendChild(a);
        span = document.createElement('span');
        span.innerHTML = ' - unconfirmed';
        p.appendChild(span);
        var logs = document.getElementById('logs');
        logs.insertBefore(p, logs.firstChild);
        return span;
    }

    function startLoading() {
        document.getElementById('loading').style.display = 'block';
    }

    function stopLoading() {
        document.getElementById('loading').style.display = 'none';
    }

    function parse(query) {
        var startIndex = window.location.search.indexOf(query + '=');
        if (startIndex < 0) {
            return null;
        }
        startIndex = startIndex + query.length + 1;
        var stopIndex = window.location.search.indexOf('&', startIndex);
        if (stopIndex < 0) {
            return window.location.search.substring(startIndex);
        } else {
            return window.location.search.substring(startIndex, stopIndex);
        }
    }
})();
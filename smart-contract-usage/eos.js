console.log(Eos);
// TODO put your private key here
var PRIVATE_KEY = '5KKfXuq9WzimipbjVt99g4a7Vao7FYodAKqfmjaneGBqQuEVA7L';
// A simple tutorial on using Scatter to interact with the EOS ecosystem
// https://steemit.com/eos/@ajose01/eos-and-scatter-part-1
var state = {
    eosconfig: {
        keyProvider: [PRIVATE_KEY],
        httpEndpoint: 'http://jungle.cryptolions.io:18888',
        chainId: '038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        expireInSeconds: 60,
        broadcast: true,
        verbose: false,
        debug: false,
        sign: true
    }
};
// import val from 'validator'
var actions = {
    pingEndpoint: function () {
        //This method may be used to check if the testnet url is correct
        return new Promise(function (resolve, reject) {
            if (state.currentEndpoint !== null) {
                console.log('MYSTATE', state.eosconfig);
                var eos = Eos(state.eosconfig);
                var pingStart = new Date().getTime();
                var timeout = setTimeout(function () {
                    reject(Error('timeout'));
                }, state.connectionTimeout);
                eos.getInfo({}).then(function (res) {
                    clearTimeout(timeout);
                    var ping = new Date().getTime() - pingStart;
                    console.log('PING_ENDPOINT_SUCCESS', { getInfo: res, ping: ping });
                    resolve(res);
                }, function (err) {
                    clearTimeout(timeout);
                    if (err) {
                        console.log('PING_ENDPOINT_FAIL');
                        reject(Error('failed'));
                    }
                });
            }
            else {
                console.log('PING_ENDPOINT_FAIL');
                reject(Error('noEnpoint'));
            }
        });
    },
    findAccount: function (accountName) {
        // This method may be used to check if a account exists
        return new Promise(function (resolve, reject) {
            var eos = Eos(state.eosconfig);
            eos.getAccount({ account_name: accountName }).then(function (res) {
                console.log('ACCOUNT_FOUND');
                resolve(res);
            }, function (err) {
                if (err) {
                    reject(Error('notFound'));
                }
            });
        });
    },
    transfer: function () {
        // This method may be used to move tokens between two accounts
        return new Promise(function (resolve, reject) {
            var eos = Eos(state.eosconfig);
            var options = {
                authorization: 'globalone222@active',
                broadcast: true,
                sign: true
            };
            eos.transfer({
                "from": "globalone222",
                "to": "dominic22222",
                "quantity": "2.0000 EOS",
                "memo": ""
            })
                .then(function (transaction) {
                console.log(transaction);
                resolve(transaction);
            }, function (err) {
                if (err) {
                    reject(Error('error during transaction!'));
                }
            });
        });
    },
    createGame: function () {
        // This method may be used to create a new game using the tic.tac.toe contract
        return new Promise(function (resolve, reject) {
            var eos = Eos(state.eosconfig);
            // try to access contract working at all
            /*eos.contract('tic.tac.toe').then(ticTacToe => {
                console.log(ticTacToe);
            });*/
            // not working at all
            eos.contract('tic.tac.toe').then(function (chess) {
                eos.transaction({
                    scope: state.eosconfig.scope,
                    messages: [
                        {
                            code: 'tic.tac.toe',
                            type: 'create',
                            authorization: [{
                                    account: 'dominic22',
                                    permission: 'active'
                                }],
                            data: {
                                challenger: 'globalone',
                                host: 'dominic22'
                            }
                        }
                    ]
                }).then(function (res) {
                    resolve(res);
                }, function (err) {
                    if (JSON.parse(err).details.slice(0, 2) === '10') {
                        var details = JSON.parse(err).details;
                        var errString1 = details.substring(details.lastIndexOf('{"s":"') + 1, details.lastIndexOf('","ptr"'));
                        var errString = errString1.split('"')[3];
                        reject(Error(errString));
                    }
                    else {
                        reject(err);
                    }
                });
            });
        });
    }
};
// you can use this to call actions in the console of the browser
window.actions = actions;

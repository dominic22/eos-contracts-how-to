// TODO put your private key here
var PRIVATE_KEY = '';
var state = {
    eosconfig: {
        keyProvider: [PRIVATE_KEY],
        httpEndpoint: 'http://t1readonly.eos.io',
        expireInSeconds: 60,
        broadcast: true,
        debug: false,
        sign: true,
        scope: ['dominic22', 'globalone'].sort()
    },
    connectionTimeout: 5000,
    getInfo: null,
    currentEndpoint: { url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0 }
};
// import val from 'validator'
var actions = {
    pingEndpoint: function () {
        //This method may be used to check if the testnet url is correct
        return new Promise(function (resolve, reject) {
            if (state.currentEndpoint !== null) {
                console.log('MYSTATE', state.eosconfig);
                var eos = Eos.Testnet(state.eosconfig);
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
            var eos = Eos.Testnet(state.eosconfig);
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
            var eos = Eos.Testnet(state.eosconfig);
            eos.transfer({
                "from": "globalone",
                "to": "dominic22",
                "amount": "2",
                "memo": ""
            }).then(function (transaction) {
                console.log(transaction);
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
            var eos = Eos.Testnet(state.eosconfig);
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

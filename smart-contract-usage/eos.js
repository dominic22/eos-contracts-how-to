var state = {
    eosconfig: {
        httpEndpoint: 'http://t1readonly.eos.io',
        expireInSeconds: 60,
        broadcast: true,
        debug: false,
        sign: true
    },
    connectionTimeout: 5000,
    getInfo: null,
    endpoints: [
        { url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0 },
    ],
    currentEndpoint: { url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0 },
    endpointConnectionStatus: 10,
    endpointRefreshInterval: 5000,
    currentMatch: { opponent: null, matchid: null, host: null },
    matchRequests: [],
    matchRequested: []
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
    findAccount: function (account) {
        // This method may be used to check if a account exists
        return new Promise(function (resolve, reject) {
            var eos = Eos.Testnet(state.eosconfig);
            eos.getAccount({ account_name: account }).then(function (res) {
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
            var publicKeyHost = '';
            var privateKeyHost = '';
            var keyProvider = [
                privateKeyHost,
            ];
            var eos = Eos.Testnet({ keyProvider: keyProvider });
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
            var publicKeyHost = '';
            var privateKeyHost = '';
            var keyProvider = [
                privateKeyHost,
            ];
            var eos = Eos.Testnet({ keyProvider: keyProvider });
            eos.contract('tic.tac.toe').then(function (ticTacToe) {
                console.log(ticTacToe);
            });
        });
    }
};
// you can use this to call actions in the console of the browser
window.actions = actions;

declare var Eos;
declare var Promise:any;

// TODO put your private key here
const PRIVATE_KEY = '';

const state:any = {
    eosconfig: {
        keyProvider: [PRIVATE_KEY],
        httpEndpoint: 'http://t1readonly.eos.io',
        expireInSeconds: 60,
        broadcast: true,
        debug: false,
        sign: true,
    },
    connectionTimeout: 5000,
    getInfo: null,
    currentEndpoint: {url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0},
};

// import val from 'validator'
const actions = {
    pingEndpoint() {
        //This method may be used to check if the testnet url is correct
        return new Promise((resolve, reject) => {
            if (state.currentEndpoint !== null) {
                console.log('MYSTATE', state.eosconfig);
                var eos = Eos.Testnet(state.eosconfig);
                var pingStart = new Date().getTime();
                var timeout = setTimeout(function () {
                    reject(Error('timeout'));
                }, state.connectionTimeout);
                eos.getInfo({}).then((res) => {
                    clearTimeout(timeout);
                    var ping = new Date().getTime() - pingStart;
                    console.log('PING_ENDPOINT_SUCCESS', {getInfo: res, ping: ping});
                    resolve(res);
                }, (err) => {
                    clearTimeout(timeout)
                    if (err) {
                        console.log('PING_ENDPOINT_FAIL');
                        reject(Error('failed'));
                    }
                })
            } else {
                console.log('PING_ENDPOINT_FAIL');
                reject(Error('noEnpoint'));
            }
        })
    },
    findAccount (accountName) {
        // This method may be used to check if a account exists
        return new Promise((resolve, reject) => {
            var eos = Eos.Testnet(state.eosconfig);
            eos.getAccount({account_name: accountName}).then((res) => {
                console.log('ACCOUNT_FOUND');
                resolve(res)
            }, (err) => {
                if (err) {
                    reject(Error('notFound'))
                }
            })
        })
    },
    transfer () {
        // This method may be used to move tokens between two accounts
        return new Promise((resolve, reject) => {
            var eos = Eos.Testnet(state.eosconfig);
            eos.transfer({
                "from": "globalone",
                "to": "dominic22",
                "amount": "2",
                "memo": ""
            }).then(transaction => {
                console.log(transaction);
            }, (err) => {
            if (err) {
                reject(Error('error during transaction!'))
            }
            });
        })
    },
    createGame () {
        // This method may be used to create a new game using the tic.tac.toe contract
        return new Promise((resolve, reject) => {
            var eos = Eos.Testnet(state.eosconfig);
            eos.contract('tic.tac.toe').then(ticTacToe => {
                console.log(ticTacToe);
            })
            // var eos = Eos.Testnet(state.eosconfig);
            // eos.getAccount({account_name: host}).then((res) => {
            //     console.log('HOST_FOUND');
            //     resolve(res)
            // }, (err) => {
            //     if (err) {
            //         reject(Error('HOST notFound'))
            //     }
            // });
            // eos.getAccount({account_name: challenger}).then((res) => {
            //     resolve(res)
            // }, (err) => {
            //     if (err) {
            //         reject(Error('notFound'))
            //     }
            // });
            // eos.contract('tic_tac_toe').then(currency => {
            //     // Transfer is one of the actions in currency.abi
            //     currency.create('inita', 'initb');
            // })

        })
    },
};

// you can use this to call actions in the console of the browser
(window as any).actions = actions;
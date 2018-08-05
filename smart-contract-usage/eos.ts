declare var Eos;
declare var Promise:any;
console.log(Eos)

// TODO put your private key here
const PRIVATE_KEY = '5KKfXuq9WzimipbjVt99g4a7Vao7FYodAKqfmjaneGBqQuEVA7L';

// A simple tutorial on using Scatter to interact with the EOS ecosystem
// https://steemit.com/eos/@ajose01/eos-and-scatter-part-1

const state:any = {
    eosconfig: {
        keyProvider: [PRIVATE_KEY],
        httpEndpoint: 'http://jungle.cryptolions.io:18888',
        chainId:'038f4b0fc8ff18a4f0842a8f0564611f6e96e8535901dd45e43ac8691a1c4dca',
        expireInSeconds: 60,
        broadcast: true,
        verbose: false, // API activity
        debug: false,
        sign: true,/*
        scope: ['globalone222'].sort(),
        authorization: 'globalone222@active'*/
    },
};

// import val from 'validator'
const actions = {
    pingEndpoint() {
        //This method may be used to check if the testnet url is correct
        return new Promise((resolve, reject) => {
            if (state.currentEndpoint !== null) {
                console.log('MYSTATE', state.eosconfig);
                var eos = Eos(state.eosconfig);
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
            var eos = Eos(state.eosconfig);
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
            let eos = Eos(state.eosconfig);
            let options = {
                authorization: 'globalone222@active',
                broadcast: true,
                sign: true
              }
            eos.transfer({
                "from": "globalone222",
                "to": "dominic22222",
                "quantity": "2.0000 EOS",
                "memo": ""
            })
            .then(transaction => {
                console.log(transaction);
                resolve(transaction)
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
            var eos = Eos(state.eosconfig);
            // try to access contract working at all
            /*eos.contract('tic.tac.toe').then(ticTacToe => {
                console.log(ticTacToe);
            });*/
            // not working at all
            eos.contract('tic.tac.toe').then(chess => {
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
                }).then((res) => {
                  resolve(res)
                }, (err) => {
                  if (JSON.parse(err).details.slice(0, 2) === '10') {
                    let details = JSON.parse(err).details
                    let errString1 = details.substring(details.lastIndexOf('{"s":"') + 1, details.lastIndexOf('","ptr"'))
                    let errString = errString1.split('"')[3]
                    reject(Error(errString))
                  } else {
                    reject(err)
                  }
                });
            })
        })
    }
};

// you can use this to call actions in the console of the browser
(window as any).actions = actions;
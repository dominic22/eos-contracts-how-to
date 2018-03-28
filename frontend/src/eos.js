"use strict";
exports.__esModule = true;
var Eos = require("eosjs");
// TODO put your private key here
var PRIVATE_KEY = '';
var state = {
    eosconfig: {
        keyProvider: [PRIVATE_KEY],
        httpEndpoint: 'http://t1readonly.eos.io',
        expireInSeconds: 60,
        broadcast: true,
        debug: false,
        sign: true
    },
    connectionTimeout: 5000,
    getInfo: null,
    currentEndpoint: { url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0 }
};
// import val from 'validator'
exports.actions = {
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
        // TODO not working
        return new Promise(function (resolve, reject) {
            var eos = Eos.Testnet(state.eosconfig);
            eos.contract('tic.tac.toe').then(function (ticTacToe) {
                console.log(ticTacToe);
            });
        });
    }
};

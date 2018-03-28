"use strict";
exports.__esModule = true;
var Eos = require("eosjs");
console.log('AAAAAAAAAAAAAAAAA');
exports.state = {
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
exports.actions = {
    pingEndpoint: function () {
        return new Promise(function (resolve, reject) {
            if (exports.state.currentEndpoint !== null) {
                console.log('MYSTATE', exports.state.eosconfig);
                var eos = Eos.Testnet(exports.state.eosconfig);
                var pingStart = new Date().getTime();
                var timeout = setTimeout(function () {
                    reject(Error('timeout'));
                }, exports.state.connectionTimeout);
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
        return new Promise(function (resolve, reject) {
            var eos = Eos.Testnet(exports.state.eosconfig);
            eos.getAccount({ account_name: account }).then(function (res) {
                console.log('ACCOUNT_FOUND');
                resolve(res);
            }, function (err) {
                if (err) {
                    console.log('ACCOUNT_NOT_FOUND');
                    reject(Error('notFound'));
                }
            });
        });
    }
};

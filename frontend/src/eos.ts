import * as Eos from 'eosjs';

declare var Promise:any;

console.log('AAAAAAAAAAAAAAAAA');

export const state:any = {
    eosconfig: {
        httpEndpoint: 'http://t1readonly.eos.io',
        expireInSeconds: 60,
        broadcast: true,
        debug: false,
        sign: true,
    },
    connectionTimeout: 5000,
    getInfo: null,
    endpoints: [
        {url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0},
    ],
    currentEndpoint: {url: 'http://t1readonly.eos.io', ping: 0, lastConnection: 0},
    endpointConnectionStatus: 10,
    endpointRefreshInterval: 5000,
    currentMatch: {opponent: null, matchid: null, host: null},
    matchRequests: [],
    matchRequested: [],
};

// import val from 'validator'
export const actions = {
    pingEndpoint() {
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
    findAccount (account) {
        return new Promise((resolve, reject) => {
            var eos = Eos.Testnet(state.eosconfig)
            eos.getAccount({account_name: account}).then((res) => {
                console.log('ACCOUNT_FOUND');
                resolve(res)
            }, (err) => {
                if (err) {
                    console.log('ACCOUNT_NOT_FOUND');
                    reject(Error('notFound'))
                }
            })
        })
    },
};
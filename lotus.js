'use strict';

const request = require('request');
var spawn = require("spawn-promise");

let baseUrl = "http://204.48.29.217:1234/rpc/v0";
let token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJBbGxvdyI6WyJyZWFkIiwid3JpdGUiLCJzaWduIiwiYWRtaW4iXX0.gYTvmJn6A2TpLgnRTJptetz4L3-HO54XZbDLWB0JzIQ";

const make = (options, token, cb) => {
    if (token) {
        const defaultOptions = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },

        };
        return request(Object.assign(options, defaultOptions), cb);
    } else {
        return request(options, cb);
    }
};

const execute = (body) => {
    return new Promise((resolve, reject) => {
        make({ uri: baseUrl, body: body }, token, (error, response, body) => {
            if (error || response.statusCode !== 200) {
                reject(error || body);
                return;
            }
            let finalBody = null;
            try {
                finalBody = JSON.parse(body);
            } catch (ex) {
                finalBody = body;
            }
            resolve(finalBody);
        });
    });
};

function StateListMiners() {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.StateListMiners", "params": [null], "id": 3 }));
}

function StateMinerPower(miner) {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.StateMinerPower", "params": [miner, null], "id": 3 }));
}

function StateMinerInfo(miner) {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.StateMinerInfo", "params": [miner, null], "id": 0 }));
}

function ClientQueryAsk(peerID, miner) {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientQueryAsk", "params": [peerID, miner], "id": 0 }));
}

function ClientFindData(dataCid) {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientFindData", "params": [dataCid], "id": 0 }));
}

function ClientGetDealInfo(dealCid) {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientGetDealInfo", "params": [{"/":dealCid}], "id": 0 }));
}

function ClientListDeals() {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientListDeals", "params": [], "id": 0 }));
}

function ClientStartDeal(dataCid, miner, price, duration) {
    return spawn('lotus', ["client", "deal", dataCid, miner, price, duration], null);
}

/*function ClientStartDeal2() {
    return execute(JSON.stringify({ "jsonrpc": "2.0", "method": "Filecoin.ClientStartDeal", "params": [{"Data":{"TransferType":"string value","Root":{"/":"bafkreih7ojhsmt6lzljynwrvyo5gggi2wwxa75fdo3fztpiixbtcagbxmi"},"PieceCid":null,"PieceSize":1024},"Wallet":"t01024","Miner":"t01024","EpochPrice":"0","MinBlocksDuration":42,"DealStartEpoch":10101}], "id": 0 }));
}*/

function ClientImport(file) {
    return spawn('lotus', ["client", "import", file], null);
}

function ClientRetrieve(dataCid, outFile) {
    return spawn('lotus', ["client", "retrieve", dataCid, outFile], null);
}

var args = process.argv.slice(2);

if (args[0] === 'test') {
    StateMinerPower("t089665").then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    });

    ClientGetDealInfo("bafyreiflw5y3arrrsvil5abyarcnnxc7a7ort6higwf2mqzevmtrtvnsle").then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    });

    /*ClientStartDeal2().then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    });*/

    ClientListDeals().then(data => {
        console.log(data)
    }).catch(error => {
        console.log(error);
    });
}

module.exports = {
    StateListMiners,
    StateMinerPower,
    StateMinerInfo,
    ClientQueryAsk,
    ClientFindData,
    ClientGetDealInfo,
    ClientStartDeal,
    ClientImport,
    ClientRetrieve,
};
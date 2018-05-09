let electrumServers = {
    KMD: {
        address: '46.4.87.18',
        port: 10001,
        proto: 'tcp',
        txfee: 0,
        coin: 'KMD',
        altserverList: [
            'electrum1.cipig.net:10001',
            'electrum2.cipig.net:10001'
        ],
    },
    BTC: {
        address: 'electrum.hsmiths.com',
        port: 50001,
        proto: 'tcp',
        txfee: 10000,
        coin: 'BTC',
        altserverList: [
            'helicarrier.bauerj.eu:50001',
            'node1.komodo.rocks:50001',
            'electrum.hsmiths.com:50001',
            'electrum.bntn.host:50036'
        ],
    },
    BNTN: {
        address: '46.4.87.18',
        port: 10026,
        proto: 'tcp',
        txfee: 10000,
        coin: 'BNTN',
        altserverList: [
            'electrum1.cipig.net:10026',
            'electrum2.cipig.net:10026'
        ],
    },
    QTUM: {
        address: 'electrum.bntn.host',
        port: 50034,
        proto: 'tcp',
        txfee: 10000,
        coin: 'QTUM',
        altserverList: [
            's2.qtum.info:50001',
            's1.qtum.info:50001'
        ],
    },
};

module.exports = electrumServers;

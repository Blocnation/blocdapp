
import { Userdata } from '../../api/userdata/userdata.js';
import { Tradedata } from '../../api/tradedata/tradedata.js';

Meteor.setInterval(function() {
    if(Userdata.find().count() > 4) {
        Meteor.call('getbalance', 'KMD');
        Meteor.call('getbalance', 'BNTN');
        Meteor.call('getbalance', 'BTC');
        Meteor.call('getbalance', 'QTUM');
    }
    if(Userdata.find().count() > 4 && Tradedata.find().count() > 0) {
    Meteor.call('getprice', 'KMD');
    Meteor.call('getprice', 'BTC');
    Meteor.call('getprice', 'QTUM');
    Meteor.call("checkswapstatus");
    }
}, 60000);

Meteor.setInterval(function() {
    if(Userdata.find().count() > 6) {
        Meteor.call('listtransactions', "KMD");
        Meteor.call('listtransactions', "QTUM");
        Meteor.call('listtransactions', "BNTN");
        Meteor.call('listtransactions', "BTC");
    }

}, 90000);

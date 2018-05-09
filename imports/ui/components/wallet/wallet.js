import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import Clipboard from 'clipboard';
import './wallet.html';
import { Userdata } from '/imports/api/userdata/userdata.js';
import { Transactions } from '/imports/api/transactions/transactions.js';

const numcoin = 100000000;

Template.wallet.onCreated(function() {
    if (!Meteor.isDesktop) {
        Meteor.subscribe('userdata.all');
        Meteor.subscribe('transactions.all');
    }
    Session.set("currentcoin", "KMD");
});

Template.wallet.onRendered(function() {
    var clipboard = new Clipboard('.btn-copy-link');
    clipboard.on('success', function(e) {
        console.info('Action:', e.action);
        console.info('Text:', e.text);
        console.info('Trigger:', e.trigger);

        e.clearSelection();
    });
});

console.log(Transactions.find().count());

Template.registerHelper('loading', function() {
    return Session.get("loading");
});

Template.wallet.helpers({
    coins: function() {
        return ["KMD", "BNTN", "QTUM", "BTC"];
    },
    currentcoin: function() {
        return Session.get("currentcoin");
    },
    coinsString: function() {
        if (Session.get("currentcoin") == "KMD") {
            return "Komodo";
        } else if (Session.get("currentcoin") == "BNTN") {
            return "BlocNation";
        } else if (Session.get("currentcoin") == "QTUM") {
            return "QTUM";
        } else if (Session.get("currentcoin") == "BTC") {
            return "Bitcoin";
        }
    },
    balance: function() {
        return Userdata.findOne({
            coin: Session.get("coin")
        }) && parseFloat(Userdata.findOne({
            coin: Session.get("coin")
        }).balance / numcoin).toFixed(8);
    },
    balanceKMD: function() {
        return Userdata.findOne({
            coin: "KMD"
        }) && parseFloat(Userdata.findOne({
            coin: "KMD"
        }).balance / numcoin).toFixed(8);
    },
    balanceBNTN: function() {
        return Userdata.findOne({
            coin: "BNTN"
        }) && parseFloat(Userdata.findOne({
            coin: "BNTN"
        }).balance / numcoin).toFixed(8);
    },
    balanceQTUM: function() {
        return Userdata.findOne({
            coin: "QTUM"
        }) && parseFloat(Userdata.findOne({
            coin: "QTUM"
        }).balance / numcoin).toFixed(8);
    },
    balanceBTC: function() {
        return Userdata.findOne({
            coin: "BTC"
        }) && parseFloat(Userdata.findOne({
            coin: "BTC"
        }).balance / numcoin).toFixed(8);
    },
    address: function() {
        return Userdata.findOne({
            coin: Session.get("currentcoin")
        }) && Userdata.findOne({
            coin: Session.get("currentcoin")
        }).smartaddress.toString();
    },
    transactions: function() {
        return Transactions.find({}, {
            sort: {
                createdAt: -1
            },
            limit: 10
        });
    },
    activecoinKMD: function() {
        if (Session.get("coin") == "KMD") {
            return true;
        } else {
            return false;
        }
    },
    activecoinBNTN: function() {
        if (Session.get("coin") == "BNTN") {
            return true;
        } else {
            return false;
        }
    },
    activecoinQTUM: function() {
        if (Session.get("coin") == "QTUM") {
            return true;
        } else {
            return false;
        }
    },
    activecoinBTC: function() {
        if (Session.get("coin") == "BTC") {
            return true;
        } else {
            return false;
        }
    },
    price: function() {
        if (Session.get("price") == 0) {
            return NaN;
        } else {
            return Session.get("price");
        }
    },
    total: function() {
        return Session.get("price");
    }
});

Template.registerHelper('formatDate', function(date) {
    return moment(date).format('MM-DD-YYYY');
});

Session.set("activeSendButton", true);
Template.wallet.events({
    "change #coin-select": function(event, template) {
        var coin = $(event.currentTarget).val();
        Session.set("currentcoin", coin);
    },
    "click .sendcoins": function(event, template) {
        event.preventDefault();
        const amount = Number(Number(template.find(".amount").value).toFixed(8)) * numcoin;
        const addr = template.find(".sendaddress").value;
        if (Number(Userdata.findOne({
                coin: Session.get("currentcoin")
            }).balance) > (amount + Number(0.00010000 * numcoin)) && addr != "") {
            const coin = Session.get("currentcoin");
            console.log(Session.get("currentcoin"));
            if (Meteor.isDesktop) {
                Desktop.fetch('marketmaker', 'sendToAddress', 60000, coin, addr, amount)
                    .then(([result, value]) => {
                        if (result) {
                            swal("Transaction sent", "txid: " + value, "success");
                        } else {
                            console.log(value);
                            console.log("errrrr");
                            throw new Error(value);
                        }
                    })
                    .catch(e => {
                        swal("Error!", e.toString(), "error");
                    });
            } else {
                Meteor.call("sendtoaddress", Session.get("currentcoin"), addr, amount, (error, result) => {
                    if (error) {
                        console.log(error);
                        swal("Error!", "Errorcode: " + error.error.code, "error");
                    } else {
                        swal("Transaction sent", "txid: " + result, "success");
                    }
                });
            }
        } else swal("Error!", "Not enough balance (forgot txfee?)", "error");
    },
});

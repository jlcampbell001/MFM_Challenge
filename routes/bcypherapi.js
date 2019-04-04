var express = require('express');
var router = express.Router();
var bcypher = require('blockcypher');

var bcapi = new bcypher('btc', 'test3', '');
var address = 'mnJqb7kq16PEKHuxPjGoEPcREpuKFSSmSs';

function printResponse(err, data) {
    if (err !== null) {
        console.log(err);
    } else {
        console.log(data);
    }
}

router.route('/:id')
    .get(function (req, res) {
        bcapi.getAddrBal(req.params.id, '', function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(data);
            res.json(data);
        });
    });

router.route('/transactions/:id')
    .get(function (req, res) {
        bcapi.getAddr(req.params.id, '', function (err, data) {
            if (err) {
                console.log(err);
                res.send(err);
            }
            console.log(data);
            res.json(data);
        });
    });

module.exports = router;
var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {

    let username = req.query.username;

    res.send(JSON.stringify({
        code : 200,
        yourname : username
    }));
});

module.exports = router;
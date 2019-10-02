const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send({response: "Yo what's good"}).status(200);
});

module.exports = router;
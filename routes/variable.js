const fs = require('fs');
const _ = require('lodash');
var express = require('express');
var router = express.Router();

function getData(fileName) {
    const data = fs.readFileSync('./public/csv_file/' + fileName).toString();
    const Lines = data.split('\n');
    const Keys = Lines[0].split(',');

    const resultData = _.chain(Lines).map(l => {
        var o = {};
        var values = l.split(',');
        const year = values[0];
        o[year] = {};
        for (var j = 1; j < Keys.length; j++) {
            o[year][Keys[j]] = values[j] * 1;
        }
        return o;
    }).filter(l => l !== undefined).value();

    return resultData;
}

// [변수 데이터 json 만들기]
router.get('/data/:VARIABLE', function (req, res, next) {
    const variable = req.params.VARIABLE;

    const data = getData(variable+".csv");

    data.splice(0, 1)

    const container = { Root: {} };

    _.map(data, (value, index) => {
        _.map(value, (v, k) => {
            if (k !== "") {
                container.Root[k] = v;
            }
        });
    });
    res.json(container);
});

module.exports = router;
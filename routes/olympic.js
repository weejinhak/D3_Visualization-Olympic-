const fs = require('fs');
const _ = require('lodash');
var express = require('express');
var router = express.Router();

const winterData = fs.readFileSync('./public/csv_file/olympic_winter.csv').toString();
const summerData = fs.readFileSync('./public/csv_file/olympic_summer.csv').toString();

const wLines = winterData.split('\n');
const wKeys = wLines[0].split(',');

const wDatas = _.chain(wLines).map(l => {
    var o = {};
    var values = l.split(',');
    for (var j = 0; j < wKeys.length; j++) {
        o[wKeys[j]] = values[j];
    }
    return o;
}).filter(l => l !== undefined).value();

const sLines = summerData.split('\n');
const sKeys = sLines[0].split(',');

const sDatas = _.chain(sLines)
                .map(l => {
    var o = {};
    var values = l.split(',');
    for (var j = 0; j < sKeys.length; j++) {
        o[sKeys[j]] = values[j];
    }
    return o;
}).filter(l => l !== undefined).value();



// [개최년도] ——> 경기 (여름)
router.get('/summer/sportsList/:YEAR', function (req, res, next) {
    const year = req.params.YEAR;
    const sportsList = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .groupBy(d => d.Sport)
        .value();
    const sportsArray = [];
    _.forEach(sportsList, function (value, key) {
        sportsArray.push(key);
    });
    res.json(sportsArray);
});

// [개최년도,체크된 경기(배열)] ----> 참가국& 메달 랭킹 (여름)
router.get('/summer/countryMedalRank/:YEAR&:CHECKED_SPORTS', function (req, res, next) {
    const year = req.params.YEAR;
    const checkedSports = req.params.CHECKED_SPORTS.split(',');
    const countryMedalList = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => _.some(checkedSports, (v, k) => _.isEqual(d.Sport, v)))
    //    .filter(d => _.without(checkedSports, d.Sport).length !== checkedSports.length)
        .groupBy(d => d.Team)
        .value();

    _.map(countryMedalList, (value, key) => {
        countryMedalList[key] = _.chain(countryMedalList[key])
                                 .groupBy(d => d.Medal)
                                 .value();

        _.map(countryMedalList[key], function (v, k) {
            countryMedalList[key][k] = countryMedalList[key][k].length;
        });

        if(countryMedalList[key]['GOLD'] == undefined) {
            countryMedalList[key]['GOLD'] = 0;
        }
        if(countryMedalList[key]['SILVER'] == undefined) {
            countryMedalList[key]['SILVER'] = 0;
        }
        if(countryMedalList[key]['BRONZE'] === undefined) {
            countryMedalList[key]['BRONZE'] = 0;
        }

        countryMedalList[key]['country'] = key;
    });

    const countryMedalRank = _.orderBy(countryMedalList, ['GOLD', 'SILVER', 'BRONZE'], ['asc', 'asc', 'asc']);

    res.json(countryMedalRank);
});


// [개최년도,체크된 경기(배열)] ----> 참가국& 메달값 (여름)
router.get('/summer/countryMedalValue/:YEAR&:CHECKED_SPORTS', function (req, res, next) {
    const year = req.params.YEAR;
    const checkedSports = req.params.CHECKED_SPORTS.split(',');
    const countryMedalList = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => _.some(checkedSports, (v, k) => _.isEqual(d.Sport, v)))
    //    .filter(d => _.without(checkedSports, d.Sport).length !== checkedSports.length)
        .groupBy(d => d.Code)
        .value();

    _.map(countryMedalList, (value, key) => {
        countryMedalList[key] = _.chain(countryMedalList[key])
                                 .groupBy(d => d.Medal)
                                 .value();

        _.map(countryMedalList[key], function (v, k) {
            countryMedalList[key][k] = countryMedalList[key][k].length;
        });

        if(countryMedalList[key]['GOLD'] == undefined) {
            countryMedalList[key]['GOLD'] = 0;
        }
        if(countryMedalList[key]['SILVER'] == undefined) {
            countryMedalList[key]['SILVER'] = 0;
        }
        if(countryMedalList[key]['BRONZE'] === undefined) {
            countryMedalList[key]['BRONZE'] = 0;
        }
        countryMedalList[key] = (Math.round((countryMedalList[key]['GOLD'] * 2.69 + countryMedalList[key]['SILVER'] * 1.65 + countryMedalList[key]['BRONZE'] * 1)*100)/100.0);
    });

    res.json(countryMedalList);
});



// [개최년도, 체크된 경기(배열), 참가국, 메달종류] ----> 종목 & 선수 (여름)
router.get('/summer/sportsAthleteList/:YEAR&:CHECKED_SPORTS&:COUNTRY&:MEDALTYPE', function getSportsAthleteList(req, res, next) {
    const year = req.params.YEAR;
    const checkedSports = req.params.CHECKED_SPORTS;
    const country = req.params.COUNTRY;
    const medalType = req.params.MEDALTYPE;

    const sportsAthleteList = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => _.some(checkedSports, (v, k) => _.isEqual(d.Sport, v)))
        .filter(d => d.Team == country)
        .filter(d => d.Medal == medalType)
        .map(d => {
            var ret = {
                'event': d.Event,
                'althlete': d.Athlete
            }
            return ret;
        })
        .value();

    res.json(sportsAthleteList);
});

// [개최년도] ----> olympicCountry(개최국) (여름)
router.get('/summer/olympicCountryByYear/:YEAR', function getOlympicCountryByYear(req, res, next) {

    const year = req.params.YEAR;
    const olympicCountry = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .head()
        .get('Country')
        .value();

    res.json(olympicCountry);
});

// [개최년도] ----> olympicName(개최도시) (여름)
router.get('/summer/olympicNameByYear/:YEAR', function getOlympicNameByYear(req, res, next) {
    const year = req.params.YEAR;
    const olympicName = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .head()
        .get('City')
        .value();

    res.json(olympicName);
});

// [개최년도,메달종류] ——> Athlete,AthleteBirthdateList (여름)
router.get('/summer/athletBirthList/:YEAR&:MEALTYPE', function getAthleteBirthList(req, res, next) {
    //year,medalType
    const year = req.params.YEAR;
    const medalType = req.params.MEDALTYPE;

    const athleteBirthList = _.chain(sDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == medalType)
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday
            }
            return ret;
        })
        .value()

    res.athleteBirthList;
});

// [개최년도,메달종류] ——>Athlete,AthleteSex List (여름)
router.get('/summer/AthleteSex/:YEAR&:MEDALTYPE', function getAthleteSex(req, res, next) {
    //year,medalType
    const year = req.params.YEAR;
    const medalType = req.params.MEDALTYPE;

    const athleteSexList = _.chain(sDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == medalType)
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Sex: d.Gender
            }
            return ret;
        })
        .value()

    res.json(athleteSexList);
});

// [개최년도] ---> Athlete, AthleteBirthdate, AthleteSex (여름)
router.get('/summer/allAthleteInfoByMedal/:YEAR', function getAllAthleteInfoByMedal(req, res, next) {
    const year = req.params.YEAR;
    const goldMedalList = _.chain(sDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == 'GOLD')
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday,
                Sex: d.Gender
            }
            return ret;
        })
        .value();
    const silverMedalList = _.chain(sDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == 'SILVER')
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday,
                Sex: d.Gender
            }
            return ret;
        })
        .value();

    const bronzeMedalList = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => d.Medal == 'BRONZE')
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday,
                Sex: d.Gender
            }
            return ret;
        })
        .value();

    const ret = {
        'Gold': goldMedalList,
        'Silver': silverMedalList,
        'Bronze': bronzeMedalList
    }

    res.json(ret);
});

// [하계] ——> 개최연도 리스트 (여름)
router.get('/summer', function (req, res) {
    const summerYearList = _.chain(sDatas)
        .groupBy(d => d.Year)
        .value();
        
    const summerYearArray = _.map(summerYearList, (d,k)=>{
        if(_.isNil(k) || k === 'Year') return null;
        else if(k === 'undefined') return null;
        return k;
    }).filter(d => !_.isNil(d));
    

    res.json(summerYearArray);
    
});

// [개최년도] ——> 개최국 (여름)
router.get('/summer/hostCountry/:YEAR', function (req, res, next) {
    let hostCountry = "";

    const year = req.params.YEAR;
    const hostCountryData = _.chain(sDatas)
        .filter(d => d.Year * 1 == year)
        .groupBy(d => d.Country)
        .value();
    
    _.map(hostCountryData, (v, k) => {
        hostCountry = k;
    });

    res.json(hostCountry);
});










// [개최년도] ——> 경기 (겨울)
router.get('/winter/sportsList/:YEAR', function (req, res, next) {
    const year = req.params.YEAR;
    const sportsList = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .groupBy(d => d.Sport)
        .value();
    const sportsArray = [];
    _.forEach(sportsList, function (value, key) {
        sportsArray.push(key);
    });
    res.json(sportsArray);
});

// [개최년도,체크된 경기(배열)] ----> 참가국& 메달 랭킹 (겨울)
router.get('/winter/countryMedalRank/:YEAR&:CHECKED_SPORTS', function (req, res, next) {
    const year = req.params.YEAR;
    const checkedSports = req.params.CHECKED_SPORTS.split(',');
    const countryMedalList = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => _.some(checkedSports, (v, k) => _.isEqual(d.Sport, v)))
        .groupBy(d => d.Team)
        .value();

    _.map(countryMedalList, (value, key) => {
        countryMedalList[key] = _.chain(countryMedalList[key])
                                 .groupBy(d => d.Medal)
                                 .value();

        _.map(countryMedalList[key], function (v, k) {
            countryMedalList[key][k] = countryMedalList[key][k].length;
        });

        if(countryMedalList[key]['GOLD'] == undefined) {
            countryMedalList[key]['GOLD'] = 0;
        }
        if(countryMedalList[key]['SILVER'] == undefined) {
            countryMedalList[key]['SILVER'] = 0;
        }
        if(countryMedalList[key]['BRONZE'] === undefined) {
            countryMedalList[key]['BRONZE'] = 0;
        }

        countryMedalList[key]['country'] = key;
   });

    const countryMedalRank = _.orderBy(countryMedalList, ['GOLD', 'SILVER', 'BRONZE'], ['asc', 'asc', 'asc']);

    res.json(countryMedalRank);
});

// [개최년도,체크된 경기(배열)] ----> 참가국& 메달값 (겨울)
router.get('/winter/countryMedalValue/:YEAR&:CHECKED_SPORTS', function (req, res, next) {
    const year = req.params.YEAR;
    const checkedSports = req.params.CHECKED_SPORTS.split(',');
    const countryMedalList = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => _.some(checkedSports, (v, k) => _.isEqual(d.Sport, v)))
        .groupBy(d => d.Code)
        .value();

    _.map(countryMedalList, (value, key) => {
        countryMedalList[key] = _.chain(countryMedalList[key])
                                 .groupBy(d => d.Medal)
                                 .value();

        _.map(countryMedalList[key], function (v, k) {
            countryMedalList[key][k] = countryMedalList[key][k].length;
        });

        if(countryMedalList[key]['GOLD'] == undefined) {
            countryMedalList[key]['GOLD'] = 0;
        }
        if(countryMedalList[key]['SILVER'] == undefined) {
            countryMedalList[key]['SILVER'] = 0;
        }
        if(countryMedalList[key]['BRONZE'] === undefined) {
            countryMedalList[key]['BRONZE'] = 0;
        }
        countryMedalList[key] = (Math.round((countryMedalList[key]['GOLD'] * 2.69 + countryMedalList[key]['SILVER'] * 1.65 + countryMedalList[key]['BRONZE'] * 1)*100)/100.0);
    });

    res.json(countryMedalList);
});

// [개최년도, 체크된 경기(배열), 참가국, 메달종류] ----> 종목 & 선수 (겨울)
router.get('/winter/sportsAthleteList/:YEAR&:CHECKED_SPORTS&:COUNTRY&:MEDALTYPE', function getSportsAthleteList(req, res, next) {
    const year = req.params.YEAR;
    const checkedSports = req.params.CHECKED_SPORTS;
    const country = req.params.COUNTRY;
    const medalType = req.params.MEDALTYPE;

    const sportsAthleteList = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => _.some(checkedSports, (v, k) => _.isEqual(d.Sport, v)))
        .filter(d => d.Team == country)
        .filter(d => d.Medal == medalType)
        .map(d => {
            var ret = {
                'event': d.Event,
                'althlete': d.Athlete
            }
            return ret;
        })
        .value();

    res.json(sportsAthleteList);
});

// [개최년도] ----> olympicCountry(개최국) (겨울)
router.get('/winter/olympicCountryByYear/:YEAR', function getOlympicCountryByYear(req, res, next) {

    const year = req.params.YEAR;
    const olympicCountry = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .head()
        .get('Country')
        .value();

    res.json(olympicCountry);
});

// [개최년도] ----> olympicName(개최도시) (겨울)
router.get('/winter/olympicNameByYear/:YEAR', function getOlympicNameByYear(req, res, next) {
    const year = req.params.YEAR;
    const olympicName = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .head()
        .get('City')
        .value();

    res.json(olympicName);
});

// [개최년도,메달종류] ——> Athlete,AthleteBirthdateList (겨울)
router.get('/winter/athletBirthList/:YEAR&:MEALTYPE', function getAthleteBirthList(req, res, next) {
    //year,medalType
    const year = req.params.YEAR;
    const medalType = req.params.MEDALTYPE;

    const athleteBirthList = _.chain(wDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == medalType)
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday
            }
            return ret;
        })
        .value()

    res.athleteBirthList;
});

// [개최년도,메달종류] ——>Athlete,AthleteSex List (겨울)
router.get('/winter/AthleteSex/:YEAR&:MEDALTYPE', function getAthleteSex(req, res, next) {
    //year,medalType
    const year = req.params.YEAR;
    const medalType = req.params.MEDALTYPE;

    const athleteSexList = _.chain(wDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == medalType)
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Sex: d.Gender
            }
            return ret;
        })
        .value()

    res.json(athleteSexList);
});

// [개최년도] —> Athlete, AthleteBirthdate, AthleteSex (겨울)
router.get('/winter/allAthleteInfoByMedal/:YEAR', function getAllAthleteInfoByMedal(req, res, next) {
    const year = req.params.YEAR;
    const goldMedalList = _.chain(wDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == 'GOLD')
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday,
                Sex: d.Gender
            }
            return ret;
        })
        .value();
    const silverMedalList = _.chain(wDatas)
        .filter(d => d.Year * 1 === year)
        .filter(d => d.Medal == 'SILVER')
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday,
                Sex: d.Gender
            }
            return ret;
        })
        .value();

    const bronzeMedalList = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .filter(d => d.Medal == 'BRONZE')
        .map(d => {
            const ret = {
                Athlete: d.Athlete,
                Birthday: d.Birthday,
                Sex: d.Gender
            }
            return ret;
        })
        .value();

    const ret = {
        'Gold': goldMedalList,
        'Silver': silverMedalList,
        'Bronze': bronzeMedalList
    }

    res.json(ret);
});

// [동계] ——> 개최연도 리스트 (겨울)
router.get('/winter', function (req, res) {
    const winterYearList = _.chain(wDatas)
        .groupBy(d => d.Year)
        .value();
        
    const winterYearArray = _.map(winterYearList, (d,k)=>{
        if(_.isNil(k) || k === 'Year') return null;
        else if(k === 'undefined') return null;
        return k;
    }).filter(d => !_.isNil(d));
    
    res.json(winterYearArray);
    
});

// [개최년도] ——> 개최국 (겨울)
router.get('/winter/hostCountry/:YEAR', function (req, res, next) {
    let hostCountry = "";

    const year = req.params.YEAR;
    const hostCountryData = _.chain(wDatas)
        .filter(d => d.Year * 1 == year)
        .groupBy(d => d.Country)
        .value();
    
    _.map(hostCountryData, (v, k) => {
        hostCountry = k;
    });
    
    res.json(hostCountry);
});


module.exports = router;
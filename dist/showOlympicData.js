'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var contents = new function () {
    var initView = function () {
        var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4() {
            var _this = this;

            var summerYearList, winterYearList, $summerBtn, $winterBtn, init_yearList, init_year, init_season;
            return regeneratorRuntime.wrap(function _callee4$(_context4) {
                while (1) {
                    switch (_context4.prev = _context4.next) {
                        case 0:
                            _context4.next = 2;
                            return summerDataLoader.getSummerYearList();

                        case 2:
                            summerYearList = _context4.sent;
                            _context4.next = 5;
                            return winterDataLoader.getWinterYearList();

                        case 5:
                            winterYearList = _context4.sent;
                            $summerBtn = $('#summer-button');
                            $winterBtn = $('#winter-button');
                            init_yearList = summerYearList;

                            yearList = init_yearList;
                            init_year = yearList[0];
                            init_season = "summer";

                            year = init_year;
                            season = init_season;

                            initSlider();
                            showSportsList();

                            $summerBtn.on('click', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
                                return regeneratorRuntime.wrap(function _callee$(_context) {
                                    while (1) {
                                        switch (_context.prev = _context.next) {
                                            case 0:
                                                season = "summer";
                                                yearList = summerYearList;
                                                year = yearList[0];

                                                initSlider();
                                                showSportsList();

                                            case 5:
                                            case 'end':
                                                return _context.stop();
                                        }
                                    }
                                }, _callee, _this);
                            })));

                            $winterBtn.on('click', _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
                                return regeneratorRuntime.wrap(function _callee2$(_context2) {
                                    while (1) {
                                        switch (_context2.prev = _context2.next) {
                                            case 0:
                                                season = "winter";
                                                yearList = winterYearList;
                                                year = yearList[0];

                                                initSlider();
                                                showSportsList();

                                            case 5:
                                            case 'end':
                                                return _context2.stop();
                                        }
                                    }
                                }, _callee2, _this);
                            })));

                            $slider.on("slide", function () {
                                var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3(event, ui) {
                                    return regeneratorRuntime.wrap(function _callee3$(_context3) {
                                        while (1) {
                                            switch (_context3.prev = _context3.next) {
                                                case 0:
                                                    year = yearList[ui.value];
                                                    showSportsList();

                                                case 2:
                                                case 'end':
                                                    return _context3.stop();
                                            }
                                        }
                                    }, _callee3, _this);
                                }));

                                return function (_x, _x2) {
                                    return _ref4.apply(this, arguments);
                                };
                            }());

                        case 19:
                        case 'end':
                            return _context4.stop();
                    }
                }
            }, _callee4, this);
        }));

        return function initView() {
            return _ref.apply(this, arguments);
        };
    }();

    var showSportsList = function () {
        var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6() {
            var _this2 = this;

            var sportsList;
            return regeneratorRuntime.wrap(function _callee6$(_context6) {
                while (1) {
                    switch (_context6.prev = _context6.next) {
                        case 0:
                            _context6.next = 2;
                            return sportsListLoader.getSportsList(season, year);

                        case 2:
                            sportsList = _context6.sent;
                            _context6.next = 5;
                            return hostCountryLoader.getHostCountry(season, year);

                        case 5:
                            that.hostCountry = _context6.sent;

                            $sportsList.empty();
                            _.map(sportsList, function (s) {
                                $('<label class="check-container">' + s + '<input type="checkbox" name="sports" value="' + s + '" checked></input><span class="check-mark"></span></label><br>').on("change", _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5() {
                                    return regeneratorRuntime.wrap(function _callee5$(_context5) {
                                        while (1) {
                                            switch (_context5.prev = _context5.next) {
                                                case 0:
                                                    getSportsList();

                                                case 1:
                                                case 'end':
                                                    return _context5.stop();
                                            }
                                        }
                                    }, _callee5, _this2);
                                }))).appendTo($sportsList);
                            });
                            getSportsList();

                        case 9:
                        case 'end':
                            return _context6.stop();
                    }
                }
            }, _callee6, this);
        }));

        return function showSportsList() {
            return _ref5.apply(this, arguments);
        };
    }();

    var initSlider = function () {
        var _ref7 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee7() {
            return regeneratorRuntime.wrap(function _callee7$(_context7) {
                while (1) {
                    switch (_context7.prev = _context7.next) {
                        case 0:
                            $slider.slider({
                                range: "min",
                                value: 0,
                                min: 0,
                                max: yearList.length - 1,
                                step: 1,
                                slide: function slide(event, ui) {
                                    $sliderVal.text(yearList[ui.value]);
                                    year = yearList[ui.value];
                                }
                            });
                            $sliderVal.text(yearList[0]);
                            _context7.next = 4;
                            return hostCountryLoader.getHostCountry(season, year);

                        case 4:
                            that.hostCountry = _context7.sent;

                        case 5:
                        case 'end':
                            return _context7.stop();
                    }
                }
            }, _callee7, this);
        }));

        return function initSlider() {
            return _ref7.apply(this, arguments);
        };
    }();

    var showRankTable = function () {
        var _ref8 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee8() {
            var index;
            return regeneratorRuntime.wrap(function _callee8$(_context8) {
                while (1) {
                    switch (_context8.prev = _context8.next) {
                        case 0:
                            _context8.next = 2;
                            return countryMedalRankLoader.getCountryMedalRank(season, year, checkedSports);

                        case 2:
                            countryMedalRank = _context8.sent;
                            _context8.next = 5;
                            return countryMedalValueLoader.getCountryMedalValue(season, year, checkedSports);

                        case 5:
                            that.countryMedalValue = _context8.sent;
                            index = countryMedalRank.length;

                            $('#ranking-table').empty();
                            $('<tr><th id="table-rank" >Rank</th></tr>\n               <tr><th id="table-country" >Country</th></tr>\n               <tr><th id="table-gold" ><img src="./images/gold-medal.png", height=30px, width=30px></th></tr>\n               <tr><th id="table-silver" ><img src="./images/silver-medal.png", height=30px, width=30px></th></tr>\n               <tr><th id="table-bronze" ><img src="./images/bronze-medal.png", height=30px, width=30px></th></tr>\n               <tr><th id="table-sum" >Sum</th></tr>').appendTo($('#ranking-table'));
                            _.map(countryMedalRank, function (cm, i) {
                                if (index - i <= 15) {
                                    $('#table-rank').after('<td>' + (index - i) + '</td>');
                                    $('#table-country').after('<td>' + cm['country'] + '</td>');
                                    $('#table-gold').after('<td>' + cm['GOLD'] + '</td>');
                                    $('#table-silver').after('<td>' + cm['SILVER'] + '</td>');
                                    $('#table-bronze').after('<td>' + cm['BRONZE'] + '</td>');
                                    $('#table-sum').after('<td>' + (cm['GOLD'] + cm['SILVER'] + cm['BRONZE']) + '</td>');
                                }
                            });

                            showWorldMap();

                        case 11:
                        case 'end':
                            return _context8.stop();
                    }
                }
            }, _callee8, this);
        }));

        return function showRankTable() {
            return _ref8.apply(this, arguments);
        };
    }();

    var that = this;
    this.countryMedalValue = null;
    this.hostCountry = null;

    var season = null;
    var year = null;
    var yearList = null;
    var checkedSports = null;
    var countryMedalRank = null;

    var $slider = $('#slider');
    var $sliderVal = $('#slider-value');
    var $sportsList = $('#sports-list');
    var $countryMedalRank = $('#country-medal-rank');

    function getSportsList() {
        checkedSports = [];
        $countryMedalRank.empty();
        $('input:checkbox[name="sports"]:checked').each(function () {
            checkedSports.push($(this).val());
        });
        showRankTable();
    }

    initView();
}();
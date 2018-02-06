'use strict';

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var Loader = new function () {
  var _this = this;

  this.getOlympicYears = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            return _context.abrupt('return', $.get('/a/data/years'));

          case 1:
          case 'end':
            return _context.stop();
        }
      }
    }, _callee, _this);
  }));
}();

var summerDataLoader = new function () {
  var _this2 = this;

  this.getSummerYearList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
    return regeneratorRuntime.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            return _context2.abrupt('return', $.get('/a/olympic/summer'));

          case 1:
          case 'end':
            return _context2.stop();
        }
      }
    }, _callee2, _this2);
  }));
}();

var winterDataLoader = new function () {
  var _this3 = this;

  this.getWinterYearList = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee3() {
    return regeneratorRuntime.wrap(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            return _context3.abrupt('return', $.get('/a/olympic/winter'));

          case 1:
          case 'end':
            return _context3.stop();
        }
      }
    }, _callee3, _this3);
  }));
}();

var sportsListLoader = new function (season, year) {
  var _this4 = this;

  this.getSportsList = function () {
    var _ref4 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee4(season, year) {
      return regeneratorRuntime.wrap(function _callee4$(_context4) {
        while (1) {
          switch (_context4.prev = _context4.next) {
            case 0:
              return _context4.abrupt('return', $.get('/a/olympic/' + season + '/sportsList/' + year));

            case 1:
            case 'end':
              return _context4.stop();
          }
        }
      }, _callee4, _this4);
    }));

    return function (_x, _x2) {
      return _ref4.apply(this, arguments);
    };
  }();
}();

var countryMedalRankLoader = new function (season, year, checkedSports) {
  var _this5 = this;

  this.getCountryMedalRank = function () {
    var _ref5 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee5(season, year, checkedSports) {
      return regeneratorRuntime.wrap(function _callee5$(_context5) {
        while (1) {
          switch (_context5.prev = _context5.next) {
            case 0:
              return _context5.abrupt('return', $.get('/a/olympic/' + season + '/countryMedalRank/' + year + '&' + checkedSports));

            case 1:
            case 'end':
              return _context5.stop();
          }
        }
      }, _callee5, _this5);
    }));

    return function (_x3, _x4, _x5) {
      return _ref5.apply(this, arguments);
    };
  }();
}();

var countryMedalValueLoader = new function (season, year, checkedSports) {
  var _this6 = this;

  this.getCountryMedalValue = function () {
    var _ref6 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee6(season, year, checkedSports) {
      return regeneratorRuntime.wrap(function _callee6$(_context6) {
        while (1) {
          switch (_context6.prev = _context6.next) {
            case 0:
              return _context6.abrupt('return', $.get('/a/olympic/' + season + '/countryMedalValue/' + year + '&' + checkedSports));

            case 1:
            case 'end':
              return _context6.stop();
          }
        }
      }, _callee6, _this6);
    }));

    return function (_x6, _x7, _x8) {
      return _ref6.apply(this, arguments);
    };
  }();
}();
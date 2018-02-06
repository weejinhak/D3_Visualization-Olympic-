'use strict';

/// //


var initListView = function () {
    var _ref2 = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee2() {
        var years, $years;
        return regeneratorRuntime.wrap(function _callee2$(_context2) {
            while (1) {
                switch (_context2.prev = _context2.next) {
                    case 0:
                        _context2.next = 2;
                        return Loader.getOlympicYears();

                    case 2:
                        years = _context2.sent;
                        $years = $('#years');

                        _.map(years, function (y) {
                            $('<div>' + y + '</div>').appendTo($years).on('click', function () {
                                console.log(y);
                            });
                        });

                    case 5:
                    case 'end':
                        return _context2.stop();
                }
            }
        }, _callee2, this);
    }));

    return function initListView() {
        return _ref2.apply(this, arguments);
    };
}();

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

initListView();
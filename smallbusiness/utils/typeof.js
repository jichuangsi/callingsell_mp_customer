var _typeof3 = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function(o) {
    return typeof o;
} : function(o) {
    return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
};

function _typeof2(o) {
    return (_typeof2 = "function" == typeof Symbol && "symbol" == _typeof3(Symbol.iterator) ? function(o) {
        return void 0 === o ? "undefined" : _typeof3(o);
    } : function(o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : void 0 === o ? "undefined" : _typeof3(o);
    })(o);
}

function _typeof(o) {
    return "function" == typeof Symbol && "symbol" === _typeof2(Symbol.iterator) ? module.exports = _typeof = function(o) {
        return _typeof2(o);
    } : module.exports = _typeof = function(o) {
        return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : _typeof2(o);
    }, _typeof(o);
}

module.exports = _typeof;
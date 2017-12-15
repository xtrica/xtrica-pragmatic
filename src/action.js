var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Action = /** @class */ (function () {
        function Action(parent, fields) {
            this._parent = null;
            this._defaults = {};
            this._fields = {};
            this._status = {
                error: -1,
                failure: false,
                loading: false,
                success: false,
                warning: false
            };
            if (!!parent) {
                this._parent = parent;
            }
            if (!!fields) {
                this._fields = fields;
            }
            this._status = JSON.parse(JSON.stringify(this.status));
        }
        Object.defineProperty(Action.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "fields", {
            get: function () {
                return this._fields;
            },
            set: function (fields) {
                var vm = this;
                for (var field in vm._fields) {
                    if (vm._fields.hasOwnProperty(field) && fields.hasOwnProperty(field)) {
                        vm._fields[field] = fields[field];
                    }
                    vm._defaults[field] = vm._fields[field].value;
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Action.prototype, "status", {
            get: function () {
                return this._status;
            },
            set: function (status) {
                var vm = this;
                for (var key in vm._status) {
                    if (vm._status.hasOwnProperty(key) && status.hasOwnProperty(key)) {
                        vm._status[key] = JSON.parse(JSON.stringify(status[key]));
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Action.prototype.getWarnings = function () {
            var vm = this;
            var warnings = [];
            for (var field in vm.fields) {
                if (vm.fields.hasOwnProperty(field) && vm.fields[field].hasOwnProperty('value') && vm.fields[field].hasOwnProperty('validator')) {
                    var message = vm.fields[field].validator();
                    if (message !== true) {
                        warnings.push({ field: field, message: message });
                    }
                }
            }
            return warnings;
        };
        Action.prototype.prepareRequest = function () {
            var vm = this;
            var data = {};
            for (var field in vm.fields) {
                if (vm.fields.hasOwnProperty(field) && vm.fields[field].hasOwnProperty('value')) {
                    data[field] = JSON.parse(JSON.stringify(vm.fields[field].value));
                }
            }
            return data;
        };
        Action.prototype.request = function (req) {
            return new Promise(function (resolve, reject) {
                reject(501);
            });
        };
        Action.prototype.reset = function () {
            var vm = this;
            for (var field in vm._fields) {
                if (vm._fields.hasOwnProperty(field) && vm._defaults.hasOwnProperty(field)) {
                    vm._fields[field].value = vm._defaults[field];
                }
            }
            vm._status = __assign({}, vm.status, { loading: false, warning: false, failure: false, success: false, error: -1 });
        };
        Action.prototype.submit = function () {
            var vm = this;
            return new Promise(function (resolve, reject) {
                if (vm.status.loading === false) {
                    vm.status = __assign({}, vm.status, { error: -1 });
                    if (!vm.getWarnings().length) {
                        vm.status = __assign({}, vm.status, { loading: true, warning: false, failure: false, success: false });
                        vm.request(vm.prepareRequest()).then(function (response) {
                            vm.status = __assign({}, vm.status, { loading: false, warning: false, failure: false, success: true });
                            resolve(response);
                        }, function (error) {
                            if (parseInt(error) > 399 && parseInt(error) < 500) {
                                vm.status = __assign({}, vm.status, { loading: false, warning: true, failure: false, success: false, error: parseInt(error) });
                            }
                            else {
                                vm.status = __assign({}, vm.status, { loading: false, warning: false, failure: true, success: false, error: -1 });
                            }
                            reject(vm.status.error);
                        });
                    }
                    else {
                        vm.status = __assign({}, vm.status, { loading: false, warning: true, failure: false, success: false });
                        reject(vm.status.error);
                    }
                }
                else {
                    reject(false);
                }
            });
        };
        return Action;
    }());
    exports.default = Action;
});

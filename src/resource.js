define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var Resource = /** @class */ (function () {
        function Resource(parent, attributes, resources, actions) {
            this._parent = null;
            this._attributes = {};
            this._resources = {};
            this._actions = {};
            if (!!parent) {
                this._parent = parent;
            }
            if (!!attributes) {
                this._attributes = attributes;
            }
            if (!!resources) {
                this._resources = resources;
            }
            if (!!actions) {
                this._actions = actions;
            }
        }
        Object.defineProperty(Resource.prototype, "parent", {
            get: function () {
                return this._parent;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Resource.prototype, "attributes", {
            get: function () {
                return this._attributes;
            },
            set: function (attributes) {
                var vm = this;
                for (var attribute in vm._attributes) {
                    if (vm._attributes.hasOwnProperty(attribute) && attributes.hasOwnProperty(attribute)) {
                        vm._attributes[attribute] = JSON.parse(JSON.stringify(attributes[attribute]));
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Resource.prototype, "resources", {
            get: function () {
                return this._resources;
            },
            set: function (resources) {
                var vm = this;
                for (var resource in vm._resources) {
                    if (vm._resources.hasOwnProperty(resource) && resources.hasOwnProperty(resource)) {
                        vm._resources[resource] = resources[resource];
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(Resource.prototype, "actions", {
            get: function () {
                return this._actions;
            },
            set: function (actions) {
                var vm = this;
                for (var action in vm._actions) {
                    if (vm._actions.hasOwnProperty(action) && actions.hasOwnProperty(action)) {
                        vm._actions[action] = actions[action];
                    }
                }
            },
            enumerable: true,
            configurable: true
        });
        return Resource;
    }());
    exports.default = Resource;
});

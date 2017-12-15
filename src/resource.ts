export default class Resource {
  
  private _parent = null
  private _attributes = {}
  private _resources = {}
  private _actions = {}
  
  get parent() {
    return this._parent;
  }
  
  get attributes() {
    return this._attributes;
  }
  
  set attributes(attributes) {
    let vm = this
    for (let attribute in vm._attributes) {
      if (vm._attributes.hasOwnProperty(attribute) && attributes.hasOwnProperty(attribute)) {
        vm._attributes[attribute] = JSON.parse(JSON.stringify(attributes[attribute]));
      }
    }
  }
  
  get resources() {
    return this._resources;
  }
  
  set resources(resources) {
    let vm = this
    for (let resource in vm._resources) {
      if (vm._resources.hasOwnProperty(resource) && resources.hasOwnProperty(resource)) {
        vm._resources[resource] = resources[resource];
      }
    }
  }
  
  get actions() {
    return this._actions;
  }
  
  set actions(actions) {
    let vm = this
    for (let action in vm._actions) {
      if (vm._actions.hasOwnProperty(action) && actions.hasOwnProperty(action)) {
        vm._actions[action] = actions[action];
      }
    }
  }
  
  constructor (parent, attributes, resources, actions) {
    if (!!parent) {
      this._parent = parent
    }
    if (!!attributes) {
      this._attributes = attributes
    }
    if (!!resources) {
      this._resources = resources
    }
    if (!!actions) {
      this._actions = actions
    }
  }
  
}
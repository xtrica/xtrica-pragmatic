export default class Resource {
  
  private _name = ''
  public parent = null
  private _attributes = {}
  private _resources = {}
  private _actions = {}
  
  get name () {
    return this._name;
  }
  
  get attributes () {
    return this._attributes;
  }
  
  set attributes (attributes) {
    let vm = this
    for (let attribute in vm._attributes) {
      if (vm._attributes.hasOwnProperty(attribute) && attributes.hasOwnProperty(attribute)) {
        vm._attributes[attribute] = JSON.parse(JSON.stringify(attributes[attribute]));
      }
    }
    if (this.name.length) {
      window.localStorage.setItem(this.name, JSON.stringify(this.attributes))
    }
  }
  
  get resources () {
    return this._resources;
  }
  
  set resources (resources) {
    let vm = this
    for (let resource in vm._resources) {
      if (vm._resources.hasOwnProperty(resource) && resources.hasOwnProperty(resource)) {
        vm._resources[resource] = resources[resource];
      }
    }
  }
  
  get actions () {
    return this._actions;
  }
  
  set actions (actions) {
    let vm = this
    for (let action in vm._actions) {
      if (vm._actions.hasOwnProperty(action) && actions.hasOwnProperty(action)) {
        vm._actions[action] = actions[action];
      }
    }
  }
  
  constructor (name, parent, attributes, resources, actions) {
    if (!!name && name.length) {
      this._name = name
    }
    if (!!parent) {
      this.parent = parent
    }
    if (!!attributes) {
      this._attributes = attributes
    }
    if (this.name.length) {
      let saved = window.localStorage.getItem(this.name) ? JSON.parse(window.localStorage.getItem(this.name)) : false
      if (saved) {
        this.attributes = {
          ...this.attributes, 
          ...saved
        }
      }
    }
    if (!!resources) {
      this._resources = resources
    }
    if (!!actions) {
      this._actions = actions
    }
  }
  
}
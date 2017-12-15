export default class Action {
  
  private _parent = null
  private _defaults = {}
  private _fields = {}
  private _status = {
    error: -1,
    failure: false,
    loading: false,
    success: false,
    warning: false
  }
  
  get parent() {
    return this._parent;
  }
  
  get fields() {
    return this._fields;
  }
  
  set fields(fields) {
    let vm = this
    for (let field in vm._fields) {
      if (vm._fields.hasOwnProperty(field) && fields.hasOwnProperty(field)) {
        vm._fields[field] = fields[field];
      }
      vm._defaults[field] = vm._fields[field].value
    }
  }
  
  get status() {
    return this._status;
  }
  
  set status(status) {
    let vm = this
    for (let key in vm._status) {
      if (vm._status.hasOwnProperty(key) && status.hasOwnProperty(key)) {
        vm._status[key] = JSON.parse(JSON.stringify(status[key]));
      }
    }
  }
  
  public getWarnings() {
    let vm = this
    let warnings = []
    for (let field in vm.fields) {
      if (vm.fields.hasOwnProperty(field) && vm.fields[field].hasOwnProperty('value') && vm.fields[field].hasOwnProperty('validator')) {
        let message = vm.fields[field].validator()
        if (message !== true) {
          warnings.push({ field, message })
        }
      }
    }
    return warnings
  }
  
  public prepareRequest() {
    let vm = this
    let data = {}
    for (let field in vm.fields) {
      if (vm.fields.hasOwnProperty(field) && vm.fields[field].hasOwnProperty('value')) {
        data[field] = JSON.parse(JSON.stringify(vm.fields[field].value))
      }
    }
    return data
  }
  
  public request(req) {
    return new Promise((resolve, reject) => {
      reject(501)
    })
  }
  
  public reset() {
    let vm = this
    for (let field in vm._fields) {
      if (vm._fields.hasOwnProperty(field) && vm._defaults.hasOwnProperty(field)) {
        vm._fields[field].value = vm._defaults[field];
      }
    }
    vm._status = { ...vm.status, loading: false, warning: false, failure: false, success: false, error: -1 }
  }
  
  public submit() {
    let vm = this
    return new Promise((resolve, reject) => {
      if (vm.status.loading === false) {
        vm.status = { ...vm.status, error: -1 }
        if (!vm.getWarnings().length) {
          vm.status = { ...vm.status, loading: true, warning: false, failure: false, success: false }
          vm.request(vm.prepareRequest()).then((response) => {
            vm.status = { ...vm.status, loading: false, warning: false, failure: false, success: true }
            resolve(response)
          }, (error) => {
            if (parseInt(error) > 399 && parseInt(error) < 500) {
              vm.status = { ...vm.status, loading: false, warning: true, failure: false, success: false, error: parseInt(error) }
            } else {
              vm.status = { ...vm.status, loading: false, warning: false, failure: true, success: false, error: -1 }
            }
            reject(vm.status.error)
          })
        } else {
          vm.status = { ...vm.status, loading: false, warning: true, failure: false, success: false }
          reject(vm.status.error)
        }
      } else {
        reject(false)
      }
    })
  }
  
  constructor (parent, fields) {
    if (!!parent) {
      this._parent = parent
    }
    if (!!fields) {
      this._fields = fields
    }
    this._status = JSON.parse(JSON.stringify(this.status))
  }
  
}
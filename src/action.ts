export default class Action {
  
  public parent = null
  private _defaults = {}
  private _fields = {}
  public status = {
    error: -1,
    failure: false,
    loading: false,
    success: false,
    warning: false
  }
  
  get fields () {
    return this._fields
  }
  
  set fields (fields) {
    let vm = this
    for (let field in vm._fields) {
      if (vm._fields.hasOwnProperty(field) && fields.hasOwnProperty(field)) {
        vm._fields[field] = fields[field]
        vm._defaults[field] = JSON.parse(JSON.stringify(vm._fields[field].value))
      }
    }
  }
  
  public areFieldsValid () {
    let vm = this
    for (let field in vm.fields) {
      if (vm.fields.hasOwnProperty(field) && vm.fields[field].hasOwnProperty('value') && vm.fields[field].hasOwnProperty('validator')) {
        if (vm.fields[field].validator() !== true) {
          return false
        }
      }
    }
    return true
  }
  
  public getWarnings () {
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
  
  public prepareRequest () {
    let vm = this
    let data = {}
    for (let field in vm.fields) {
      if (vm.fields.hasOwnProperty(field) && vm.fields[field].hasOwnProperty('value')) {
        data[field] = JSON.parse(JSON.stringify(vm.fields[field].value))
      }
    }
    return data
  }
  
  public request (req) {
    return new Promise((resolve, reject) => {
      reject(501)
    })
  }
  
  public resetFields () {
    let vm = this
    for (let field in vm._fields) {
      if (vm._fields.hasOwnProperty(field) && vm._defaults.hasOwnProperty(field)) {
        vm._fields[field].value = JSON.parse(JSON.stringify(vm._defaults[field]))
      }
    }
  }
  
  public reset () {
    let vm = this
    vm.resetFields()
    vm.status = { loading: false, warning: false, failure: false, success: false, error: -1 }
  }
  
  public submit () {
    let vm = this
    return new Promise((resolve, reject) => {
      if (vm.status.loading === false) {
        vm.status = { ...vm.status, loading: true, error: -1 }
        if (vm.areFieldsValid()) {
          vm.status = { ...vm.status, warning: false, failure: false, success: false }
          vm.request(vm.prepareRequest()).then((response) => {
            vm.status = { ...vm.status, loading: false, warning: false, failure: false, success: true }
            resolve(response)
          }, (error) => {
            if (parseInt(error) > 399 && parseInt(error) < 500) {
              vm.status = { loading: false, warning: true, failure: false, success: false, error: parseInt(error) }
            } else {
              vm.status = { loading: false, warning: false, failure: true, success: false, error: -1 }
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
      this.parent = parent
    }
    if (!!fields) {
      this._fields = fields
    }
    this.status = JSON.parse(JSON.stringify(this.status))
  }
  
}
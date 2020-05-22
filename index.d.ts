declare module "@rplan/config" {
  import nconf = require('nconf')
  const Provider: nconf.Provider
  export = Provider
}

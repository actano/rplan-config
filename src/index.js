import { Provider } from 'nconf'
import nconfYaml from 'nconf-yaml'
import { boolean } from 'boolean'

import findFile from './find-file'

const CONFIG_FILE = '.rplan-config.yml'
const nconf = new Provider()

// use memory for in-process overriding of values
nconf.use('memory')

// command line arguments
nconf.argv()

// put environment variables into conf
//    (__ is the separator, e.g. 'export app__port=8081')
nconf.env('__')

if (process.env.RPLAN_ADDITIONAL_CONFIG_FILES) {
  const additionalConfigFiles = process.env.RPLAN_ADDITIONAL_CONFIG_FILES.split(',')
  for (const configFile of additionalConfigFiles.reverse()) {
    nconf.add(
      configFile,
      {
        type: 'file',
        format: nconfYaml,
        file: configFile,
      },
    )
  }
}

// read defaults from .rplan-config.yml
nconf.add('default-config', {
  type: 'file',
  format: nconfYaml,
  file: findFile(CONFIG_FILE, process.cwd()),
})

/* get a value from config and convert it to boolean,
   uses https://www.npmjs.com/package/boolean for the conversion
 */
nconf.getBoolean = configKey => boolean(nconf.get(configKey))

nconf.getModuleConfig = moduleId => nconf.get(`module:${moduleId}`) || {}

export default nconf

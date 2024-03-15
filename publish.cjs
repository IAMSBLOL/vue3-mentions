const path = require('path')

const fsextra = require('fs-extra')

const shell = require('shelljs')
const fs = require('fs')

const resolveApp = relativePath => path.resolve(appDirectory, relativePath)

const appDirectory = fs.realpathSync(process.cwd())

const lib = resolveApp('lib')
const types = resolveApp('lib/dist/types')
const typesSrc = resolveApp('lib/dist/types/src')
const dts = resolveApp('lib/dist/types/src/components/rich-mentions')

const npmpackage = resolveApp('npmpackage')
fsextra.copySync(dts, types)
fsextra.removeSync(typesSrc)
fsextra.copySync(lib, npmpackage)

shell.exec('npm version patch', { cwd: './npmpackage' })
shell.exec('npm publish ./npmpackage')
// fsextra.removeSync('./npmpackage/')

/**
 * Executes flow type checking
 * @param core
 */
const flow = (core) => {
  const cliTools = core.getCliTools()
  const config = core.getConfig()

  core.getJobmanager().addJob('flow', 'Flow')

  const childProcess = core.getSpawner().spawnJobNpx(getCommandParameters(config))

  // this is new
  const results = []
  const errors = []

  childProcess.stdout.on('data', function (data) {
    results.push(data)
  })

  childProcess.stderr.on('data', function (data) {
    errors.push(data)
  })

  childProcess.on('error', function (exception) {
    console.log('An Error occured while type checking:', exception)
  })

  childProcess.on('exit', function (code) {
    core.getJobmanager().reportFinishJob('flow')
    const output = [].concat(results, errors).join('\n').trim()

    if (output.length > 0) {
      if (code !== 0 || errors.length > 0) {
        if (config.flow.breakOnError) {
          cliTools.error(output)
          core.reportError('Flow reports errors.')
        } else {
          cliTools.warn(output)
          core.reportBuildNotes('Flow reports notes.')
        }
      } else {
        cliTools.info(output)
      }
    }

    core.getJobmanager().finishJob('flow')

  })
}

/**
 * Get the parameters for the cli flow command
 * @param config
 * @returns {string[]}
 */
const getCommandParameters = function (config) {
  const parameters = [
    'flow'
  ]

  return parameters
}

module.exports = flow

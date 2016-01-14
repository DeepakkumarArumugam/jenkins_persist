'use strict'

require('shelljs/global')

var rowOrRows = function (number) {
  return number === 1 ? 'row' : 'rows'
}

exports.formatScript = function (file) {
  return sed(/--.*/g, '', file)
}

exports.insertSuccess = function (numRows, table) {
  return 'Inserted ' + numRows + ' ' + rowOrRows(numRows) + ' into ' + table
}

exports.log = function (text) {
  console.log('[jenkins-persist]: ' + text)
}

exports.help = function () {
  console.log('Usage:')
  console.log('  jenkins-persist [options]')
  console.log('')
  console.log('Options:')
  console.log('  --init      Initialize Database')
  console.log('              [-f] for optional SQL file')
  console.log('  --build     Write to the build table')
  console.log('  --release   Write to the release table')
  console.log('  -h,--help   Display this message')
  console.log('')
}

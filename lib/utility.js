'use strict'

var sh = require('shelljs')

function rowOrRows (number) {
  return number === 1 ? 'row' : 'rows'
}

exports.formatScript = function (file) {
  return sh.sed(/--.*/g, '', file)
}

exports.insertSuccess = function (numRows, table) {
  return 'Inserted ' + numRows + ' ' + rowOrRows(numRows) + ' into ' + table
}

exports.log = function (text) {
  console.log('[jenkins-persist]: ' + text)
}

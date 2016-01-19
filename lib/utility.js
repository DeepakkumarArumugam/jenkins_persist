'use strict'

var sh = require('shelljs')

/**
 * Use proper grammer in the `insertSuccess` function
 *
 * @param {number} The number of rows from the query.
 */
function rowOrRows (number) {
  return number === 1 ? 'row' : 'rows'
}

/**
 * Remove all comments in a SQL script before sending it to the query method.
 *
 * @param {string} Path to a SQL script file.
 */
exports.formatScript = function (file) {
  return sh.sed(/(--.*)|(((\/\*)+?[\w\W]+?(\*\/)+))/g, '', file)
}

/**
 * Return how many rows were insterted into what table.
 *
 * @param {number} The number of rows.
 * @param {string} The name of the table.
 */
exports.insertSuccess = function (numRows, table) {
  return 'Inserted ' + numRows + ' ' + rowOrRows(numRows) + ' into ' + table
}

/**
 * Prepend strings before logging to the conosle.
 *
 * @param {string} The text to append to the log.
 */
exports.log = function (text) {
  console.log('[jenkins-persist]: ' + text)
}

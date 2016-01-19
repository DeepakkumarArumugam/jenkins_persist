'use strict'

var path = require('path')
var appRoot = require('app-root-path')
var mysql = require('mysql')
var u = require('./utility')

var database = process.env.MYSQL_DATABASE || 'jenkins'
var host = process.env.MYSQL_HOST || 'localhost'
var port = process.env.MYSQL_PORT || '3306'
var user = process.env.MYSQL_USER || 'jenkins'

var mysqlConfig = {
  database: database,
  host: host,
  password: process.env.MYSQL_PASSWORD,
  port: port,
  user: user
}

var conn = mysql.createConnection(mysqlConfig)

/**
 * Get fully-qualified table name.
 *
 * @param {string} name of table in database.
 */
function table (tableName) {
  return database + '.' + tableName
}

/**
 * Insert Jenkins environment variables into the `build_history` table.
 */
exports.build = function () {
  conn.connect()
  conn.query('INSERT INTO ?? SET ?', [
    table('build_history'), {
      BUILD_ID: process.env.BUILD_ID,
      BUILD_NUMBER: process.env.BUILD_NUMBER,
      BUILD_URL: process.env.BUILD_URL,
      BUILD_TAG: process.env.BUILD_TAG,
      DOCKER_REPO: process.env.DOCKER_REPO,
      DOCKER_TAG: process.env.DOCKER_TAG,
      GIT_BRANCH: process.env.GIT_BRANCH,
      GIT_COMMIT: process.env.GIT_COMMIT,
      GIT_URL: process.env.GIT_URL,
      JOB_NAME: process.env.JOB_NAME
    }
  ], function (err, result) {
    if (err) throw err
    u.log(u.insertSuccess(result.affectedRows, table('build_history')))
    u.log(table('build_history') + '_id: ' + result.insertId)
  })
  conn.end()
}

/**
 * Initialize the database.
 *
 * @param {string} SQL script file
 */
exports.init = function (flag) {
  mysqlConfig['multipleStatements'] = true
  var defaultScript = path.normalize(appRoot + '/create_db.sql')
  var scriptFile = flag || defaultScript
  var initConn = mysql.createConnection(mysqlConfig)
  initConn.connect()
  initConn.query(u.formatScript(scriptFile), function (err, result) {
    if (err) {
      u.log('Error: Problem with SQL statement at index ' + err.index)
      u.log(err)
    }
    u.log(scriptFile)
    u.log('initialized database')
  })
  initConn.end()
}

/**
 * Insert Jenkins environment variables into the `release` table.
 */
exports.release = function () {
  conn.connect()
  conn.query('SELECT ?? FROM ?? WHERE ?? = ?', [
      'build_history_id',
      table('build_history'),
      'BUILD_TAG',
      process.env.BUILD_TAG
  ], function (err, result) {
    if (err) u.log(err)
    conn.query('INSERT INTO ?? SET ?', [
      table('release'), {
        build_history_id: result[0]['build_history_id'],
        BUILD_ID: process.env.BUILD_ID,
        BUILD_NUMBER: process.env.BUILD_NUMBER,
        BUILD_URL: process.env.BUILD_URL,
        BUILD_TAG: process.env.BUILD_TAG,
        DOCKER_REPO: process.env.DOCKER_REPO,
        DOCKER_TAG: process.env.DOCKER_TAG,
        ENVIRONMENT: process.env.ENVIRONMENT,
        JOB_NAME: process.env.JOB_NAME
      }
    ], function (err, result) {
      if (err) throw err
      u.log(u.insertSuccess(result.affectedRows, table('release')))
      u.log(table('release') + '_id: ' + result.insertId)
      conn.end()
    })
  })
}

#!/usr/bin/env node
'use strict'
require('shelljs/global')

var path = require('path')
var argv = require('minimist')(process.argv.slice(2))
var mysql = require('mysql')

var database = process.env.MYSQL_DATABASE || 'jenkins'
var host = process.env.MYSQL_HOST || 'localhost'
var port = process.env.MYSQL_PORT || '3306'
var user = process.env.MYSQL_USER || 'jenkins'

var mysqlConfig = {
  database: database,
  host: host,
  multipleStatements: true,
  password: process.env.MYSQL_PASSWORD,
  port: port,
  user: user
}

var conn = mysql.createConnection(mysqlConfig)

var environment = {
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

var insertSuccess = function (numRows, table) {
  return 'Inserted ' + numRows + ' ' + rowOrRows(numRows) + ' into ' + table
}

var log = function (text) {
  console.log('[jenkins-persist]: ' + text)
}

var rowOrRows = function (text) {
  return text === 1 ? 'row' : 'rows'
}

var table = function (tableName) {
  return mysqlConfig.database + '.' + tableName
}

var help = function () {
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

if (!mysqlConfig.password) {
  log('ERROR: Set password with MYSQL_PASSWORD environment variable.')
  process.exit()
}

/* ****************************************************************************
 * MySql Queries
 * ***************************************************************************/
conn.connect()

if (argv.h || argv.help) {
  help()
} else if (argv.init) {
  var scriptFile = argv.f ? argv.f : path.join(__dirname, 'create_db.sql')
  var formattedScript = sed(/--.*/g, '', scriptFile)
  log(scriptFile)
  mysqlConfig['multipleStatements'] = true
  var conn2 = mysql.createConnection(mysqlConfig)
  conn2.query(formattedScript, function (err, result) {
    if (err) {
      log('ERROR: Problem with SQL statement at index ' + err.index)
      throw err
    }
  })
  conn2.end()
  log('initialized database')
} else if (argv.release) {
  conn.query('INSERT INTO ?? SET ?', [
    table('release'),
    environment
  ], function (err, result) {
    if (err) throw err
    log(insertSuccess(result.affectedRows, table('release')))
    log('result_id: ' + result.insertId)
  })
} else if (argv.build) {
  conn.query('INSERT INTO ?? SET ?', [
    table('build_history'),
    environment
  ], function (err, result) {
    if (err) throw err
    log(insertSuccess(result.affectedRows, table('build_history')))
    log('build_history_id: ' + result.insertId)
  })
} else {
  help()
}

conn.end()

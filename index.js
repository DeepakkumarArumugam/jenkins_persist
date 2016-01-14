#!/usr/bin/env node
'use strict'
require('shelljs/global')

var path = require('path')
var argv = require('minimist')(process.argv.slice(2))
var mysql = require('mysql')
var u = require('./lib/utility')

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

var table = function (tableName) {
  return mysqlConfig.database + '.' + tableName
}

if (!mysqlConfig.password) {
  u.log('Error: Set password with MYSQL_PASSWORD environment variable.')
  process.exit()
}

/* ****************************************************************************
 * CLI Options
 * ***************************************************************************/
var conn = mysql.createConnection(mysqlConfig)

if (argv.h || argv.help) {
  u.help()
} else if (argv.init) {
  mysqlConfig['multipleStatements'] = true
  var defaultScript = path.join(__dirname, 'create_db.sql')
  var scriptFile = argv.f ? argv.f : defaultScript
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
} else if (argv.release) {
  conn.connect()
  conn.query({
    sql: 'SELECT ?? FROM ?? WHERE ?? = ?',
    values: [
      'build_history_id',
      table('build_history'),
      'BUILD_TAG',
      process.env.BUILD_TAG
    ]
  }, function (err, result) {
    if (err) u.log(err)
    conn.query('INSERT INTO ?? SET ?', [
      table('release'),
      {
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
} else if (argv.build) {
  conn.connect()
  conn.query('INSERT INTO ?? SET ?', [
    table('build_history'),
    {
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
} else {
  u.help()
}

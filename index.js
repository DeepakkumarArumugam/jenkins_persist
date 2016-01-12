#!/usr/bin/env node

'use strict'

var mysql = require('mysql')

var database = process.env.MYSQL_DATABASE || 'jenkins'
var host = process.env.MYSQL_HOST || 'localhost'
var port = process.env.MYSQL_PORT || '3306'
var user = process.env.MYSQL_USER || 'jenkins'

var creds = {
  database: database,
  host: host,
  password: process.env.MYSQL_PASSWORD,
  port: port,
  user: user
}

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

var conn = mysql.createConnection(creds)

var log = function (text) {
  console.log('[jenkins_persist]: ' + text)
}

if (!creds.password) {
  console.log('ERR: Set password with MYSQL_PASSWORD environment variable.')
  process.exit()
}

conn.connect()

conn.query('INSERT INTO build_history SET ?', environment, function (err, result) {
  if (err) throw err
  var row = result.affectedRows === 1 ? 'row' : 'rows'
  log('Inserted ' + result.affectedRows + ' ' + row + ' into ' + creds.database + '.build_history')
  log('build_history_id: ' + result.insertId)
})

conn.end()

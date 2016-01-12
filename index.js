#!/usr/bin/env node

'use strict'

var EOL = require('os').EOL
var mysql = require('mysql')

var creds = {
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  password: process.env.MYSQL_PASSWORD,
  port: process.env.MYSQL_PORT,
  user: process.env.MYSQL_USER
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

var error = function (property) {
  console.log(property + ' not found.' + EOL + '  Needs `MYSQL_' + property.toUpperCase() + '` set')
}

if (!creds.database || !creds.host || !creds.password || !creds.user) {
  if (!creds.database) error('database')
  if (!creds.host) error('host')
  if (!creds.password) error('password')
  if (!creds.user) error('user')
  process.exit()
}

var conn = mysql.createConnection(creds)

conn.connect()

conn.query('INSERT INTO build_history SET ?', environment, function (err, result) {
  if (err) throw err
})

conn.end()

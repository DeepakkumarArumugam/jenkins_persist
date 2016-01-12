'use strict'

var mysql = require('mysql')
var auth = require('./auth.json')
var conn = mysql.createConnection({
  database: 'jenkins',
  host: 'localhost',
  password: auth.password,
  user: 'root'
})

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
  JOB_NAME: process.env.JOB_NAME,
}

conn.connect()
conn.query('INSERT INTO build_history SET ?', environment, function (err, result) {
  if (err) throw err
})
conn.end()

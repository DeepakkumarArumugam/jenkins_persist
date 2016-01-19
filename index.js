#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2))
var query = require('./lib/query')
var w = console.log

if (!process.env.MYSQL_PASSWORD) {
  w('Error: Set password with MYSQL_PASSWORD environment variable.')
} else if (argv.init) {
  query.init(argv.f)
} else if (argv.release) {
  query.release()
} else if (argv.build) {
  query.build()
} else {
  w('Usage:')
  w('  jenkins-persist [options]')
  w('')
  w('Options:')
  w('  --build     Write to the build table')
  w('  --init      Initialize Database')
  w('              (specify optional file with -f)')
  w('  --release   Write to the release table')
  w('')
}


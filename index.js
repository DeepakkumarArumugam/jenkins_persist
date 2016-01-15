#!/usr/bin/env node

'use strict'

var argv = require('minimist')(process.argv.slice(2))
var query = require('./lib/query')
var u = require('./lib/utility')

if (!process.env.MYSQL_PASSWORD) {
  u.log('Error: Set password with MYSQL_PASSWORD environment variable.')
  process.exit()
}

if (argv.init) {
  query.init(argv.f)
} else if (argv.release) {
  query.release()
} else if (argv.build) {
  query.build()
} else {
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

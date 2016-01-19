#!/usr/bin/env node
'use strict'

var argv = require('minimist')(process.argv.slice(2))
var query = require('./lib/query')
var help = function () {
  console.log('')
  console.log('Usage:')
  console.log('  jenkins-persist [options]')
  console.log('')
  console.log('Options:')
  console.log('  --build     Write to the build table')
  console.log('  --init      Initialize Database')
  console.log('              (specify optional file with -f)')
  console.log('  --release   Write to the release table')
  console.log('')
}

if (argv.init) {
  query.init(argv.f)
} else if (argv.release) {
  query.release()
} else if (argv.build) {
  query.build()
} else {
  help()
}

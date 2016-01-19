'use strict'

var hook = require('./../lib/hook-stdout')
var u = require('./../lib/utility')

describe('the insert success message', function () {
  it('should display "row" if first parameter is 1', function () {
    var result = 'Inserted 1 row into test'
    expect(u.insertSuccess(1, 'test')).toBe(result)
  })
  it('should display "rows" if first parameter is less than 1', function () {
    var result = 'Inserted 0 rows into test'
    expect(u.insertSuccess(0, 'test')).toBe(result)
  })
  it('should display "rows" if first parameter is greater than 1', function () {
    var result = 'Inserted 2 rows into test'
    expect(u.insertSuccess(2, 'test')).toBe(result)
  })
})

describe('the log', function () {
  it('should return a prepended string', function () {
    var unhook = hook.setup(function (string) {
      return expect(string).toContain('[jenkins-persist]: test')
    })
    u.log('test')
    unhook()
  })
})

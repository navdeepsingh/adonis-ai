const Ioc = require('adonis-fold').Ioc

Ioc.bind('Adonis/Providers/MyName', function () {
  return 'Harminder Virk'
})

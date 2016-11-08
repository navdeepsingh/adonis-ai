'use strict'

const ServiceProvider = require('adonis-fold').ServiceProvider

class MyNameProvider extends ServiceProvider {

    * register() {

        this.app.bind('Adonis/Provider/MyName', function() {
            return 'Navdeep Singh'
        })

    }

}

module.exports = MyNameProvider

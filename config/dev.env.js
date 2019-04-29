var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BASE_URL: '"http://localhost:8081/"',
    APP_API_KEY: '"ADFD4155DF47B5F1E29841D636AC5DA2"'
})

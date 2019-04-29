var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
    NODE_ENV: '"development"',
    BASE_URL: '"http://localhost:8081/"',
    APP_API_KEY: '"9z3f4x6th3ssxgktn652efqymsh69h369"'
})

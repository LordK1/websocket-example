/**
 * Created by k1 on 12/11/15.
 */

module.exports = {
    "DB_URL": process.env.MONGOLAB_URI ||
    process.env.MONGOHQ_URL ||
    'mongodb://localhost/chattr-db', // looks like mongodb://<user>:<pass>@mongo.onmodulus.net:27017/Mikha4ot
    "COOKIE_SECRET": 'chattr-socketter',
    "COOKIE_NAME": 'connect.sid'
}
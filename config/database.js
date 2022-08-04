const mysql = require('mysql2/promise');
const {logger} = require('./winston');

// TODO: 본인의 DB 계정 입력
const pool = mysql.createPool({
    host: 'db-fooddelivery.cbhwuiix3akv.ap-northeast-2.rds.amazonaws.com',
    user: 'admin',
    port: '3306',
    password: '00000001',
    database: 'FoodDelivery'
});

module.exports = {
    pool: pool
};
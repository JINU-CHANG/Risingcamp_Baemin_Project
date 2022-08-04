const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const storeProvider = require("./storeProvider");
const storeDao = require("./storeDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

//카트메뉴 삭제
exports.deleCartMenu = async function (deleteParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteResult = await storeDao.deleteCart(connection,deleteParams);
    connection.release();
    return deleteResult;

}
//카트메뉴 추가
exports.addCartMenu = async function (addCartMenuParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const addCartMenuResult = await storeDao.insertCartMenu(connection,addCartMenuParams);
    connection.release();
    return addCartMenuResult;

}
const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const userDao = require("./userDao");

// Provider: Read 비즈니스 로직 처리

exports.retrieveUserList = async function (email) {
  if (!email) {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUser(connection);
    connection.release();

    return userListResult;

  } else {
    const connection = await pool.getConnection(async (conn) => conn);
    const userListResult = await userDao.selectUserEmail(connection, email);
    connection.release();

    return userListResult;
  }
};

exports.retrieveUser = async function (userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userResult = await userDao.selectUserId(connection, userId);
  connection.release();

  return userResult;
};

//이메일 체크
exports.emailCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const emailCheckResult = await userDao.selectUserEmail(connection, email);
  connection.release();

  return emailCheckResult;
};

//닉네임 체크
exports.nicknameCheck = async function (nickname) {
  const connection = await pool.getConnection(async (conn) => conn);
  const nicknameCheckResult = await userDao.selectUserNickname(connection, nickname);
  connection.release();

  return nicknameCheckResult;
};

exports.passwordCheck = async function (selectUserPasswordParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const passwordCheckResult = await userDao.selectUserPassword(
      connection,
      selectUserPasswordParams
  );
  connection.release();
  return passwordCheckResult;
};

exports.accountCheck = async function (email) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userAccountResult = await userDao.selectUserAccount(connection, email);
  connection.release();
  
  return userAccountResult;
};

exports.retrieveCoupons = async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userCouponsResult = await userDao.selectUserCoupons(connection, userId);
  connection.release();

  return userCouponsResult;
};

exports.retrieveReviews = async function(userId) {
  const connection = await pool.getConnection(async (conn) => conn);
  const userReviewsResult = await userDao.selectUserReviews(connection, userId);
  connection.release();

  return userReviewsResult;
}


exports.retrieveOrders = async function(userId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const userOrdersResult = await userDao.selectUserOrders(connection, userId);
  connection.release();

  return userOrdersResult;
}

exports.retrieveOrderDetails = async function(orderDetailsParams) {
  const connection = await pool.getConnection(async (conn) => conn);
  const orderDetailsResult = await userDao.selectOrderDetails(connection, orderDetailsParams);
  connection.release();

  return orderDetailsResult;
}

//찜 조회
exports.retrieveLikeStore = async function(userId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const userLikeStoresResult = await userDao.selectUserLikeStores(connection, userId);
  connection.release();

  return userLikeStoresResult;
}

//등급별 혜택 조회
exports.retrieveClassDetails = async function(userId) {

  const connection = await pool.getConnection(async (conn) => conn);
  const userClassDetailsResult = await userDao.selectUserClassDetails(connection, userId);
  connection.release();

  return userClassDetailsResult;
}
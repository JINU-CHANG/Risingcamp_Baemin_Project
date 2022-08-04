const {logger} = require("../../../config/winston");
const {pool} = require("../../../config/database");
const secret_config = require("../../../config/secret");
const userProvider = require("./userProvider");
const userDao = require("./userDao");
const baseResponse = require("../../../config/baseResponseStatus");
const {response} = require("../../../config/response");
const {errResponse} = require("../../../config/response");

const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const {connect} = require("http2");

// Service: Create, Update, Delete 비즈니스 로직 처리

exports.createUser = async function (email, password, nickname, phoneNumber) {
    try {
        // 이메일 중복 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_EMAIL);

        // 비밀번호 암호화
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");


        const insertUserInfoParams = [email, hashedPassword, nickname, phoneNumber];

        const connection = await pool.getConnection(async (conn) => conn);

        const userIdResult = await userDao.insertUserInfo(connection, insertUserInfoParams);
        console.log(`추가된 회원 : ${userIdResult[0].insertId}`)
        connection.release();
        return response(baseResponse.SIGNUP_SUCCESS);


    } catch (err) {
        logger.error(`App - createUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};


// TODO: After 로그인 인증 방법 (JWT)
exports.postSignIn = async function (email, password) {
    try {
        // 이메일 여부 확인
        const emailRows = await userProvider.emailCheck(email);
        if (emailRows.length < 1) return errResponse(baseResponse.SIGNIN_EMAIL_WRONG);
        console.log(emailRows);
        const selectEmail = emailRows[0].email

        // 비밀번호 확인
        const hashedPassword = await crypto
            .createHash("sha512")
            .update(password)
            .digest("hex");

        const selectUserPasswordParams = [selectEmail, hashedPassword];
        const passwordRows = await userProvider.passwordCheck(selectUserPasswordParams);

        if (passwordRows[0].password !== hashedPassword) {
            return errResponse(baseResponse.SIGNIN_PASSWORD_WRONG);
        }

        // 계정 상태 확인
        const userInfoRows = await userProvider.accountCheck(email);
        if (userInfoRows[0].status === "INACTIVE") {
            return errResponse(baseResponse.SIGNIN_INACTIVE_ACCOUNT);
        } else if (userInfoRows[0].status === "DELETED") {
            return errResponse(baseResponse.SIGNIN_WITHDRAWAL_ACCOUNT);
        }

        console.log(userInfoRows[0].userId) // DB의 userId

        //토큰 생성 Service
        let token = await jwt.sign(
            {
                userId: userInfoRows[0].userId,
            }, // 토큰의 내용(payload)
            secret_config.jwtsecret, // 비밀키
            {
                expiresIn: "365d",
                subject: "userInfo",
            } // 유효 기간 365일
        );

        return response(baseResponse.SUCCESS, {'userId': userInfoRows[0].userId, 'jwt': token});

    } catch (err) {
        logger.error(`App - postSignIn Service error\n: ${err.message} \n${JSON.stringify(err)}`);
        return errResponse(baseResponse.DB_ERROR);
    }
};

//회원 정보 수정
exports.editUser = async function (id, nickname) {
    try {

        // 닉네임 중복 확인
        const nicknameRows = await userProvider.nicknameCheck(nickname);
        if (nicknameRows.length > 0)
            return errResponse(baseResponse.SIGNUP_REDUNDANT_NICKNAME);

        const connection = await pool.getConnection(async (conn) => conn);
        const editUserResult = await userDao.updateUserInfo(connection, id, nickname)
        connection.release();

        return response(baseResponse.PATCH_USER_SUCCESS);

    } catch (err) {
        logger.error(`App - editUser Service error\n: ${err.message}`);
        return errResponse(baseResponse.DB_ERROR);
    }
}
//리뷰 작성
exports.createReview = async function (userId, storeId, imgUrl, grade, reviewText) {
    const insertNewReviewParams = [userId, storeId, imgUrl, grade, reviewText];

    const connection = await pool.getConnection(async (conn) => conn);

    const newReviewResult = await userDao.insertNewReview(connection, insertNewReviewParams);
    connection.release();
    return response(baseResponse.SUCCESS);

}

//리뷰 수정
exports.patchReview = async function (userId, reviewId, imgUrl, grade, reviewText) {
    const patchReviewParams = [userId, reviewId, imgUrl, grade, reviewText];

    const connection = await pool.getConnection(async (conn) => conn);

    const updateReviewResult = await userDao.updateReview(connection, patchReviewParams);
    connection.release();
    return response(baseResponse.SUCCESS);

}


//리뷰 삭제

exports.deleteReview = async function (deleteParams) {
    const connection = await pool.getConnection(async (conn) => conn);
    const deleteResult = await userDao.deleteReview(connection,deleteParams);
    connection.release();
    return deleteResult;

}

//찜 추가

exports.createLikeStore = async function (LikeStoreParams) {

    const connection = await pool.getConnection(async (conn) => conn);

    const LikeStoreResult = await userDao.insertLikeStore(connection, LikeStoreParams);
    connection.release();
    return response(baseResponse.POST_SUCCESS);

}
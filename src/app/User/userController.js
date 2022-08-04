const jwtMiddleware = require("../../../config/jwtMiddleware");
const userProvider = require("../../app/User/userProvider");
const userService = require("../../app/User/userService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

const regexEmail = require("regex-email");
const {emit} = require("nodemon");

/**
 * API No. 0
 * API Name : 테스트 API
 * [GET] /app/test
 */
 /*exports.getTest = async function (req, res) {
    console.log("GET 메소드...");
    res.json({message : "GET 메소드 성공!!!"});
 }*/



/**
 * API No. 1
 * API Name : 유저 생성 (회원가입) API
 * [POST] /app/users
 */
exports.postUsers = async function (req, res) {

    /**
     * Body: email, password, nickname, phoneNumber
     */
    const {email, password, nickname, phoneNumber} = req.body;

    // 이메일 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // 이메일 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // 이메일 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // pw 빈 값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // pw 길이 체크
    if (password.length<6 || password.length>30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    // 닉네임 빈 값 체크
    if (!nickname)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_EMPTY));

    // 닉네임 길이 체크
    if (nickname.length>20)
        return res.send(response(baseResponse.SIGNUP_NICKNAME_LENGTH));

    // 전화번호 빈 값 체크
    if (!phoneNumber)
        return res.send(response(baseResponse.SIGNUP_PHONENUMBER_EMPTY));

    // 전화번호 형식 체크
    if (!/^[0-9]{3}-[0-9]{3,4}-[0-9]{4}/.test(phoneNumber))
       return res.send(response(baseResponse.SIGNUP_PHONENUMBER_ERROR_TYPE));


    const signUpResponse = await userService.createUser(
        email,
        password,
        nickname,
        phoneNumber
    );

    return res.send(signUpResponse);
};

/**
 * API No. 2
 * API Name : 유저 조회 API (+ 이메일로 검색 조회)
 * [GET] /app/users
 */
exports.getUsers = async function (req, res) {

    /**
     * Query String: email
     */
    const email = req.query.email;

    if (!email) {
        // 유저 전체 조회
        const userListResult = await userProvider.retrieveUserList();
        return res.send(response(baseResponse.SUCCESS, userListResult));
    } else {
        // 유저 검색 조회
        const userListByEmail = await userProvider.retrieveUserList(email);
        return res.send(response(baseResponse.SUCCESS, userListByEmail));
    }
};

/**
 * API No. 3
 * API Name : 특정 유저 조회 API
 * [GET] /app/users/{userId}
 */
exports.getUserById = async function (req, res) {

    /**
     * Path Variable: userId
     */
    const userId = req.params.userId;

    console.log(userId);

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userByUserId = await userProvider.retrieveUser(userId);
    return res.send(response(baseResponse.SUCCESS, userByUserId));
};


// TODO: After 로그인 인증 방법 (JWT)
/**
 * API No. 4
 * API Name : 로그인 API
 * [POST] /app/login
 * body : email, passsword
 */
exports.login = async function (req, res) {

    const {email, password} = req.body;

    // TODO: email, password 형식적 Validation

    // email 빈 값 체크
    if (!email)
        return res.send(response(baseResponse.SIGNUP_EMAIL_EMPTY));

    // email 길이 체크
    if (email.length > 30)
        return res.send(response(baseResponse.SIGNUP_EMAIL_LENGTH));

    // email 형식 체크 (by 정규표현식)
    if (!regexEmail.test(email))
        return res.send(response(baseResponse.SIGNUP_EMAIL_ERROR_TYPE));

    // pw 빈값 체크
    if (!password)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_EMPTY));

    // pw 길이 체크
    if (password.length<6 || password.length>30)
        return res.send(response(baseResponse.SIGNUP_PASSWORD_LENGTH));

    const signInResponse = await userService.postSignIn(email, password);

    return res.send(signInResponse);
};


/**
 * API No. 5
 * API Name : 회원 정보 수정 API + JWT + Validation
 * [PATCH] /app/users/:userId
 * path variable : userId
 * body : nickname
 */
exports.patchUsers = async function (req, res) {

    // jwt - userId, path variable :userId

    const userIdFromJWT = req.verifiedToken.userId

    const userId = req.params.userId;
    const nickname = req.body.nickname;

    if (userIdFromJWT != userId) {
        res.send(errResponse(baseResponse.USER_ID_NOT_MATCH));
    } else {
        if (!nickname) return res.send(errResponse(baseResponse.USER_NICKNAME_EMPTY));

        const editUserInfo = await userService.editUser(userId, nickname)
        return res.send(editUserInfo);
    }
};

/**
 * 유저 쿠폰 조회 API
 * [GET] /app/users/:userId/coupons
 */

exports.getCoupons = async function (req, res) {

    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userCoupons = await userProvider.retrieveCoupons(userId);
    return res.send(response(baseResponse.SUCCESS, userCoupons));
};


/**
 * 유저 리뷰 내역 조회 API
 * [GET] /app/users/:userId/reviews
 */
exports.getUserReviews = async function(req, res) {

    const userId = req.params.userId;

    if (!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userReviews = await userProvider.retrieveReviews(userId);
    return res.send(response(baseResponse.SUCCESS, userReviews));

}

/**
 * 유저 주문 내역 조회 API
 * [GET] /app/users/:userId/orders
 */

exports.getUserOrders = async function(req, res) {

    const userId = req.params.userId;

    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userOrders = await userProvider.retrieveOrders(userId);
    return res.send(response(baseResponse.SUCCESS, userOrders));
}

/**
 * 특정 주문 내역 상세 조회 API
 * [GET] /app/users/:userId/orders
 */

exports.getOrderDetails = async function(req, res) {

    const userId = req.params.userId;
    const orderId = req.body.orderId;

    const orderDetailsParams = [userId, orderId];
    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));
    if(!orderId) return res.send(errResponse(baseResponse.ORDERID_EMPTY));

    const orderDetails = await userProvider.retrieveOrderDetails(orderDetailsParams);
    return res.send(response(baseResponse.SUCCESS, orderDetails));
}

/**리뷰 작성 API
 * [post] /app/newReview
 */

exports.postReviews = async function (req, res) {
    const userId =  req.verifiedToken.userId

    const {storeId, imgUrl, grade, reviewText} = req.body;

    //가게 id값 체크
    if(!storeId) return res.send(errResponse(baseResponse.STOREID_EMPTY));

    //평점 체크
    if(!grade) return res.send(errResponse(baseResponse.GRADE_EMPTY));

    const newReviewsResponse = await userService.createReview(
        userId, storeId, imgUrl, grade, reviewText
    );

    return res.send(newReviewsResponse);
};

/**리뷰 수정 API
 * [patch] /app/review
 */

exports.patchReview = async function (req, res) {
    const userId =  req.verifiedToken.userId

    const {reviewId, imgUrl, grade, reviewText} = req.body;

    if(!reviewId) return res.send(errResponse(baseResponse.REVEIWID_EMPTY));
    if(!imgUrl) return res.send(errResponse(baseResponse.STOREID_EMPTY));
    if(!grade) return res.send(errResponse(baseResponse.GRADE_EMPTY));
    if(!reviewText) return res.send(errResponse(baseResponse.STOREID_EMPTY));

    const patchReviewResponse = await userService.patchReview(
        userId, reviewId, imgUrl, grade, reviewText
    );

    return res.send(patchReviewResponse);
};


/**
 * 리뷰 삭제 API
 * [delete] /app/review
 */

exports.deleteReview = async function (req, res) {

    const userId = req.verifiedToken.userId;
    const reviewId = req.body.reviewId;

    const deleteParams = [userId, reviewId];

    if(!reviewId) return res.send(errResponse(baseResponse.REVEIWID_EMPTY));

    const deleteReviewResult = await userService.deleteReview(deleteParams);
    return res.send(response(baseResponse.DELETE_SUCCESS));

};


/** JWT 토큰 검증 API
 * [GET] /app/auto-login
 */
exports.check = async function (req, res) {
    const userIdResult = req.verifiedToken.userId;
    console.log(userIdResult);
    return res.send(response(baseResponse.TOKEN_VERIFICATION_SUCCESS));
};


/**찜 추가 API
 * [post] /app/LikeStore
 */

exports.postLikeStore = async function (req, res) {
    const userId =  req.verifiedToken.userId
    const storeId = req.body.storeId
    const LikeStoreParams = [userId, storeId];
    const LikeStoreResponse = await userService.createLikeStore(
        LikeStoreParams
    );

    return res.send(LikeStoreResponse);
};

/**
 * 찜 조회 API
 * [GET] /app/LikeStore
 */

exports.getLikeStore = async function(req, res) {

    const userId = req.verifiedToken.userId;

    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userLikeStores = await userProvider.retrieveLikeStore(userId);
    return res.send(response(baseResponse.SUCCESS, userLikeStores));
}

/**
 * 등급별 혜택 조회 API
 * [GET] /app/users/:userId/classDetails
 */

exports.getClassDetails = async function(req, res) {

    const userId = req.verifiedToken.userId;

    if(!userId) return res.send(errResponse(baseResponse.USER_USERID_EMPTY));

    const userClassDetailsResponse = await userProvider.retrieveClassDetails(userId);
    return res.send(response(baseResponse.SUCCESS, userClassDetailsResponse));
}

module.exports = function(app){
    const user= require('./userController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    // 0. 테스트 API
    //app.get('/app/test', user.getTest);

    // 1. 유저 생성 (회원가입) API
    app.post('/app/users', user.postUsers);

    // 2. 유저 조회 API (+ 검색)
    app.get('/app/users',user.getUsers);

    // 3. 특정 유저 조회 API
    app.get('/app/users/:userId', user.getUserById);

    // TODO: After 로그인 인증 방법 (JWT)
    // 로그인 하기 API (JWT 생성)
    app.post('/app/login', user.login);

    // 회원 정보 수정 API (JWT 검증 및 Validation - 메소드 체이닝 방식으로 jwtMiddleware 사용)
    app.patch('/app/users/:userId', jwtMiddleware, user.patchUsers);

    //유저 쿠폰 조회 API
    app.get('/app/users/:userId/coupons', jwtMiddleware, user.getCoupons);

    //유저 리뷰 내역 조회 API
    app.get('/app/users/:userId/reviews', jwtMiddleware, user.getUserReviews);

    //리뷰 작성 API
    app.post('/app/newReview', jwtMiddleware, user.postReviews);

    //리뷰 수정 API
    app.patch('/app/review', jwtMiddleware, user.patchReview);

    //리뷰 삭제 API
    app.delete('/app/review', jwtMiddleware, user.deleteReview);

    //유저 주문 내역 조회 API
    app.get('/app/users/:userId/orders', jwtMiddleware, user.getUserOrders);

    //특정 주문 내역 상세 조회 API
    app.get('/app/users/:userId/order', jwtMiddleware, user.getOrderDetails);

    //찜 추가
    app.post('/app/LikeStore',jwtMiddleware, user.postLikeStore);

    //찜 조회
    app.get('/app/LikeStore', jwtMiddleware, user.getLikeStore);

    //등급별 혜택 조회
    app.get('/app/user/classDetails', jwtMiddleware, user.getClassDetails);
};


// TODO: 자동로그인 API (JWT 검증 및 Payload 내뱉기)
// JWT 검증 API
// app.get('/app/auto-login', jwtMiddleware, user.check);

// TODO: 탈퇴하기 API
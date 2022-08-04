
module.exports = function(app){
    const store = require('./storeController');
    const jwtMiddleware = require('../../../config/jwtMiddleware');

    //카테고리별 전체 음식점 조회
    app.get('/app/category/:categoryId/stores', store.getStores);

    //카테고리별 음식점 배달팁 낮은 순으로 조회
    app.get('/app/category/:categoryId/stores/lowDeliveryTip', store.getStoresBylowDeliveryTip);

    //특정 음식점 조회
    app.get('/app/stores/:storeId/all', store.getStore);

    //특정 음식점 메뉴 전체 조회
    app.get('/app/stores/:storeId/menu', store.getMenu);

    //특정 음식점 '가게상세정보' 조회
    app.get('/app/stores/:storeId/storeDetails', store.getDetails);

    //가게 리뷰 내역 조회
    app.get('/app/stores/:storeId/reviews', store.getReviews);

    //장바구니 메뉴 삭제
    app.delete('/app/cart', jwtMiddleware, store.deleteCart);

    //장바구니 메뉴 추가
    app.post('/app/cart/:menuId', jwtMiddleware, store.addCartMenu);

    //가게 이름 검색
    app.get('/app/stores', store.getStoreByName);

    //특정 메뉴 상세정보 조회
    app.get('/app/menu/:menuId', store.getMenuDetails);

    //특정 주문내역 상세조회
    app.get('/app/users/:userId/orders/orderDetails', jwtMiddleware, store.getOrderDetails);
};
const jwtMiddleware = require("../../../config/jwtMiddleware");
const storeProvider = require("../../app/store/storeProvider");
const storeService = require("../../app/store/storeService");
const baseResponse = require("../../../config/baseResponseStatus");
const {response, errResponse} = require("../../../config/response");

/**
 * 카테고리별 음식점 전체 조회
 * [GET] /app/category/:categoryId/stores
 */

exports.getStores = async function (req, res) {

   const categoryId = req.params.categoryId;

   const storeByCategoryId = await storeProvider.retrieveStoreList(categoryId);
   return res.send(response(baseResponse.SUCCESS,storeByCategoryId ));
};


/**
 * 카테고리별 음식점 배달팁 낮은 순으로 조회
 * [GET] /app/category/:categoryId/stores/lowDeliveryTip
 */

exports.getStoresBylowDeliveryTip = async function (req, res) {

   const categoryId = req.params.categoryId;

   const storeBylowDeliveryTipResponse = await storeProvider.retrieveStoresBylowDeliveryTip(categoryId);
   return res.send(response(baseResponse.SUCCESS,storeBylowDeliveryTipResponse ));
};

/**
 * 특정 음식점 상세 조회
 * [GET] /app/stores/:storeId/all
 */

exports.getStore = async function (req, res) {

   const storeId = req.params.storeId;

   const storeByStoreId = await storeProvider.retrieveStore(storeId);
   return res.send(response(baseResponse.SUCCESS, storeByStoreId));
};

/**
 * 특정 음식점 메뉴 전체 조회
 * [GET] /app/stores/:storeId/menu
 */

exports.getMenu = async function (req, res) {

   const storeId = req.params.storeId;

   if(!storeId) return res.send(errResponse(baseResponse.STOREID_EMPTY));

   const storeMenu = await storeProvider.retrieveStoreMenu(storeId);
   return res.send(response(baseResponse.SUCCESS,storeMenu));

};



/**
 * 특정 음식점 가게상세정보 조회
 * [GET] /app/stores/:storeId/storeDetails
 */

exports.getDetails = async function (req, res) {

   const storeId = req.params.storeId;

   const storeDetails = await storeProvider.retrieveStoreDetails(storeId);
   return res.send(response(baseResponse.SUCCESS, storeDetails));

};

/**가게 리뷰 내역 조회
 * [GET] /app/stores/:storeId/reviews
 */

exports.getReviews = async function (req, res) {

   const storeId = req.params.storeId;

   const storeReviews = await storeProvider.retrieveStoreReviews(storeId);
   return res.send(response(baseResponse.SUCCESS, storeReviews));

}

/**
 * 장바구니 메뉴 삭제
 * [delete] /app/users/:userId/cart
 */

exports.deleteCart = async function (req, res) {

   const userId = req.verifiedToken.userId;
   const menuId = req.body.menuId;

   const deleteParams = [userId, menuId];

   if(!menuId) return res.send(errResponse(baseResponse.MENUID_EMPTY));

   const deleteCartResult = await storeService.deleCartMenu(deleteParams);
   return res.send(response(baseResponse.DELETE_SUCCESS));

};

/**
 * 장바구니 메뉴 추가
 * [POST] /app/cart/:menuId
 */

exports.addCartMenu = async function (req, res) {

   const userId = req.verifiedToken.userId;
   const menuId = req.params.menuId;
   const quantity = req.body.quantity;
   const addCartMenuParams = [userId, menuId, quantity];
   if(!menuId) return res.send(errResponse(baseResponse.MENUID_EMPTY));
   if(!quantity) return res.send(errResponse(baseResponse.QUANTITY_EMPTY));
   const addCartMenuResult = await storeService.addCartMenu(addCartMenuParams);
   return res.send(response(baseResponse.POST_SUCCESS));
};

/**
 * 가게 이름 검색
 * [GET] /app/stores?storeName
 */

exports.getStoreByName = async function (req, res) {

   const storeName = req.query.storeName;

   const storesByNameResponse = await storeProvider.retrieveStoresByName(storeName);
   return res.send(response(baseResponse.SUCCESS, storesByNameResponse));
}

/**
 * 특정 메뉴 상세정보 조회
 * [GET] /app/menu/:menuId
 */

exports.getMenuDetails = async function (req, res) {

   const menuId = req.params.menuId;

   const menuDetailsResponse = await storeProvider.retrievemenuDetails(menuId);
   return res.send(response(baseResponse.SUCCESS, menuDetailsResponse));
}


/**
 * 특정 주문내역 상세조회
 * [GET] /app/user/:userId/orders/orderDetails
 */

exports.getOrderDetails = async function (req, res) {

   const userId = req.verifiedToken.userId;
   const orderId = req.body.orderId;

   console.log(orderId)
   const orderDetailsResponse = await storeProvider.retrieveOrderDetails(userId,orderId);
   return res.send(response(baseResponse.SUCCESS, orderDetailsResponse));
}
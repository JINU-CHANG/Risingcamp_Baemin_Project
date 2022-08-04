const { pool } = require("../../../config/database");
const { logger } = require("../../../config/winston");

const storeDao = require("./storeDao");

//카테고리별 음식점 리스트 조회
exports.retrieveStoreList = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storesResult = await storeDao.selectStores(connection, categoryId);

    connection.release();

    return storesResult;
};

//카테고리별 음식점 배달팁 낮은 순으로 조회
exports.retrieveStoresBylowDeliveryTip = async function (categoryId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storesBylowDeliveryTipResult = await storeDao.selectStoresBylowDeliveryTip(connection, categoryId);

    connection.release();

    return storesBylowDeliveryTipResult;
};



//특정 음식점 상세 조회
exports.retrieveStore = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storeResult = await storeDao.selectStore(connection, storeId);

    connection.release();

    return storeResult;
};

exports.retrieveStoreMenu = async function(storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const MenuResult = await storeDao.selectStoreMenu(connection, storeId);

    connection.release();

    return MenuResult
}

exports.retrieveStoreDetails = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const detailsResult = await storeDao.selectStoreDetails(connection, storeId);

    connection.release();

    return detailsResult
};

exports.retrieveStoreReviews = async function (storeId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const reviewsResult = await storeDao.selectStoreReviews(connection, storeId);

    connection.release();

    return reviewsResult
};

//가게 이름 검색
exports.retrieveStoresByName = async function (storeName) {
    const connection = await pool.getConnection(async (conn) => conn);
    const storesByNameResult = await storeDao.selectStoresByName(connection, storeName);

    connection.release();

    return storesByNameResult
};

//특정 메뉴 상세 조회
exports.retrievemenuDetails = async function (menuId) {
    const connection = await pool.getConnection(async (conn) => conn);
    const menuDetailsResult = await storeDao.selectMenuDetails(connection, menuId);

    connection.release();

    return menuDetailsResult;
};

//특정 주문내역 상세 조회

exports.retrieveOrderDetails = async function (userId,orderId) {
    const orderDetailsParams = [userId,orderId]
    const connection = await pool.getConnection(async (conn) => conn);
    const orderDetailsResult = await storeDao.selectOrderDetails(connection,orderDetailsParams);

    connection.release();

    return orderDetailsResult;
};

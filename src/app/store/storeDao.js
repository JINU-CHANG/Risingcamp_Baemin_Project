//카테고리별 가게 전체 조회
async function selectStores(connection, categoryId) {
    const selectStoreByCategoryIdQuery = `select storeName, grade, imgUrl,
    concat(format(minimumOrderPrice, N'#,0'),'원') as minimumOrderPrice,
    deliveryTip, deliveryTime
        
    from store where categoryId=?;`;

    const [storeRows] =await connection.query(selectStoreByCategoryIdQuery, categoryId);
    return storeRows;
}

//카테고리별 음식점 배달팁 낮은 순으로 조회
async function selectStoresBylowDeliveryTip(connection, categoryId) {
    const selectStoresBylowDeliveryTipQuery = `
        SELECT storeName, grade, imgUrl,
               concat(format(minimumOrderPrice, N'#,0'),'원') as minimumOrderPrice,
               deliveryTip, deliveryTime
        FROM FoodDelivery.store
        where categoryId=?
        ORDER BY deliveryTip;
    `;

    const [storeRows] =await connection.query(selectStoresBylowDeliveryTipQuery, categoryId);
    return storeRows;
}

//특정 음식점 상세 조회
async function selectStore(connection, storeId) {
    const selectStoreByStoreIdQuery = `
        select storeName, grade, imgUrl,
               concat(format(minimumOrderPrice, N'#,0'),'원') as minimumOrderPrice,
               deliveryTip, deliveryTime

        from store where storeId=?;
    `;
    const [storeDetailsRow] = await connection.query(selectStoreByStoreIdQuery, storeId);

    const selectStoreMenuQUery = `
        select menuName, details, menuImg, price
        from menu
        where storeId=?
    `;

    const [storeMenuRow] = await connection.query(selectStoreMenuQUery, storeId);

    const storeResult = storeDetailsRow.concat(storeMenuRow)

    return storeResult;
}

//가게 상세 정보 조회
async function selectStoreDetails(connection, storeId) {
    const selectStoreDetailsQuery = `
        select s.introduce,
               d.info as deliveryInfo, d.deliveryTip, d.plusDeliveryTip,
               b.name, b.storeName, b.storeAddress, b.storeNumber
        from storeDetails as s
                 inner join businessInfo as b on s.businessInfoId=b.businessInfoId
                 inner join deliveryTipInfo as d on s.deliveryTipId=d.deliveryTipId
        where s.storeId=?;
    `;
    const [details] = await connection.query(selectStoreDetailsQuery, storeId);
    return details;

}

//가게 메뉴 전체 조회
async function selectStoreMenu(connection, storeId) {
    const selectStoreMenuQuery = `
    select menuName, details, menuImg, price
    from menu
    where storeId=?
    `;

    const [MenuRows] = await connection.query(selectStoreMenuQuery, storeId);
    return  MenuRows;

}

//가게 리뷰 조회
async function selectStoreReviews(connection, storeId) {
    const selectStoreReviewsQuery = `
    select u.nickname, r.imgUrl, r.reviewText, r.grade,

       case when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) =0 then '오늘'
            when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) =1 then '어제'
            when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) <31
            then concat(TIMESTAMPDIFF (week, r.createdAT, current_timestamp),'주 전')
            when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) <365
            then concat(TIMESTAMPDIFF (month, r.createdAT, current_timestamp),'개월 전')
            end as 'updatedAT'

     from userReview as r
     inner join UserInfo as u on u.userId = r.userId
     where r.storeId=?;
    `;

    const [reviewsRows] = await connection.query(selectStoreReviewsQuery, storeId);
    return  reviewsRows;
}
//카트메뉴 삭제
async function deleteCart(connection, deleteParams) {
    const deleteCartQuery = `
    DELETE 
    FROM cart as c
    WHERE c.userId = ? and c.menuId=?;
    `;

    const deleteResult= await connection.query(deleteCartQuery, deleteParams);
    return deleteResult;
}

//카트메뉴 추가
async function insertCartMenu(connection, addCartMenuParams) {
    const addCartMenuQuery = `
        insert into cart(userId, menuId, quantity)
        values(?,?,?);
    `;

    const addCartMenuResult= await connection.query(addCartMenuQuery, addCartMenuParams);
    return addCartMenuResult;
}
//가게 이름 검색
async function selectStoresByName(connection, storeName) {
    const selectStoresByNameQuery = `
        select s.storeName, s.grade, s.imgUrl,
               concat(format(s.minimumOrderPrice, N'#,0'),'원') as minimumOrderPrice,
               s.deliveryTip, s.deliveryTime

        from store as s
        where s.storeName LIKE '%피자%';
    `;

    const [storesRow] = await connection.query(selectStoresByNameQuery, storeName);
    return  storesRow;

}

//특정 메뉴 상세 조회
async function selectMenuDetails(connection, menuId) {
    const selectMenuDetailsQuery = `
        select m.menuName, m.details, O.priceOption, O.spicyOption, O.sideOption
        from menuOption as O
                 inner join menu as m on O.optionId = m.optionId
        where menuId=?;
    `;
    const [menuDetailsRow] = await connection.query(selectMenuDetailsQuery,menuId);
    return  menuDetailsRow;

}

//특정 주문 내역 상세 조회

async function selectOrderDetails(connection,orderDetailsParams) {
    const selectOrderDetailsQuery = `
        select s.storeName, o.createdAt, o.orderId,
               m.menuName, m.price, c.quantity,
               p.orderMethod, oD.addressDetail, oD.forOwner, oD.forRider
        from orders as o
                 inner join orderItems on o.orderId = orderItems.orderId
                 inner join cart as c on orderItems.cartId=c.cartId
                 inner join menu as m on m.menuId=c.menuId
                 inner join store as s on s.storeId=m.storeId
                 inner join orderDetails as oD on o.orderDetailsId=oD.orderDetailsId
                 inner join pay as p on oD.payTypeId=p.payTypeId
        where c.userId =? and o.orderId=?;
    `;
    const [orderDetailsRow] = await connection.query(selectOrderDetailsQuery,orderDetailsParams);
    console.log(orderDetailsRow)
    return  orderDetailsRow;

}

module.exports = {
    selectStores,
    selectStoresBylowDeliveryTip,
    selectStore,
    selectStoreDetails,
    selectStoreMenu,
    selectStoreReviews,
    deleteCart,
    insertCartMenu,
    selectStoresByName,
    selectMenuDetails,
    selectOrderDetails
};
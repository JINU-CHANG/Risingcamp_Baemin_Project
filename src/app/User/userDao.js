// 모든 유저 조회
async function selectUser(connection) {
  const selectUserListQuery = `
                SELECT email, nickname 
                FROM UserInfo;
                `;
  const [userRows] = await connection.query(selectUserListQuery);
  return userRows;
}

// 이메일로 회원 조회
async function selectUserEmail(connection, email) {
  const selectUserEmailQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE email = ?;
                `;
  const [emailRows] = await connection.query(selectUserEmailQuery, email);
  return emailRows;
}

// 닉네임으로 회원 조회
async function selectUserNickname(connection, nickname) {
  const selectUserNicknameQuery = `
                SELECT email, nickname 
                FROM UserInfo 
                WHERE nickname = ?;
                `;
  const [nicknameRows] = await connection.query(selectUserNicknameQuery, nickname);
  return nicknameRows;
}

// userId 회원 조회
async function selectUserId(connection, userId) {
  const selectUserIdQuery = `
                 SELECT userId, email, nickname 
                 FROM UserInfo 
                 WHERE userId = ?;
                 `;
  const [userRow] = await connection.query(selectUserIdQuery, userId);
  return userRow;
}

// 유저 생성
async function insertUserInfo(connection, insertUserInfoParams) {
  const insertUserInfoQuery = `
        INSERT INTO UserInfo(email, password, nickname,phoneNumber)
        VALUES (?, ?, ?,?);
    `;
  const insertUserInfoRow = await connection.query(
      insertUserInfoQuery,
      insertUserInfoParams
  );

  return insertUserInfoRow;
}

// 패스워드 체크
async function selectUserPassword(connection, selectUserPasswordParams) {
  const selectUserPasswordQuery = `
        SELECT email, nickname, password
        FROM UserInfo 
        WHERE email = ?;`;
  const [selectUserPasswordRow] = await connection.query(
      selectUserPasswordQuery,
      selectUserPasswordParams
  );
  return selectUserPasswordRow;
}

// 유저 계정 상태 체크 (jwt 생성 위해 id 값도 가져온다.)
async function selectUserAccount(connection, email) {
  const selectUserAccountQuery = `
        SELECT status, userId
        FROM UserInfo 
        WHERE email = ?;`;
  const [selectUserAccountRow] = await connection.query(
      selectUserAccountQuery,
      email
  );
  return selectUserAccountRow;
}

async function updateUserInfo(connection, id, nickname) {
  const updateUserQuery = `
  UPDATE UserInfo 
  SET nickname = ?
  WHERE userid = ?;`;
  const updateUserRow = await connection.query(updateUserQuery, [nickname, id]);
  return updateUserRow[0];
}

// 유저 쿠폰 조회
async function selectUserCoupons(connection, userId) {
  const selectUserCouponsQuery =`
    select concat(format(c.couponNum, N'#,0'),'원') as couponNum , c.couponInfo
    from coupon as c
           left join userCoupon as u on u.couponId=c.couponId
    where userId=?;
  `;
  const [selectUserCouponsRow] = await connection.query(selectUserCouponsQuery, userId)
  return selectUserCouponsRow;
}

//유저 리뷰 조회

async function selectUserReviews(connection, userId) {
  const selectUserReviewsQuery = `
    select s.storeName, r.imgUrl, r.reviewText, r.grade
        , replyText,
           case when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) =0 then '오늘'
                when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) =1 then '어제'
                when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) <31
                  then concat(TIMESTAMPDIFF (week, r.createdAT, current_timestamp),'주 전')
                when TIMESTAMPDIFF (Day, r.createdAT, current_timestamp) <365
                  then concat(TIMESTAMPDIFF (month, r.createdAT, current_timestamp),'개월 전')
             end as 'updatedAT'
    from userReview as r
           left join store as s on s.storeId=r.storeId
           left join reply on reply.reviewId=r.reviewId
    where r.userId=?;
  `;

  const [selectUserReviewsRow] = await connection.query(selectUserReviewsQuery, userId)
  return selectUserReviewsRow;
}

//유저 주문 내역 조회
async function selectUserOrders(connection, userId) {
  const selectUserOrdersQuery = `
    select o.orderId, s.imgUrl, s.storeName, m.menuName,
           case when TIMESTAMPDIFF (Day, o.updatedAT, current_timestamp) =0 then '오늘'
                when TIMESTAMPDIFF (Day, o.updatedAT, current_timestamp) =1 then '어제'
                when TIMESTAMPDIFF (Day, o.updatedAT, current_timestamp) <7
                  then concat(TIMESTAMPDIFF (Day, o.updatedAT, current_timestamp),'일 전')
                else DATE_FORMAT(o.updatedAt, '%c/%d')
             end as updatedAT
      ,o.deliverystatus
    from orders as o
           inner join orderItems as oI on oI.orderId=o.orderId
           inner join cart as c on c.cartId=oI.cartId
           inner join menu as m on m.menuId=c.menuId
           inner join store as s on s.storeId=m.storeId
    where o.deliverystatus=1 and c.userId=?;

  `;

  const [selectUserOrdersRow] = await connection.query(selectUserOrdersQuery, userId)
  return selectUserOrdersRow;
}

//특정 주문 상세 조회
async function selectOrderDetails(connection, orderDetailsParams) {
  const selectOrderDetailsQuery = `
      select m.menuName,s.storeName,s.imgUrl
    , o.deliveryStatus, o.updatedAt, o.createdAt, o.orderId,
      oD.addressDetail, oD.forOwner, oD.forRider, oD.payTypeId, p.orderMethod
    from cart as c
    left join menu as m on m.menuId=c.menuId
    left join store as s on s.storeId=m.storeId
    left join orders as o on c.cartId=o.cartId
    left join orderDetails as oD on o.orderDetailsId=oD.orderDetailsId
    left join pay as p on p.payTypeId=oD.payTypeId
    where userId=? and orderId=?
  `;

  const [selectOrderDetailsRow] = await connection.query(selectOrderDetailsQuery, orderDetailsParams)
  return selectOrderDetailsRow;
}


//리뷰 생성

async function insertNewReview(connection, insertNewReviewParams) {
  const insertNewReviewQuery = `
      insert into userReview(userId, storeId, imgUrl, grade, reviewText)
      values (?,?,?,?,?);
    `;
  const insertNewReviewRow = await connection.query(
      insertNewReviewQuery,
      insertNewReviewParams
  );

  return insertNewReviewRow;
}


//리뷰 수정
async function updateReview(connection, patchReviewParams) {
  console.log(patchReviewParams)
  const updateReviewQuery = `
    UPDATE FoodDelivery.userReview t
    SET t.imgUrl = ?, t.grade = ?, t.reviewText = ?
    WHERE t.reviewId = ? and t.userId=?
  `;
  console.log(updateReviewQuery)
  const updateReviewRow = await connection.query(updateReviewQuery, patchReviewParams);
  return updateReviewRow[0];
}

//리뷰 삭제

async function deleteReview(connection, deleteParams) {
  const deleteReviewQuery = `
    DELETE 
    FROM userReview as r 
    WHERE r.userId=? and r.reviewId= ?;
    `;

  const deleteResult= await connection.query(deleteReviewQuery, deleteParams);
  return deleteResult;
}

//찜 추가

async function insertLikeStore(connection, LikeStoreParams) {
  const insertLikeStoreQuery = `
      insert into LikeStore(userId, storeId)
      values (?,?);
    `;
  const LikeStoreResult = await connection.query(
      insertLikeStoreQuery,
      LikeStoreParams
  );

  return  LikeStoreResult;
}

//찜 조회
async function selectUserLikeStores(connection, userId) {
  const selectUserLikeStoresQuery =`
    select s.storeName, s.grade, s.imgUrl,

           concat(format(s.minimumOrderPrice, N'#,0'),'원') as minimumOrderPrice

        ,s.deliveryTip, s.deliveryTime
    from store as s
           inner join LikeStore as L on L.storeId=s.storeId
    where L.userId=?;
  `;
  const [selectUserLikeStoresRow] = await connection.query(selectUserLikeStoresQuery, userId)
  return selectUserLikeStoresRow;
}

//등급별 혜택 조회
async function selectUserClassDetails(connection, userId) {
  const selectUserQuery =`
    select u.nickname, c.className
    from UserInfo as u
           inner join class as c on c.classId=u.classId
    where u.userId=?;
  `;
  const [selectUserRow] = await connection.query(selectUserQuery, userId);

  const orderMonthCountQuery=`
    select
      case when TIMESTAMPDIFF(Month, o.updatedAT, current_timestamp) = 0 then count(o.orderId)
      end as orderNumCount
  
  from orders as o
  inner join orderItems as oI on oI.orderId=o.orderId
  inner join cart as c on c.cartId=oI.cartId
  where c.userId=?;
  `;
  const [userClassDetailsRow] = await connection.query(orderMonthCountQuery, userId);

  const result = selectUserRow.concat(userClassDetailsRow);

  return result;
}



module.exports = {
  selectUser,
  selectUserEmail,
  selectUserNickname,
  selectUserId,
  insertUserInfo,
  selectUserPassword,
  selectUserAccount,
  updateUserInfo,
  updateReview,
  selectUserCoupons,
  selectUserReviews,
  selectUserOrders,
  selectOrderDetails,
  insertNewReview,
  deleteReview,
  insertLikeStore,
  selectUserLikeStores,
  selectUserClassDetails
};

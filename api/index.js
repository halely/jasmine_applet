import {
  getRequest,
  postRequest,
  postParamsRequest,
  putRequest,
  deleteRequest,
  upImgs,
  getRequest2
} from 'request.js';

//车辆限行
export const requst_post_queryAllRoad = data => getRequest(`/road/queryAllRoad`, data);
//查询服务区-整合版
export const requst_get_queryAllServiceAreaByDistanse = data => getRequest(`/serviceArea/queryAllServiceArea`, data);
//查询所有道路-服务区
export const requst_get_queryRoad = data => getRequest(`/serviceArea/queryRoad`, data);

// 大桥数据
export const requst_get_queryAllBridge = data => getRequest(`/road/queryAllBridge`, data);
//根据距离查询收费站
export const requst_get_queryAllByDistance = data => getRequest(`/station/queryAllByDistance`, data);

// 获取城市描边
export const requst_get_queryAllCityLine = data => getRequest(`/station/queryAllCityLine`, data);
//根据城市查询收费站
export const requst_get_queryAllByArea = data => getRequest(`/station/queryAllByArea`, data);

//查询所有关闭的收费站
export const requst_get_queryAllClose = data => getRequest(`/station/queryAllClose`, data);

export const requst_post_evaluation = data => postRequest(`/evaluation/add`, data);

/* 路况信息接口模块 */

//查询查询全部高速路况 
export const requst_get_queryAllRoadInfo = data => getRequest(`/road/queryAllRoadInfo`, data);
//查询全部高速路况详情
export const requst_get_queryRoadInfoDetail = data => getRequest(`/road/queryRoadInfoDetail`, data);
//获取当前高速的事件数量
export const requst_get_queryRoadInfoDetailExt = data => getRequest(`/road/queryRoadInfoDetailExt`, data);

//登录
export const requst_get_login = data => getRequest(`/login`, data);
/* 收藏信息*/
//我的收藏-高速
export const requst_get_myCollectionRoad = data => getRequest(`/myCollection/road/query`, data);
//我的收藏-收费站
export const requst_get_myCollectionStation = data => getRequest(`/myCollection/station/query`, data);
//我的收藏-服务区
export const requst_get_myCollectionServiceArea = data => getRequest(`/myCollection/serviceArea/query`, data);
//我的收藏-线路查询
export const requst_get_myCollectionLine = data => getRequest(`/myCollection/line/query`, data);

//我的收藏-高速-增加
export const requst_post_myCollectionRoadInsert = data => postRequest(`/myCollection/road/insert`, data);
//我的收藏-收费站-增加
export const requst_post_myCollectionstationInsert = data => postRequest(`/myCollection/station/insert`, data);
//我的收藏-服务区-增加
export const requst_post_myCollectionserviceAreaInsert = data => postRequest(`/myCollection/serviceArea/insert`, data);
//我的收藏-路线-增加
export const requst_post_myCollectionlineInsert = data => postRequest(`/myCollection/line/insert`, data);

//我的收藏-删除
export const requst_post_myCollectionDelete = data => postRequest(`/myCollection/deleteByIds`, data);
//查询高速是否收藏
export const requst_get_roadifSave = data => getRequest(`/road/ifSave`, data);
//查询服务区是否收藏
export const requst_get_serviceAreaxist = data => getRequest(`/myCollection/serviceArea/exist`, data);
//线路-是否收藏
export const requst_post_myCollectionifSave = data => postRequest(`/myCollection/line/exist`, data);

//查询路线历史记录
export const requst_get_lineSearchHistroyqueryMine = data => getRequest(`/lineSearch/histroy/queryMine`, data);
//路线历史记录增加
export const requst_get_lineSearchHistroyinsert = data => postRequest(`/lineSearch/histroy/insert`, data);
//历史记录-删除
export const requst_get_lineSearchHistroydelete = data => postRequest(`/lineSearch/histroy/delete`, data);

//查询途径服务区
export const requst_post_lineSearchLineServiceArea = data => postRequest(`/lineSearch/lineServiceArea`, data);
//查询途径收费站
export const requst_post_lineSearchLineStation = data => postRequest(`/lineSearch/lineStation`, data);

// 11月份接口
// 查询高速交警大队
export const requst_get_queryHandyTrafficPoliceBrigade = data => getRequest(`/handy/queryHandyTrafficPoliceBrigade`, data);

// 查询事故快处点
export const requst_get_queryHandyRapidHandlingCenter = data => getRequest(`/handy/queryHandyRapidHandlingCenter`, data);

// 查询公告信息
export const requst_get_queryHandyNotice = data => getRequest(`/handy/queryHandyNotice`, data);

// 查询收费政策
export const requst_get_queryHandyChargePolicy = data => getRequest(`/handy/queryHandyChargePolicy`, data);

// 收费政策阅读量
export const requst_get_addHandyChargePolicy = data => getRequest(`/handy/addHandyChargePolicy`, data);

// 公告信息阅读量
export const requst_get_addHandyNotice = data => getRequest(`/handy/addHandyNotice`, data);


//服务区信息接口（独立调用）

//查询服务区下店铺
export const requst_get_queryAllShop = data => getRequest2(`/shop/queryAllShop`, data);
//查询该店铺所有种类
export const requst_get_getAllCommodityType = data => getRequest2(`/getAllCommodityType`, data);
//根据店铺编号与商品类型获取该店铺下所有商品信息
export const requst_get_shopDetail = data => getRequest2(`/shop/shopDetail`, data);


// 12月接口
// 获取手机
export const requst_get_userPhone = data => getRequest(`/user/phone`, data);
//获取登录信息
export const requst_get_UserInfo = data => getRequest(`/user/getUserInfo`, data);
//上传登录信息
export const requst_get_uploadUserInfo = data => getRequest(`/user/uploadUserInfo`, data);
//pv+uv插入接口
export const requst_get_evaluationVisit = data => getRequest(`/evaluation/visit`, data);
//是否评价
export const requst_get_evaluationIfDone = data => getRequest(`/evaluation/ifDone`, data);



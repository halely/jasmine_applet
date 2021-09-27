import { getRequest, postRequest, postParamsRequest, putRequest, deleteRequest,
  upImgs} from 'request.js';

//车辆限行
export const requst_post_queryAllRoad = data => getRequest(`/road/queryAllRoad`,data);
//查询服务区-整合版
export const requst_get_queryAllServiceAreaByDistanse = data => getRequest(`/serviceArea/queryAllServiceArea`,data);
//查询所有道路-服务区
export const requst_get_queryRoad = data => getRequest(`/serviceArea/queryRoad`,data);
//查询服务区下所有店铺
export const requst_get_queryAllShop = data => getRequest(`/shop/queryAllShop`,data);
//查询该店铺所有种类
export const requst_get_shopDetail = data => getRequest(`/shop/shopDetail`,data);
// 大桥数据
export const requst_get_queryAllBridge = data => getRequest(`/road/queryAllBridge`,data);
//根据距离查询收费站
export const requst_get_queryAllByDistance = data => getRequest(`/station/queryAllByDistance`,data);

// 获取城市描边
export const requst_get_queryAllCityLine = data => getRequest(`/station/queryAllCityLine`);
//根据城市查询收费站
export const requst_get_queryAllByArea = data => getRequest(`/station/queryAllByArea`,data);

//查询所有关闭的收费站
export const requst_get_queryAllClose = data => getRequest(`/station/queryAllClose`,data);

export const requst_post_evaluation = data => postRequest(`/evaluation/add`,data);
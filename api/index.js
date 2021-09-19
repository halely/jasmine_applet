import { getRequest, postRequest, postParamsRequest, putRequest, deleteRequest,
  upImgs} from 'request.js';

// 登录接口
export const requst_post_login = header => postRequest(`/login`,{},header);
//退出登录
export const requst_post_logout = header => postRequest(`/logout`);
//主页我的信息
export const requst_post_user_myInfo = () => postRequest(`/user/myInfo`);
// 用户信息模块
//更新用户信息
export const requst_post_user_update = data => postRequest(`/user/update`,data);
//绑定手机号
export const requst_post_user_phone = data => postParamsRequest(`/user/phone`,data);


// 公司信息模块
//公司列表信息
export const requst_post_user_companyList = data => postRequest(`/user/companyList`,data);
//公司信息添加 或更新
export const requst_post_user_companySava = data => postRequest(`/user/companySavaOrUpdateInfo`,data);
//删除公司
export const requst_post_user_companyDeletById = data => postParamsRequest(`/user/companyDeletById`,data);
//设置默认公司
export const requst_post_user_companyDefaultById = data => postParamsRequest(`/user/companyDefaultById`,data);

//开票个人信息模块
//查询个人信息
export const requst_post_invoice_queryUser = data => postRequest(`/invoice/queryUser`,data);
//新增个人
export const requst_post_invoice_addUser = data => postRequest(`/invoice/addUser`,data);
//删除个人
export const requst_get_invoice_deleteUser = data => getRequest(`/invoice/deleteUser`,data);
//修改个人
export const requst_post_invoice_updateUser = data => postRequest(`/invoice/updateUser`,data);
//设为默认个人信息
export const requst_get_invoice_setDefault = data => getRequest(`/invoice/setDefault`,data);
// 行驶证模块
//行驶证列表
export const requst_post_user_drivingList = data => postRequest(`/user/drivingList`,data);
//行驶证添加
export const requst_post_user_drivingSave = data => postRequest(`/user/drivingSave`,data);
//文件上传
export const requst_post_common_upload = data => upImgs(`/common/upload`,data);
//删除行驶证
export const requst_post_user_drivingDelete = data => postParamsRequest(`/user/drivingDelete`,data);

//发票模块
export const requst_post_invoice_queryInvoice = data => postRequest(`/invoice/queryInvoice`,data);
//开发票
export const requst_post_invoice_openInvoice = data => postRequest(`/invoice/openInvoice`,data);
// /查询历史开发票列表
export const requst_get_invoice_queryHistoryInvoice = data => getRequest(`/invoice/queryHistoryInvoice`,data);
//发票详情
export const requst_get_invoice_detail = data => getRequest(`/invoice/detail`,data);
//发票红冲
export const requst_get_invoice_closeInvoice = data => getRequest(`/invoice/closeInvoice`,data);




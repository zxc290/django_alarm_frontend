import axios from 'axios'


let base = 'http://127.0.0.1:8000';

// 获取左边栏
export const getAlarmRuleList = () => {
  return axios.get(`${base}/alarms/`)
};

// 获取报警类型下的规则详情
export const getDetail = (id) => {
  return axios.get(`${base}/alarms/${id}`)
};

// 获取规则表选项
export const getInitialOptions = () => {
  return axios.get(`${base}/get_initial_options/`)
};

// // 新增规则
// export const addRule = params => {
//   return axios.post(`http://127.0.0.1:8000/add_rule`, params)
// };

// 新增规则
export const addRule = params => {
  return axios.post(`${base}/mail_operations/`, params)
};

// 编辑规则
export const editRule = (params, id) => {
  return axios.put(`${base}/mail_operations/${id}/`, params)
};

// // 删除规则
// export const deleteRule = params => {
//   return axios.post(`${base}/delete_rule/`, params)
// };

// 删除单条规则
export const deleteRule = id => {
  return axios.delete(`${base}/mail_operations/${id}`)
};

// 批量删除规则
export const multiDeleteRule = params => {
  return axios.post(`${base}/delete_multi_rules/`, params)
};

export const getRules = () => {
  return axios.get(`${base}/rules/`)
};
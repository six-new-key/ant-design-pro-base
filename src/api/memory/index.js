import { request } from "@/utils";

//请求前缀
const PREFIX = "/llm";

export function queryHistory() {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/query/history`,
    method: "POST"
  });
}

export function queryMessages(conversationId) {
  return request({
    //模板字符串拼接参数
    url: `${PREFIX}/query/messages`,
    method: "GET",
    params: {
      conversationId
    }
  });
}
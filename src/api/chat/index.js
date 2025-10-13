/**
 * 聊天接口 - 流式响应
 */

import {AuthUtils} from "@/utils";

export const chatStream = async (msg,model) => {
  // 使用代理路径，避免跨域问题
  const response = await fetch('/api/llm/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'text/plain',  // 改为text/plain，因为发送的是纯字符串
                'Accept': 'text/plain',
                'Cache-Control': 'no-cache',
                'Authorization': AuthUtils.getToken(),
                'Model': model
            },
            body: msg
        })
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response;
}

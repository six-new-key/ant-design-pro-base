/**
 * 聊天接口 - 流式响应
 */

import {AuthUtils} from "@/utils";

export const chatStream = async (data) => {
  // 使用代理路径，避免跨域问题
  return await fetch('/api/llm/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'text/plain',
                'Cache-Control': 'no-cache',
                'Authorization': AuthUtils.getToken()
            },
            body: JSON.stringify(data)
        })
}

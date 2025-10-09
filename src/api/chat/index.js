/**
 * 聊天接口 - 流式响应
 */
export const chatStream = async (data) => {
  return await fetch('http://localhost:8201/llm/chat', {
            method: 'POST',
            headers: {
                'Accept': 'text/plain',
                'Cache-Control': 'no-cache'
            },
            body: JSON.stringify(data)
        })
}

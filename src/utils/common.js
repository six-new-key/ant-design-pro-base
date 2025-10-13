
/**
 * 创建会话ID
 * @param {string} userId 用户ID
 * @returns {string} 会话ID
 */
export const createConversationId = (userId) => {
    return userId + ":" + Date.now();
}
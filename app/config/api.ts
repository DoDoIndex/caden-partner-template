export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export const API_ENDPOINTS = {
    CHAT: {
        SEND_MESSAGE: `${API_URL}/api/chat/message`,
        SEARCH: `${API_URL}/api/chat/search`,
    },
    PRODUCT: {
        GET_ALL: `${API_URL}/api/product`,
        GET_BY_ID: (id: number) => `${API_URL}/api/product/${id}`,
    }
}; 
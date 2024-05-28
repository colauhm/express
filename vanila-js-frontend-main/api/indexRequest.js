import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = (offset, limit, boardContentType, searchText) => {
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardContentType=${boardContentType}&searchText=${searchText}`,
        {
            headers: {
                session: getCookie('session'),
                userId: getCookie('userId'),
            },
            noCORS: true,
        },
    );
    return result;
};

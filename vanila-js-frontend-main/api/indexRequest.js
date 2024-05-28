import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = (offset, limit, search, boardContentType, searchContent) => {
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&search=${search}&boardContentType=${boardContentType}&boardContent=${searchContent}`,
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

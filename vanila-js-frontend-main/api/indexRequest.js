import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = (offset, limit, search, boardCategory, boardContent) => {
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&search=${search}&boardCategory=${boardCategory}&boardContent=${boardContent}`,
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

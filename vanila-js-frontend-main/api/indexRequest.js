import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = (offset, limit, search, boardContentType, searchText) => {
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}`,
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

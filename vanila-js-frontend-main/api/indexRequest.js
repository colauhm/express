import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = (offset, limit, search, boardContentType, searchText, sortType) => {

    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}`,
       
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

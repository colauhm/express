import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = (offset, limit, boardCategory ,search, boardContentType, searchText, sortType) => {
    console.log(`${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardCategory=${boardCategory}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}`)
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardCategory=${boardCategory}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}`,
       
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

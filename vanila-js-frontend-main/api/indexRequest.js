import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = async (offset, limit, boardCategory ,search, boardContentType, searchText, sortType, likePostIds) => {
    console.log(`${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardCategory=${boardCategory}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}&likePostIds=${likePostIds}`)
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardCategory=${boardCategory}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}&likePostIds=${likePostIds}`,
        
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

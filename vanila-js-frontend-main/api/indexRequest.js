import { getServerUrl, getCookie } from '../utils/function.js';

export const getPosts = async (offset, limit, boardCategory ,search, boardContentType, searchText, sortType, likePostData) => {
    console.log(`${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardCategory=${boardCategory}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}&likePostData=${likePostData}`)
    const result = fetch(
        `${getServerUrl()}/posts?offset=${offset}&limit=${limit}&boardCategory=${boardCategory}&search=${search}&boardContentType=${boardContentType}&searchText=${searchText}&sortType=${sortType}&likePostData=${likePostData}`,
        
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

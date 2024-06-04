import { getServerUrl, getCookie } from '../utils/function.js';

export const getLike =  async (postId, detail = false) => {
    const result = fetch(`${getServerUrl()}/posts/like/${postId}/${detail}`, {
        headers: {
            session: getCookie('session'),
            userid: getCookie('userId'),
        },
        noCORS: true,
    });
    return result;
};
export const addLike = async(postId) => {
    const result = fetch(`${getServerUrl()}/posts/like/${postId}`, {
        method: 'POST',
        headers: {
            session: getCookie('session'),
            userid: getCookie('userId'),
        },
        noCORS: true,
    });
    // console.log("addLike")
    return result;
};
export const deleteLike = async (postId) => {
    const result = fetch(`${getServerUrl()}/posts/like/${postId}`, {
        method: 'DELETE',
        headers: {
            session: getCookie('session'),
            userid: getCookie('userId'),
        },
        noCORS: true,
    });
    // console.log("deletelike")
    return result
};
export const getPost = (postId) => {
    const result = fetch(`${getServerUrl()}/posts/${postId}`, {
        headers: {
            session: getCookie('session'),
            userid: getCookie('userId'),
        },
        noCORS: true,
    });
    return result;
};

export const deletePost = async postId => {
    const result = await fetch(`${getServerUrl()}/posts/${postId}`, {
        method: 'DELETE',
        headers: {
            session: getCookie('session'),
            userId: getCookie('userId'),
        },
    });
    return result;
};

export const writeComment = async (pageId, comment) => {
    const result = await fetch(`${getServerUrl()}/posts/${pageId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            session: getCookie('session'),
            userId: getCookie('userId'),
        },
        body: JSON.stringify({ commentContent: comment }),
    });
    return result;
};

export const getComments = async postId => {
    const result = await fetch(`${getServerUrl()}/posts/${postId}/comments`, {
        headers: {
            session: getCookie('session'),
            userId: getCookie('userId'),
        },
        noCORS: true,
    });
    return result;
};

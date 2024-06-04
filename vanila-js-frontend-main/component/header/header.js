import { getPosts } from '../../api/indexRequest.js';
import { deleteCookie, getCookie, getServerUrl,authCheck } from '../../utils/function.js';
import {getLike} from '../../api/boardRequest.js'
const DEFAULT_PROFILE_IMAGE = '/public/image/profile/default.jpg';

const userPostInfo = async () => {
    if(getCookie('session')){ 
        const userData = await authCheck();
        const writtenResponse = await getPosts(0, 999, 'all', true, 'searchWriter', userData.data.nickname, 'time');
        const likePostIdResponse = await getLike();  
        const likePostIdData = await likePostIdResponse.json(); 
        const likePostid = likePostIdData.data.map(item => item.post_id);

        const writtenData = await writtenResponse.json();
        console.log(likePostIdData.data)
        const likeResponse = await getPosts(0, 999, 'all', true, 'searchWriter', userData.data.nickname, 'time', likePostid)
        const likeData = await likeResponse.json();

        //console.log(likeData.data)
          
        console.log(likeData);
        const data = {
            userData : userData,
            writtenPost : writtenData,
            likePost : likeData
        }    
        
        return data
    }
    
}
const dropdownMenuData = await userPostInfo();

const headerDropdownMenu = () => {
    //console.log(data)
    // console.log(likeData);
    const userData = dropdownMenuData.userData;
    const writtenPosts = dropdownMenuData.writtenPost;
    const likePosts = dropdownMenuData.likePost;
    const wrap = document.createElement('div');
    // console.log(writtenPostList.data)
    const titleComment = document.createElement('h3');
    const modifyInfoLink = document.createElement('a');
    const modifyPasswordLink = document.createElement('a');
    const logoutLink = document.createElement('a');

    const posts = document.createElement('div');
    const postsTopBar = document.createElement('div');
    const writtenPostsButton = document.createElement('button');
    const likePostsButton = document.createElement('button');
    const numberSortImg = document.createElement('h3');

    writtenPostsButton.classList.add('writtenPost');
    likePostsButton.classList.add('likePost');
    postsTopBar.classList.add('postsTopBar');


    writtenPostsButton.textContent = '작성한 글';
    likePostsButton.textContent = '좋아요한 글';
    numberSortImg.innerHTML = '👀 ❤️';
    titleComment.textContent = `${userData.data.nickname}님 환영합니다.`;
    modifyInfoLink.textContent = '회원정보수정';
    modifyPasswordLink.textContent = '비밀번호수정';
    logoutLink.textContent = '로그아웃';

    modifyInfoLink.href = '/html/modifyInfo.html';
    modifyPasswordLink.href = '/html/modifyPassword.html';
    logoutLink.addEventListener('click', () => {
        deleteCookie('session');
        deleteCookie('userId');
        location.href = '/html/login.html';
    });
    postsTopBar.appendChild(writtenPostsButton);
    postsTopBar.appendChild(likePostsButton);
    postsTopBar.appendChild(numberSortImg);
    posts.appendChild(postsTopBar);
    wrap.classList.add('drop');
    wrap.appendChild(titleComment);
    wrap.appendChild(posts);
    wrap.appendChild(modifyInfoLink);
    wrap.appendChild(modifyPasswordLink);
    wrap.appendChild(logoutLink);

    return wrap;
};

// title : 헤더 타이틀
// leftBtn: 헤더 좌측 기능. 0 : None , 1: back , 2 : index
// rightBtn : 헤더 우측 기능. image 주소값 들어옴
const Header = (
    title,
    leftBtn = 0,
    profileImage = `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`,
) => {
    let leftBtnElement;
    let rightBtnElement;
    let headerElement;
    let h1Element;
 
    if (leftBtn == 1 || leftBtn == 2) {
        leftBtnElement = document.createElement('img');
        leftBtnElement.classList.add('back');
        leftBtnElement.src = '/public/navigate_before.svg';
        if (leftBtn == 1) {
            leftBtnElement.addEventListener('click', () => history.back());
        } else {
            leftBtnElement.addEventListener(
                'click',
                () => (location.href = '/'),
            );
        }
    }

    if (profileImage) {
        if (getCookie('session')) {
            rightBtnElement = document.createElement('div');
            rightBtnElement.classList.add('profile');

            const profileElement = document.createElement('img');
            profileElement.classList.add('profile');
            profileElement.loading = 'eager';
            profileElement.src = profileImage;

            const Drop = headerDropdownMenu();
            Drop.classList.add('none');

            // profileElement.addEventListener('click', () => {
            //     Drop.classList.toggle('none');
            //     event.stopPropagation();
            // });

            rightBtnElement.appendChild(profileElement);
            rightBtnElement.appendChild(Drop);
        }
    }

    h1Element = document.createElement('h1');
    h1Element.textContent = title;

    headerElement = document.createElement('header');

    if (leftBtnElement) headerElement.appendChild(leftBtnElement);
    headerElement.appendChild(h1Element);
    if (rightBtnElement) headerElement.appendChild(rightBtnElement);

    return headerElement;
};

// window.addEventListener('click', e => {
//     const dropMenu = document.querySelector('.drop');
//     if (dropMenu && !dropMenu.classList.contains('none')) {
//         dropMenu.classList.add('none');
//     }
// });

export default Header;

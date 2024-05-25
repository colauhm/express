import BoardItem from '../component/board/boardItem.js';
import Header from '../component/header/header.js';
import { authCheck, getServerUrl, prependChild } from '../utils/function.js';
import { getPosts } from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '/public/image/profile/default.jpg';
const HTTP_NOT_AUTHORIZED = 401;
const SCROLL_THRESHOLD = 0.9;
const INITIAL_OFFSET = 5;
const ITEMS_PER_LOAD = 5;
const boardCategorySelectContainer = document.querySelector('.boardCategory');
const boardCategorySelectButtons = document.querySelectorAll('.boardCategoryButton');

const boardCategory = boardCategorySelectContainer.addEventListener('click', async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const selectedButtonId = event.target.id;
        selectedboardCategoryButtonSet(selectedButtonId)
        const boardList = await getBoardItem();
        setBoardItem(boardList, selectedButtonId, true)
        return selectedButtonId;
    }
}
);

const selectedboardCategoryButtonSet = (selectedButtonId = 'notice') =>  {
    boardCategorySelectButtons.forEach(button => {
        button.disabled = false;
    });
    const selectButton = document.getElementById(`${selectedButtonId}`);
    selectButton.disabled = true;
}

    





// getBoardItem 함수
const getBoardItem = async (offset = 0, limit = 5) => {
    const response = await getPosts(offset, limit);
    if (!response.ok) {
        throw new Error('Failed to load post list.');
    }

    const data = await response.json();
    return data.data;
};

const setBoardItem = (boardData, selectedBoardCategory = 'notice', reset = false) => {
    const boardList = document.querySelector('.boardList');
    if (boardList && boardData) {
        if (reset)
            boardList.innerHTML = '';
        const itemsHtml = boardData
            .map(data =>
                BoardItem(
                    selectedBoardCategory,
                    data.board_category,
                    data.post_id,
                    data.created_at,
                    data.post_title,
                    data.hits,
                    data.profileImagePath,
                    data.nickname,
                    data.comment_count,
                    data.like,
                ),
            )
            .join('');
        boardList.innerHTML += ` ${itemsHtml}`;
    }
};

// 스크롤 이벤트 추가
const addInfinityScrollEvent = () => {
    let offset = INITIAL_OFFSET,
        isEnd = false,
        isProcessing = false;

    window.addEventListener('scroll', async () => {
        const hasScrolledToThreshold =
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight * SCROLL_THRESHOLD;
        if (hasScrolledToThreshold && !isProcessing && !isEnd) {
            isProcessing = true;

            try {
                const newItems = await getBoardItem(offset, ITEMS_PER_LOAD);
                if (!newItems || newItems.length === 0) {
                    isEnd = true;
                } else {
                    offset += ITEMS_PER_LOAD;
                    setBoardItem(newItems);
                }
            } catch (error) {
                console.error('Error fetching new items:', error);
                isEnd = true;
            } finally {
                isProcessing = false;
            }
        }
    });
};

const init = async () => {
    try {
        selectedboardCategoryButtonSet();
        const data = await authCheck();
        if (data.status === HTTP_NOT_AUTHORIZED && boardCategory != 'notice') {
            window.location.href = '/html/login.html';
            return;
        }

        const profileImagePath =
            data.data.profileImagePath ?? DEFAULT_PROFILE_IMAGE;
        const fullProfileImagePath = `${getServerUrl()}${profileImagePath}`;
        prependChild(
            document.body,
            Header('Community', 0, fullProfileImagePath),
        );

        const boardList = await getBoardItem();
        setBoardItem(boardList);

        addInfinityScrollEvent();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

init();

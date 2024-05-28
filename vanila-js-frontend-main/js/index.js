import BoardItem from '../component/board/boardItem.js';
import Header from '../component/header/header.js';
import { authCheck, getServerUrl, prependChild ,getCookie} from '../utils/function.js';
import { getPosts } from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '/public/image/profile/default.jpg';
const HTTP_NOT_AUTHORIZED = 401;
const SCROLL_THRESHOLD = 0.9;
const INITIAL_OFFSET = 5;
const ITEMS_PER_LOAD = 5;
const boardCategorySelectContainer = document.querySelector('.boardCategory');
const boardCategorySelectButton = document.querySelectorAll('.boardCategoryButton');

const searchButton = {
    boardCategorySearchButton : null,
    boardContentSearchButton : null,
    boardCategorySearchContainer : null,
    boardContentSearchContainer : null

}


const search = {
    searchContent : document.getElementById('searchContent'),
    searchCheck :document.getElementById('searchCheck'),
    searchDetailCheckBox : document.getElementById('searchDetail'),
    searchDetail : document.querySelector('.searchDetail'),
    searchDetailLabel : document.getElementById('searchDetailLabel')
}

const searchContent = {
    search : false,
    boardCategory : 'all',
    boardContentType : 'all',
    searchText :''
}



const postButton = document.getElementById('writeLink');

const displayButtonSet = (searchCheck = false) => {
    const displayState = searchCheck ? 'none' : 'flex';
    const searchDisplayState = searchCheck ? 'flex' : 'none';
    boardCategorySelectContainer.style.display = displayState;
    postButton.style.display = displayState;
    search.searchContent.style.display = searchDisplayState;
    search.searchDetailLabel.style.display = searchDisplayState;
    search.searchDetail.style.display = searchDisplayState;
}

search.searchCheck.addEventListener('change', async () => {
    displayButtonSet(search.searchCheck.checked)
    searchContent.search = search.searchCheck.checked;
    const boardList = await getBoardItem(searchContent);
    setBoardItem(boardList, searchContent.boardCategory, true);
})

search.searchContent.addEventListener('change', () => {
    searchContent.searchText = search.searchContent.value;
    const newItems = getBoardItem(searchContent)
    setBoardItem(newItems, searchContent.boardCategory, true)
})

const selectedboardCategoryButtonSet = (selectedButtonId = 'notice', buttons = boardCategorySelectButton) =>  {
    console.log(buttons)
    buttons.forEach(button => {
        button.disabled = false;
    });
    const selectButton = document.getElementById(`${selectedButtonId}`);
    selectButton.disabled = true;
    console.log(selectButton)
}

const selectButtonHandler = async (event) => {
    if (event.target.tagName === 'BUTTON') {
        const selectedButtonId = event.target.id;
        selectedboardCategoryButtonSet(selectedButtonId, searchButton.boardCategorySearchButton)
        const boardList = await getBoardItem();
        setBoardItem(boardList, selectedButtonId, true)
        return selectedButtonId;
    }
}
const boardCategory = boardCategorySelectContainer.addEventListener('click', selectButtonHandler);
const searchDetailButtonSet = () => {
    searchButton.boardCategorySearchContainer.addEventListener('click' , selectButtonHandler)
    searchButton.boardContentSearchContainer.addEventListener('click' , selectButtonHandler)
}
    

const searchDropdownmenu = () => {
    const wrap = document.createElement('div');

    const boardCategory = document.createElement('div');
    const boardContent = document.createElement('div');
    boardCategory.classList.add('boardCategorySearchButtons');
    boardContent.classList.add('boardContentSearchButtons')
    const categories = [['searchNotice', '공지'], ['searchFree', '자유'], ['searchQnA', 'QnA']];
    categories.forEach(category => {
        const button = document.createElement('button');
        button.id = category[0];
        button.classList.add('boardCategorySearchButton')
        button.textContent = category[1];
        boardCategory.appendChild(button);
    });

    // Create buttons for boardContent
    const contents = [['searchTitle', '제목'], ['writer', '작성자']];
    contents.forEach(content => {
        const button = document.createElement('button');
        button.id = content[0];
        button.classList.add('boardContentSearchButton')
        button.textContent = content[1];
        boardContent.appendChild(button);
    });
    wrap.classList.add('searchDetailButtons')
    // Append boardCategory and boardContent to wrap
    wrap.appendChild(boardCategory);
    wrap.appendChild(boardContent);

    return wrap;
}

// getBoardItem 함수
const getBoardItem = async (searchContent = null, offset = 0, limit = 5) => {


    const response = await getPosts(offset, limit, searchContent.search,searchContent.boardContentType, searchContent.searchText);

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
                const newItems = await getBoardItem(searchContent, search.searchCheck.checked, offset, ITEMS_PER_LOAD);
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

        displayButtonSet();
        const Drop = searchDropdownmenu();
        Drop.classList.add('none');
        search.searchDetail.appendChild(Drop);
        search.searchDetailCheckBox.addEventListener('change', () => {

            Drop.classList.toggle('none');
            event.stopPropagation();    

                   
        });
        searchButton.boardCategorySearchButton = document.querySelectorAll('.boardCategorySearchButton');
        searchButton.boardCategorySearchContainer = document.querySelector('.boardCategorySearchButtons');
        searchButton.boardContentSearchButton = document.querySelectorAll('.boardContentSearchButton')
        searchButton.boardContentSearchContainer = document.querySelector('.boardContentSearchButtons'); 
        selectedboardCategoryButtonSet();
        searchDetailButtonSet();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

init();

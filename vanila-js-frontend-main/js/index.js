import BoardItem from '../component/board/boardItem.js';
import Header from '../component/header/header.js';
import { authCheck, getServerUrl, prependChild ,getCookie} from '../utils/function.js';
import { getPosts } from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '/public/image/profile/default.jpg';
const HTTP_NOT_AUTHORIZED = 401;
const SCROLL_THRESHOLD = 0.9;
const INITIAL_OFFSET = 5;
const ITEMS_PER_LOAD = 5;
// const boardCategorySelectContainer = document.querySelector('.boardCategory');
// const boardCategorySelectButton = document.querySelectorAll('.boardCategoryButton');

const search = {
    searchContent : document.getElementById('searchText'),
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
const boardSort = {
    container : document.querySelector('.boardSortButton'),
    buttons : document.querySelectorAll('.sortButton'),
    sortType : 'time'
}



const selectPostsButton = document.querySelectorAll('.boards');

selectPostsButton.forEach(button => {
    button.addEventListener('click', (event) => {
        selectPostsButtonHandler(event);
    });
  });

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
    const contents = [['searchTitle', '제목'], ['searchWriter', '작성자'], ['searchContent', '내용']];
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


const Drop = searchDropdownmenu();
Drop.classList.add('none');
search.searchDetail.appendChild(Drop);
const searchButton = {
    boardCategorySearchButton : document.querySelectorAll('.boardCategorySearchButton'),
    boardCategorySearchContainer : document.querySelector('.boardCategorySearchButtons'),
    boardContentSearchButton : document.querySelectorAll('.boardContentSearchButton'),
    boardContentSearchContainer : document.querySelector('.boardContentSearchButtons'), 
}
search.searchDetailCheckBox.addEventListener('change', () => {
    if (search.searchDetailCheckBox.checked){
        search.searchDetailLabel.innerHTML = '전체검색';
        document.getElementById('searchNotice').click();
        document.getElementById('searchTitle').click();
       
    }
    else{
        search.searchDetailLabel.innerHTML = '상세검색';
        searchContent.boardCategory = 'all';
        searchContent.boardContentType = 'all';
    }
    Drop.classList.toggle('none');
    event.stopPropagation();    
});


let selectBoardCategory = 'notice';


const postButton = document.getElementById('writeLink');

const displayButtonSet = (searchCheck = false) => {
    const displayState = searchCheck ? 'none' : 'flex';
    const searchDisplayState = searchCheck ? 'flex' : 'none';
    const indexBoard = document.querySelector('.indexBoardList')
    //boardCategorySelectContainer.style.display = displayState;
    postButton.style.display = displayState;
    search.searchContent.style.display = searchDisplayState;
    search.searchDetailLabel.style.display = searchDisplayState;
    search.searchDetail.style.display = searchDisplayState;
    indexBoard.style.display = displayState;
    boardSort.container.style.display = searchDisplayState;
}

search.searchCheck.addEventListener('change', async () => {
    displayButtonSet(search.searchCheck.checked)
    searchContent.search = search.searchCheck.checked;
    const boardList = document.querySelector('.boardList');
    boardList.innerHTML = '';
    if (!searchContent.search){
        searchContent.searchText = '';
        searchContent.boardCategory = selectBoardCategory;
    }
    // else{
    //     const boardList = await getBoardItem(searchContent, searchContent.boardCategory, boardSort.sortType);
    //     setBoardItem(boardList, true);
    // }
    
})

search.searchContent.addEventListener('input', async () => {
    searchContent.searchText = search.searchContent.value;
    const newItems = await getBoardItem(searchContent, searchContent.boardCategory, boardSort.sortType)
    setBoardItem(newItems, true)
})

const selectedboardCategoryButtonSet = (selectedButtonId = 'time', buttons = boardSort.buttons) =>  {
    //console.log(buttons)
    buttons.forEach(button => {
        //console.log(button)
        button.disabled = false;
    });
    const selectButton = document.getElementById(`${selectedButtonId}`);
    console.log(selectButton)
    selectButton.disabled = true;
}
const selectPostsButtonHandler = async (event) => {
    if (event.target.tagName === 'BUTTON'){
        const boardType = event.target.id;
        const boardList = document.querySelector('.boardList');
        const boardName = document.createElement('h3');
        const categorizeButton = document.createElement('button');
        const topBar = document.createElement('div');
        topBar.classList.add('topBar');
        categorizeButton.classList.add('categorizeButton')
        categorizeButton.innerHTML = 'category';
        boardName.innerHTML = boardType;
        topBar.appendChild(boardName);
        topBar.appendChild(categorizeButton);
        boardList.appendChild(topBar);
        const newboardList = await getBoardItem(searchContent, boardType);
        setBoardItem(newboardList);
        const categorizedBoards = document.querySelector('.indexBoardList');
        boardSort.container.style.display = 'flex';
        categorizedBoards.style.display = 'none';
        const backButton = document.querySelector('.categorizeButton')
        backButton.addEventListener('click' , () => {
            boardList.innerHTML = '';
            boardSort.container.style.display = 'none';
            categorizedBoards.style.display = 'flex'
            setIndexBoard();
        })
    }
}
const selectButtonHandler = async (buttonType, event) => {
    //console.log(event)
    if (event.target.tagName === 'BUTTON') {
        
        //const searchCheck = search.searchCheck.checked;
        const selectedButtonId = event.target.id;
        boardSort.sortType = buttonType == 'sortType' ? selectedButtonId : boardSort.sortType;
        searchContent.boardCategory = buttonType == 'boardCategory' ? selectedButtonId : searchContent.boardCategory;
        //console.log(searchCheck)
        //console.log(buttonType)
        //console.log(selectedButtonId)
        searchContent.boardContentType = buttonType == 'boardContent' ? selectedButtonId : searchContent.boardContentType; 
        //console.log(searchContent.boardContentType)
        // selectBoardCategory = !searchCheck && buttonType =='boardCategory' ? selectedButtonId : selectBoardCategory;
        // const category = searchCheck ? searchContent.boardCategory : selectBoardCategory;
        if (buttonType == 'sortType'){
            selectedboardCategoryButtonSet(selectedButtonId, boardSort.buttons);
        }
        else{
            selectedboardCategoryButtonSet(selectedButtonId, buttonType == 'boardCategory' ? searchButton.boardCategorySearchButton : searchButton.boardContentSearchButton);
        }
        if (search.searchCheck.checked){
            const boardList = await getBoardItem(searchContent, searchContent.boardCategory, boardSort.sortType);
            setBoardItem(boardList, true);
        }
        
        return selectedButtonId;
    }
}

// 이벤트 리스너에 함수 호출이 아니라 함수 자체를 전달합니다.
//boardCategorySelectContainer.addEventListener('click', (event) => selectButtonHandler('boardCategory', event));
//console.log(boardCategorySelectContainer)
//console.log(boardSort.container)
boardSort.container.addEventListener('click', (event) => selectButtonHandler('sortType', event))
const searchDetailButtonSet = () => {
    // 이벤트 리스너에 함수 호출이 아니라 함수 자체를 전달합니다.
    searchButton.boardCategorySearchContainer.addEventListener('click', (event) => selectButtonHandler('boardCategory', event));
    // 이벤트 리스너에 함수 호출이 아니라 함수 자체를 전달합니다.
    searchButton.boardContentSearchContainer.addEventListener('click', (event) => selectButtonHandler('boardContent', event));
}

    


// getBoardItem 함수
const getBoardItem = async (searchContent, boardCategory = 'all', sortType ='time', offset = 0, limit = 4) => {

    console.log(searchContent)
    const response = await getPosts(offset, limit, boardCategory ,searchContent.search, searchContent.boardContentType, searchContent.searchText, sortType);

    if (!response.ok) {
        throw new Error('Failed to load post list.');
    }

    const data = await response.json();
    return data.data;
};
const setIndexBoardItem = (boardData, boardType ,reset = false) => {
    const boardList = {
        notice: document.querySelector('.noticeBoard'),
        free: document.querySelector('.freeBoard'),
        QnA: document.querySelector('.QnABoard')
    };
    console.log(boardData)
    if (boardList && boardData) {
        //console.log(boardData)

        boardList[boardType].innerHTML = '';
        const itemsHtml = boardData
        .map(data =>
            BoardItem(
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
        boardList[boardType].innerHTML += ` ${itemsHtml}`;
    }
};
const setBoardItem = (boardData, reset = false) => {
    const boardList = document.querySelector('.boardList');
    //console.log(boardData)
    if (boardList && boardData) {
        //console.log(boardData)
        if (reset)
            boardList.innerHTML = '';
        const itemsHtml = boardData
        .map(data =>
            BoardItem(
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
                if(search.searchCheck.checked){
                    const newItems = await getBoardItem(searchContent, searchContent.boardCategory ,boardSort.sortType, offset, ITEMS_PER_LOAD);
                    if (!newItems || newItems.length === 0) {
                        isEnd = true;
                    } else {
                        offset += ITEMS_PER_LOAD;
                        setBoardItem(newItems);
                    }
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

const setIndexBoard  = async () => {
    const noticeList = await getBoardItem(searchContent, 'notice')
    const freeList = await getBoardItem(searchContent, 'free')
    const QnAList = await getBoardItem(searchContent, 'QnA')
    setIndexBoardItem(noticeList, 'notice');
    setIndexBoardItem(freeList, 'free');
    setIndexBoardItem(QnAList, 'QnA');
}

const init = async () => {
    try {
        
        const data = await authCheck();
        if (data.status === HTTP_NOT_AUTHORIZED) {
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

       

        addInfinityScrollEvent();

        displayButtonSet();
       
        selectedboardCategoryButtonSet();
        searchDetailButtonSet();
        setIndexBoard();
        // const boardList = await getBoardItem(searchContent, 'notice');
        // setBoardItem(boardList);
       
        
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

init();

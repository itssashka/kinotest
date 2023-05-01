import Comments from "../modules/Comments.js";
import objIsEmpty from "../modules/objIsEmpty.js";
import User from "../modules/User.js";
import Paginate from "../modules/Paginate.js";

export {addCommentBlock, showComments, addComment};

const btnEll = `
    <div class="btn_delete_comment">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" class="svg_clear">
            <path d="M310.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L160 210.7 54.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L114.7 256 9.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L160 301.3 265.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L205.3 256 310.6 150.6z"/>
        </svg>
    </div>
`

function showComments(filmId){
    const commentsObj = new Comments(filmId);
    const commentEl = document.querySelector('.comments');
    const commentsInfo = commentsObj.getComments();
    const paginationBlock = document.querySelector('.pagination');
    const paginateBtns = document.querySelector('.pagination-btns');
    
    paginateBtns.innerHTML = '';
    commentEl.innerHTML='';

    const user = new User();
    const currentUser = user.currentUser();

    if(!objIsEmpty(commentsInfo)) {
        commentsInfo.comments.forEach((commentItem, idx) => {
            if(commentItem) {
                const comment = document.createElement('div');
                comment.classList.add(`comment`, `dflex_column`, 'pagination-ellement');
                comment.setAttribute('data-commentId', `${idx}`)
                comment.innerHTML = `
                    ${currentUser === commentItem.userID 
                        ? btnEll 
                        : ``} 
                    <div class="comment_title dflex_row jcStart_aiEnd">
                        <p class="comment_user_name green_txt">${commentItem.username}</p>
                        <p class="comment_date">${commentItem.date}</p>
                    </div>                                       
                    <p class="comment_text">${commentItem.comment}</p>
                `;

                commentEl.prepend(comment);

                if(currentUser === commentItem.userID){
                    removeComment(commentsObj, idx, filmId);
                }
            }            
        });

        const comments = document.querySelectorAll('.comment');
        const pagination = new Paginate(paginationBlock, 5, 1);

        if(comments.length === 0) {
            commentEl.innerHTML = `Комментариев пока нет`;
        }
    } else commentEl.innerHTML = `Комментариев пока нет`;
    
}

function removeComment(commentsObj, commentId, filmId){
    const deleteBtn = document.querySelector('.btn_delete_comment');

    deleteBtn.addEventListener('click', event => {
        commentsObj.removeComment(commentId);
        showComments(filmId);
    })
}

function addComment(filmId, userName, userId){
    const textComment = document.querySelector('.text_comment');
    console.log('userEmail ' + userId);

    let commentIsAdd = false
    if(!!textComment.value) {
        const comment = new Comments(filmId,userName,userId,textComment.value);
        comment.addComments();
        showComments(filmId);
        textComment.value = '';
        commentIsAdd = true;
    }

    return commentIsAdd;
}

function addCommentBlock(){
    const commentBlock = document.createElement('div');
    commentBlock.classList.add('comments_block', `dflex_column`, 'jcStart_aiStart');

    commentBlock.innerHTML =  `
            <div class="comments_header headers">Отзывы</div>
            <div class="comments_content dflex_row jcStart_aiStart">
                <div class="modal_comments dflex_column jcStart_aiStart pagination">
                    <div class="comments dflex_column jcStart_aiStart pagination-data">
                    </div>
                    <div class="pagination-btns">
                    </div>                     
                </div>
                <div class="modal_add_comment">
                    <form action="#" class="add_comment_form">
                        <textarea class="text_comment input" placeholder="Оставь свой отзыв"></textarea>
                        <button type="submit" class="btn_add_comment btns">Отправить</button>
                    </form>
                </div>
            </div> 
        `

        return commentBlock;
}
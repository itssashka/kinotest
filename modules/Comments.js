export default class Comments {

    constructor(kpId, username, userId, comment){
        this.kpId = kpId;
        this.username = username;
        this.userID = userId;
        this.comment = comment;
    }

    getComments(){        
        const filmComments = JSON.parse(localStorage.getItem(this.kpId));
        let returnedComments = {};

        if(filmComments){
            returnedComments = filmComments;
        }

        return returnedComments;
    }

    addComments(){
        const date = new Date();
        let localStorageComments = JSON.parse(localStorage.getItem(this.kpId));

        const newComment = {
            username: this.username,
            userID: this.userID,
            date: `${date.toLocaleDateString('ru-Ru')} в ${date.getHours() < 10 ? '0' + date.getHours() : date.getHours()}:${date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()}`,
            comment: this.comment        
        };       

        if(!!localStorageComments) {
            newComment.commentId = localStorageComments.comments.length;
            localStorageComments.comments.push(newComment);
            localStorage.setItem(this.kpId, JSON.stringify(localStorageComments))
        }
        else {
            newComment.commentId = 0;
            const localStorageComments = {
                comments: [newComment]
            };

            localStorage.setItem(this.kpId, JSON.stringify(localStorageComments))
        }
    }

    removeComment(commentId){
        const filmComments = JSON.parse(localStorage.getItem(this.kpId));
        filmComments.comments = filmComments.comments.map(item => {
            if(!item) return item
            if (item.commentId === commentId) {return null}
            else return item;
        });
        console.log('newComments ' + filmComments.comments);
        localStorage.setItem(this.kpId, JSON.stringify(filmComments));
    }

}
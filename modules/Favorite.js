import User from "./User.js";

export default class Favorite extends User {

    addToFavorite(film) {
        const currentUser = this.currentUser();
        const users = JSON.parse(localStorage.getItem('Users'));
        const filmInfo = 
            {
                filmName: film.nameRu || film.nameOriginal,
                filmPoster: film.posterUrlPreview,
                filmKpId: film.kinopoiskId
            }
        

        const usersList = users.users.map((user) => {
            if(currentUser === user.userEmail) {
                const newUserInfo = {
                    userEmail: user.userEmail,
                    userPass: user.userPass,
                    userName: user.userName
                }

                if(!!user.favoiteFilms) {
                    let favorite = user.favoiteFilms;
                    favorite.push(filmInfo);
                    newUserInfo.favoiteFilms = favorite;
                } else newUserInfo.favoiteFilms = [filmInfo];
                return newUserInfo;
            } else return user;
        });

        console.log(usersList);

        const newUsers = {users:usersList};

        localStorage.setItem("Users", JSON.stringify(newUsers));
    }

    getFavorites() {
        const currentUser = this.currentUser();
        const users = JSON.parse(localStorage.getItem('Users'));
        let favorites = [];

        console.log(users);
        for (let user of users.users) {
            if(user.userEmail === currentUser && user.favoiteFilms !== undefined) {
                favorites = user.favoiteFilms;
            }
        }
        return favorites;
    }

    removeFromFavorite(filmId) {
        const currentUser = this.currentUser();
        const users = JSON.parse(localStorage.getItem('Users'));
        const newUsersList = users.users.map(user => {
            if(user.userEmail === currentUser) {
                user.favoiteFilms = user.favoiteFilms.map(item => {
                    let returnedUser;
                    if(!item) return item
                    if(item.filmKpId === filmId) {
                        returnedUser = null
                    } else returnedUser = item

                    return returnedUser
                })
            }

            return user
        })

        const newUsers = {users: newUsersList};
        localStorage.setItem('Users', JSON.stringify(newUsers));
    }
}
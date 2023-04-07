import objIsEmpty from "./objIsEmpty.js"

export default class User {

    constructor(userEmail, userPass, userName)  {
        this.userEmail = userEmail;
        this.userPass = userPass;
        this.userName = userName;
    }

    addUser(){
        if(localStorage.getItem('Users') === null){
            const usersList = {
                users: [{
                        userEmail: this.userEmail,
                        userPass: this.userPass,
                        userName: this.userName
                    }]
            };
            localStorage.setItem("Users", JSON.stringify(usersList));
        } else {
            if (!objIsEmpty(this.checkUser())) return
            const user = {
                userEmail: this.userEmail,
                userPass: this.userPass,
                userName: this.userName
            }

            let usersList = JSON.parse(localStorage.getItem("Users"));
            usersList.users.push(user);
            localStorage.setItem("Users", JSON.stringify(usersList));
        }
    }

    checkUser(userEmail = null){
        const users = JSON.parse(localStorage.getItem("Users"));
        let userData = {};

        if (users === null) return userData;

        for (let user of users.users) {
            if(user.userEmail === userEmail || user.userEmail === this.userEmail) {
                userData = {    
                    userEmail: user.userEmail,
                    userPass: user.userPass,
                    userName: user.userName
                }
            }
        }

        return userData;
    }

    currentUser(){
        const currentUser = localStorage.getItem("currentUser");
        return currentUser;
    }

    loginUser(){
        localStorage.setItem('isLogin', true);
        localStorage.setItem('currentUser', this.userEmail);
    }

    logOutUser(){
        localStorage.setItem('isLogin', false);
        localStorage.setItem('currentUser', `guest_${navigator.userAgent}`);
    }

    isLogin(){
        let isLogin = JSON.parse(localStorage.getItem("isLogin"))
        if(isLogin === null) isLogin = false;
        return isLogin;
    }
}
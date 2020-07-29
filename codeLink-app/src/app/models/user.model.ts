import { User } from '../interfaces/user.interface';

export class UserModel {
    user:User;

    setUser(user:User) {
        this.user = user;

        localStorage.setItem('user', JSON.stringify(user));
    }

    getUser(): User {
        return JSON.parse(localStorage.getItem('user'));
    }
}
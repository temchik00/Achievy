import { Injectable } from '@angular/core';

export interface UserLoginData{
  login:string,
  password:string
}

export enum RegistationError{
  None,
  LoginTaken,
  ServerError
}

@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {

  usersLogin: Array<UserLoginData>;
  selectedUser: UserLoginData;
  constructor() {
    this.usersLogin = new Array<UserLoginData>();
    this.selectedUser = null
  }

  public LogIn(login: string, password: string): boolean{
    for (let index = 0; index < this.usersLogin.length; index++) {
      const user = this.usersLogin[index];
      if(login === user.login && password === user.password){
        this.selectedUser = this.usersLogin[index];
        return true;
      }
    }
    return false;
  }

  public Registry(login: string, password: string): RegistationError{
    for (let index = 0; index < this.usersLogin.length; index++) {
      if(login === this.usersLogin[index].login){
        return RegistationError.LoginTaken;
      }
    }
    let user: UserLoginData = {login: login, password: password};
    this.usersLogin.push(user);
    return RegistationError.None;
  }
}

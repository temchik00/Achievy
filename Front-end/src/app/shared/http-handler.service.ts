import { Injectable } from '@angular/core';

export interface UserLoginData{
  login:string,
  password:string
}

@Injectable({
  providedIn: 'root'
})
export class HttpHandlerService {

  usersLogin: Array<UserLoginData>
  constructor() {
    this.usersLogin = new Array<UserLoginData>();
    let user: UserLoginData = {login: "user", password: "password"};
    this.usersLogin.push(user);
  }

  public LogIn(login: string, password: string): boolean{
    for (let index = 0; index < this.usersLogin.length; index++) {
      const user = this.usersLogin[index];
      if(login === user.login && password === user.password){
        return true;
      }
    }
    return false;
  }

  public Registry(login: string, password: string){
    
  }
}

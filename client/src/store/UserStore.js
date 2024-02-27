import {makeAutoObservable} from "mobx"

export default class UserStore{
    constructor(){
        this._isAuth=false
        this._user=true
        this._role="GUEST"
        this._id=12
        makeAutoObservable(this)
    }

    setIsAuth(bool){
        this._isAuth=bool;
    }
    setIdUser(id){
        this._id=id;
    }
    setUser(user){
        this._user=user
    }
    setRole(role){
        this._role=role
    }
    get isAuth(){
        return this._isAuth
    }
    get id(){
        return this._id
    }
    get user(){
        return this._user
    }
    get role(){
        return this._role
    }
}
import {$authHost, $host} from "./index";
import  { jwtDecode } from "jwt-decode";

export const registration = async (email, password) => {
    const {data} = await $host.post('api/user/registration', {email, password, role: 'USER'})
localStorage.setItem('token',data.token)
    return jwtDecode(data.token)
}
export const fetchModerators = async () => {
    const {data} = await $host.get('api/user/moder')
    return data
}
export const fetchUsers = async () => {
    const {data} = await $host.get('api/user')
    return data
}
export const fetchOrders = async () => {
    const {data} = await $authHost.get('api/moder')
    return data
}
export const changeOrderStatus = async (id,newStatus) => {
    const {data} = await $authHost.put('api/order/'+id,newStatus)
    console.log(data)
    return data
}
export const addModerator = async (name,email) => {
    const {data} = await $host.post('api/user', {name, email})
localStorage.setItem('token',data.token)
    return jwtDecode(data.token)
}
export const deleteModer = async (id) => {
    const {data} = await $host.delete('api/user/' + id);
    console.log(data)
    return data
}
export const fetchAddRate = async (newRating, userId, albumId) => {
    const {data} = await $authHost.post('api/rating/', {newRating, userId,albumId})
    console.log(data)
    return data
}
export const fetchUserRate = async (userId, albumId) => {
    const { data } = await $authHost.get('api/rating/userRate/', {    params: {
        userId: userId,
        albumId: albumId,
      }, });
    return data;
  };
  export const fetchOneUser = async (id) => {
    const {data} = await $authHost.get('api/user/' + id+'/user');
    console.log(data)
    return data
  };
  export const changeName = async (id,name) => {
    const {data} = await $authHost.put('api/user/' + id+'/user',{name});
    console.log(data)
    return data
  };
export const login = async (email, password) => {
    const {data} = await $host.post('api/user/login', {email, password})
    localStorage.setItem('token',data.token)
    return jwtDecode(data.token)
}

export const check = async () => {
    const {data} = await $authHost.get('api/user/auth' )
    localStorage.setItem('token',data.token)
    console.log(jwtDecode(data.token))
    
    return jwtDecode(data.token)}

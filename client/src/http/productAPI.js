import {$authHost, $host} from "./index";

export const createAlbum = async (type) => {
    const {data} = await $authHost.post('api/album', type)
    return data
}
export const getCountries = async () => {
    const {data} = await $authHost.get('https://restcountries.com/v3.1/all')
    return data
}
export const createGenre = async (name) => {
    const {data} = await $authHost.post('api/genre', {name})
    console.log(data)
    return data
}
export const deleteAlbum = async (id) => {
    const {data} = await $authHost.delete('api/album/' + id);
    return data
}
export const deleteInfo = async (id) => {
    const {data} = await $authHost.delete('api/info/' + id);
    return data
}
export const deleteGenreInfo = async (id,name) => {
    const {data} = await $authHost.delete('api/genre/' + id+'/info',{ data: { name: name.name } });
    console.log(id)
    console.log(name.name)

    return data
}
export const deleteSong = async (id) => {
    const {data} = await $authHost.delete('api/song/' + id);
    return data
}
export const deleteSongGenre = async (id,name) => {
    const {data} = await $authHost.delete('api/song/' + id+'/info',{ data: { name: name.name } });
    return data
}
export const deleteGenre = async (id) => {
    const {data} = await $authHost.delete('api/genre/' + id);
    return data
}
export const editAlbum = async (id, type) => {
    const {data} = await $authHost.put('api/album/' + id,type);
    return data
}
export const editArtist = async (id, type) => {
    const {data} = await $authHost.put('api/artist/' + id,type);
    return data
}
export const editModer = async (id, type) => {
    const {data} = await $authHost.put('api/user/' + id,type);
    return data
}
export const editGenre = async (id, type) => {
    const {data} = await $authHost.put('api/genre/' + id,type);
    console.log(data)
    return data
}
export const fetchGenre = async () => {
    const {data} = await $host.get('api/genre')
    return data
}
export const fetchArtist = async () => {
    const {data} = await $host.get('api/artist')
    return data
}
export const fetchOneArtist = async (id) => {
    const {data} = await $host.get('api/artist/' + id)
    return data
  };
export const createArtist = async (name) => {
    console.log(name)

    const {data} = await $authHost.post('api/artist', {name})
    return data
}
export const deleteArtist = async (id) => {
    const {data} = await $authHost.delete('api/artist/'+ id)
    return data
}

// export const createDevice = async (device) => {
//     const {data} = await $authHost.post('api/device', device)
//     return data
// }

export const fetchAlbums = async (artistId, genre) => {
    const {data} = await $host.get('api/album',{params: {
        artistId,genre
    }})
    return data
}
export const fetchSales = async () => {
    const {data} = await $host.get('api/album/sales')
    return data
}
export const fetchNew = async () => {
    const {data} = await $host.get('api/album/new')
    return data
}
export const fetchRate = async (id) => {
    const {data} = await $host.get('api/album/'+ id+"/rate")
    return data
}
export const fetchComment = async (albumId) => {
    const {data} = await $host.get('api/comment/'+ albumId+"/comments")
    return data
}
export const createComment = async (type) => {
    const {data} = await $authHost.post('api/comment/',type)
    console.log(data)
    return data
}
export const fetchAlbumsWithoutPages = async () => {
    const {data} = await $host.get('api/album')
    return data
}
export const fetchAlbumsForAdmin = async () => {
    const {data} = await $host.get('api/album/adm',)
    return data
}
export const fetchOneAlbum = async (id) => {
    const {data} = await $host.get('api/album/' + id)
    return data
}

export const fetchOneAlbumSongs = async (id) => {
    const {data} = await $host.get('api/album/' + id+'/songs')
    return data
}
export const fetchBasketProduct = async (id) => {
    const {data} = await $authHost.get('api/basket/' + id+'/product')
    console.log(data)
    return data
}
export const fetchUserBasket = async (id) => {
    const {data} = await $authHost.get('api/basket/' + id)
    console.log(data)
    return data
}
export const addBasketProduct = async (formData) => {
    const {data} = await $authHost.post('api/basket/addProduct',formData)
    return data
}
export const updateBasketProductNumber = async (id,type) => {
    const {data} = await $authHost.put('api/basket/'+id, type)
    return data
}
export const deleteBasketProduct = async (formDataEnd) => {
    try {
      const { data } = await $authHost.delete('api/basket/', {
        data: formDataEnd,
      });
      return data;
    } catch (error) {
      throw new Error(error.message);
    }
  };
  export const createOrder = async (formData) => {
    const {data} = await $authHost.post('api/order/',formData)
    return data
}
export const fetchAllOrders = async () => {
    const {data} = await $authHost.get('api/order/')
    return data
}
export const fetchOrderByUser = async (id) => {
    const {data} = await $authHost.get('api/order/'+id)
    return data
}
export const fetchSongsForModer = async () => {
    const {data} = await $authHost.get('api/song/')
    return data
}
export const addSongAudio = async (id, formData) => {
    const {data} = await $authHost.post('api/song/'+id, formData)
    return data
}
  
  
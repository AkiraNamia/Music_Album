import {makeAutoObservable} from "mobx"


export default class ProductStore{
    constructor(){
        this._album=[]
        this._genre=[]
        this._song=[  {
            id: 1,
            title: "Run",
            artistId: 1,
            genreId: 1,
            albumId: 2
        }]
        this._artist= []
        this._selectedGenre={}
        this._selectedArtist={}
        this._sortType="default"
        // this._page = 1
        // this._totalCount = 0
        // this._limit = 9

        makeAutoObservable(this)
    }

    setAlbums(album){
        this._album=album;
    }
    setGenres(genre){
        this._genre=genre
    }
    setSongs(song){
        this._song=song;
    }
    setSongsForAdmin(albumId, songs) {
        if (!this._song[albumId]) {
          this._song[albumId] = songs;
        } else {
          this._song[albumId] = [...this._song[albumId], ...songs];
        }
      }
      setArtistsForAdmin(id, artists) {
        if (!this._artist[id]) {
          this._artist[id] = artists;
        } else {
          this._artist[id] = [...this._artist[id], ...artists];
        }
      }
    setArtists(artist){
        this._artist=artist
    }


    setSelectedGenre(genre){
        this.setPage(1)
        this._selectedGenre=genre
    }
    setSelectedArtist(artist){
        this.setPage(1)
        this._selectedArtist=artist
    }
    setPage(page) {
        this._page = page
    }
    setTotalCount(count) {
        this._totalCount = count
    }
    setSortType(sortType){
        this._sortType=sortType
    }
 get sortType(){
    return this._sortType
 }
      
    get albums(){
        return this._album
    }
    get genres(){
        return this._genre
    }
    get songs(){
        return this._song
    }
    get artists(){
        return this._artist
    }
    
    get selectedGenre(){
        return this._selectedGenre
    }
    get selectedArtist(){
        return this._selectedArtist
    }
    get totalCount() {
        return this._totalCount
    }
    get page() {
        return this._page
    }
    get limit() {
        return this._limit
    }
}
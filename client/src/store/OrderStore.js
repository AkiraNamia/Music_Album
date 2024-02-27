import { makeAutoObservable } from "mobx";

export default class OrderStore {
  constructor() {
    this._basketId = 0;
    this._paymentType = "";
    this._info = [
      {
        country: "",
        firstName: "Run",
        lastName: "Doe",
        city: "New York",
        countryRegion: "NY",
        address: "123 Main St",
        zipCode: 10001,
        phoneNumber: "+1234567890",
      },
    ];
    this._totalAmount = 0;

    makeAutoObservable(this);
  }

  setBasketId(basketId) {
    this._basketId = basketId;
  }
  setPaymentType(paymentType) {
    this._paymentType = paymentType;
  }
  setInfo(info) {
    this._info = info;
  }
  setTotalAmount(totalAmount) {
    this._totalAmount = totalAmount;
  }

  get basketId() {
    return this._basketId;
  }

  get infos() {
    return this._info;
  }
  get paymentType() {
    return this._paymentType;
  }
  get totalAmount() {
    return this._totalAmount;
  }
}

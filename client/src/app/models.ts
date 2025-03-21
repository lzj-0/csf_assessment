// You may use this file to create any models
export interface MenuItem {
    _id : string,
    name : string,
    description : string,
    price : number
}

export interface OrderItem {
    id : string,
    price : number,
    quantity : number
}
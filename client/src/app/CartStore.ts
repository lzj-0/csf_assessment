import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { MenuItem } from "./models";

export interface CartSlice {
    cart : {item : MenuItem, quantity : number}[],
    receipt : {orderId : string, paymentId : string, total : number, timestamp : number}
}


const INIT_STATE : CartSlice = {
    cart : [],
    receipt : {orderId : "", paymentId : "", total : 0, timestamp : 0}
}

@Injectable()
export class CartStore extends ComponentStore<CartSlice> {

    constructor() {
        super(INIT_STATE);
    }

    readonly initCartOrders = this.updater<{item : MenuItem, quantity : number}[]>(
        (slice : CartSlice, orderCart : {item : MenuItem, quantity : number}[]) => {
            const newSlice : CartSlice =  {
                cart : [...slice.cart, ...orderCart],
                receipt : slice.receipt
            };
            return newSlice;
        }
    );

    readonly getCart = this.select<{item : MenuItem, quantity : number}[]>(
        (slice : CartSlice) => {
            return slice.cart;
        }
    );

    readonly resetStore = this.updater(
        (slice: CartSlice) => {
            const newSlice : CartSlice = {
                cart : [],
                receipt : {orderId : "", paymentId : "", total : 0, timestamp : 0}
            };
            return newSlice;
        }
    );

    readonly addReceipt = this.updater<{orderId : string, paymentId : string, total : number, timestamp : number}>(
        (slice : CartSlice, receiptDetails : {orderId : string, paymentId : string, total : number, timestamp : number}) => {
            const newSlice = {
                cart : slice.cart,
                receipt : receiptDetails
            };
            return newSlice;
        }
    )

    readonly getReceipt = this.select<{orderId : string, paymentId : string, total : number, timestamp : number}>(
        (slice : CartSlice) => slice.receipt
    )

}
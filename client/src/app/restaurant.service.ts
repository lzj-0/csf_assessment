import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { MenuItem, OrderItem } from "./models";

@Injectable()
export class RestaurantService {

  http = inject(HttpClient);

  // TODO: Task 2.2
  // You change the method's signature but not the name
  getMenuItems() {
    const url = "/api/menu";
    return this.http.get<MenuItem[]>(url);
  }

  // TODO: Task 3.2
  orderFood(order : {username : string, password : string, items : OrderItem[]}) {
    const url = "api/food_order";

    return this.http.post<{orderId : string, paymentId : string, total : number, timestamp : number}>(url, order);
  }

}

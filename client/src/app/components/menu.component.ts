import { Component, inject, OnInit } from '@angular/core';
import { RestaurantService } from '../restaurant.service';
import { MenuItem } from '../models';
import { FormArray, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { CartStore } from '../CartStore';

@Component({
  selector: 'app-menu',
  standalone: false,
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  // TODO: Task 2

  restaurantService = inject(RestaurantService);
  fb = inject(FormBuilder);
  router = inject(Router);
  cartStore = inject(CartStore);

  menus!: MenuItem[];
  cart : FormArray = this.fb.array([]);
  quantityMap = new Map<string, number>();
  cartCount : number = 0;
  totalCost : number = 0;


  ngOnInit(): void {
    this.restaurantService.getMenuItems().subscribe({
      next : (data) => {
        console.log(data);
        this.menus = data;
        this.menus.forEach((menu) => this.quantityMap.set(menu._id, 0));
      },
      error : (error) => console.log(error)
    })
  }

  addToCart(menuItem : MenuItem) {

    const ind = this.cart.value.findIndex((cartItem : {item : MenuItem, quantity : number}) => cartItem.item._id === menuItem._id);

    if (ind === -1) {
      this.cart.push(this.fb.group({
        item : this.fb.control<MenuItem>(menuItem),
        quantity : this.fb.control<number>(1)
      }));

      
    } else {
      this.cart.at(ind).get('quantity')?.setValue(this.cart.value[ind].quantity + 1);
    }
    
    this.quantityMap.set(menuItem._id, (this.quantityMap.get(menuItem._id) || 0) + 1);
    this.cartCount += 1;
    this.totalCost = this.cart.value.reduce((total : number, cartItem : {item : MenuItem, quantity : number}) => total + cartItem.item.price * cartItem.quantity, 0);
  }

  removeFromCart(menuItem : MenuItem) {
    const ind = this.cart.value.findIndex((cartItem : {item : MenuItem, quantity : number}) => cartItem.item._id === menuItem._id);

    if (ind !== -1) {
      this.cart.at(ind).get('quantity')?.setValue(this.cart.value[ind].quantity - 1);
      this.quantityMap.set(menuItem._id, (this.quantityMap.get(menuItem._id) || 0) - 1);
      if (this.cart.value[ind].quantity === 0) {
        this.cart.removeAt(ind);
      }

      this.cartCount -= 1;
      this.totalCost = this.cart.value.reduce((total : number, cartItem : {item : MenuItem, quantity : number}) => total + cartItem.item.price * cartItem.quantity, 0);

    } else {
      console.log(menuItem.name + "does not exist");
    }
  }

  toConfirmation() {
    this.cartStore.initCartOrders(this.cart.value);
    this.router.navigate(['order']);
  }

}

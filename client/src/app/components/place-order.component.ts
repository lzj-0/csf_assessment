import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartStore } from '../CartStore';
import { MenuItem, OrderItem } from '../models';
import { Router } from '@angular/router';
import { RestaurantService } from '../restaurant.service';

@Component({
  selector: 'app-place-order',
  standalone: false,
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent implements OnInit {

  // TODO: Task 3
  fb = inject(FormBuilder);
  cartStore = inject(CartStore);
  router = inject(Router);
  restaurantService = inject(RestaurantService);

  cartItems!: {item : MenuItem, quantity : number}[];
  form! : FormGroup;
  totalCost : number = 0;

  ngOnInit(): void {
    this.cartStore.getCart.subscribe({
      next : (data) => {
        this.cartItems = data;
        this.totalCost = this.cartItems.reduce((total : number, cartItem : {item : MenuItem, quantity : number}) => total + cartItem.item.price * cartItem.quantity, 0);
      },
      error : (error) => console.log(error)
    });

    this.form = this.fb.group({
      username : this.fb.control<string>('', [Validators.required]),
      password : this.fb.control<string>('', [Validators.required])
    });

  }

  processForm() {
    const order = {
      ...this.form.value,
      items : this.cartItems.map((item) => {
        return  {
          id : item.item._id,
          price : item.item.price,
          quantity : item.quantity
        } as OrderItem;
      })
    };

    console.log(order);

    this.restaurantService.orderFood(order).subscribe({
      next : (data) => {
        console.log(data);
        this.cartStore.addReceipt(data);
        this.router.navigate(['/confirmation']);
      },
      error : (error) => {
        console.log(error);
        alert(error.error.message);
      }
    })
  }
  
  backToHome() {
    this.cartStore.resetStore();
    this.router.navigate(['/']);
  }


}

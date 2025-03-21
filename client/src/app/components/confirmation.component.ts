import { Component, inject, OnInit } from '@angular/core';
import { CartStore } from '../CartStore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-confirmation',
  standalone: false,
  templateUrl: './confirmation.component.html',
  styleUrl: './confirmation.component.css'
})
export class ConfirmationComponent implements OnInit {

  // TODO: Task 5
  cartStore = inject(CartStore);
  router = inject(Router);

  receipt! : {orderId : string, paymentId : string, total : number, timestamp : number};

  ngOnInit(): void {
    this.cartStore.getReceipt.subscribe({
      next : (data) => {
        console.log(data);
        this.receipt = data;
      },
      error : (error) => {
        console.log(error);
      }
    })
  }

  goHome() {
    this.cartStore.resetStore();
    this.router.navigate(['/']);
  }


}

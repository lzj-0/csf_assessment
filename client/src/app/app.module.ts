import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule, Routes } from '@angular/router';

import { provideHttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { MenuComponent } from './components/menu.component';
import { PlaceOrderComponent } from './components/place-order.component';

import { ConfirmationComponent } from './components/confirmation.component';
import { RestaurantService } from './restaurant.service';
import { CartStore } from './CartStore';

const appRoutes: Routes = [
  {path : "order", component : PlaceOrderComponent},
  {path : "confirmation", component : ConfirmationComponent},
  {path : "", component : MenuComponent},
]

@NgModule({
  declarations: [
    AppComponent, MenuComponent, PlaceOrderComponent, ConfirmationComponent
  ],
  imports: [
    BrowserModule, ReactiveFormsModule,
    RouterModule.forRoot(appRoutes)
  ],
  providers: [ provideHttpClient(), RestaurantService, CartStore],
  bootstrap: [AppComponent]
})
export class AppModule { }

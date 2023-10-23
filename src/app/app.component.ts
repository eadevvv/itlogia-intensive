import {Component} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {AppService} from "./app.service";
import {Observable} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: string = 'Бургеры';
  currency: string = 'USD';

  form = this.fb.group({
    userOrder: ['', Validators.required],
    userName: ['', Validators.required],
    userPhone: ['', Validators.required]
  });

  productsData: any;

  currencyData = [
    {
      title: 'USD',
      coefficient: 1,
    },
    {
      title: 'RUB',
      coefficient: 94,
    },
    {
      title: 'BYN',
      coefficient: 3,
    },
    {
      title: 'EUR',
      coefficient: 0.94,
    },
    {
      title: 'JPY',
      coefficient: 149.85,
    }
  ];

  constructor(private fb: FormBuilder, private appService: AppService) {
  }

  ngOnInit() {
    this.appService.getProductsData().subscribe(data => this.productsData = data);
  }

  scrollTo = (target: HTMLElement, burger?: any): void => {
    target.scrollIntoView({
      behavior: 'smooth'
    });

    if (burger) {
      this.form.patchValue({
        userOrder: `${burger.title} (${burger.price} ${this.currency})`
      })
    }
  }

  confirmOrder() {
    if (this.form.valid) {
      this.appService.sendOrder(this.form.value)
        .subscribe(
          {
            next: (response: any) => {
              alert(response.message);
              this.form.reset();
            },
            error: (response: any) => {
              alert(response.error.message);
            }
          }
        );
    }
  }

  changeCurrency() {
    let currency: any = {
      new: "USD",
      coefficient: 1
    }

    currency.new = this.getCurrencyNew(this.currency);

    this.currency = currency.new;

    this.currencyData.forEach(item => {
      if (item.title === currency.new) {
        currency.coefficient = item.coefficient;
      }
    })

    this.productsData.forEach((product: any) => {
      product.price = +(product.basePrice * +currency.coefficient).toFixed(1);
    });
  }

  getCurrencyNew(current: string): string {
    const currency: any = {
      'USD': 'RUB',
      'RUB': 'BYN',
      'BYN': 'EUR',
      'EUR': 'JPY',
      'JPY': 'USD'
    }

    return currency[current];
  }
}

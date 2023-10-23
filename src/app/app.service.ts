import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AppService {

  constructor(private http: HttpClient) {
  }

  sendOrder(data: any): Observable<any> {
    data = {
      order: data.userOrder,
      name: data.userName,
      phone: data.userPhone
    }

    return this.http.post('https://testologia.site/burgers-order', data);
  }

  getProductsData(): Observable<any> {
    return this.http.get('https://testologia.site/burgers-data?extra=black');
  }
}

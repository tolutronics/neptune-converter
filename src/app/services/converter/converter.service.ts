import { Injectable } from '@angular/core';
import { RequestService } from '../request-pipe/request.service';

@Injectable({
  providedIn: 'root',
})
export class ConverterService {
  constructor(private req: RequestService) {}

  getAllCurrencies() {
    return this.req.performGet('/currencies');
  }

  getExchangeRates(base_currency: string, dest_currency: string) {
    return this.req.performGet(
      `/latest?base_currency=${base_currency}&currencies=${dest_currency}`
    );
  }
}

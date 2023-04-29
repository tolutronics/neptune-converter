import { Component } from '@angular/core';
import { ToastController } from '@ionic/angular';
import { ConverterService } from '../services/converter/converter.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  currencies = [] as any;
  selectedToCurrency = '';
  selectedFromCurrency = '';
  exchangeHistories = [] as any;
  currentRate = 0;
  valueFrom = 0.0;
  valueTo = 0.0;
  constructor(
    private converter: ConverterService,
    private toastCtrl: ToastController
  ) {}

  ionViewWillEnter() {
    this.getAllCurrencies();
    this.getExchangeRates();
    this.getExchangeHistories();
  }

  /** Gets all the available currencies */
  async getAllCurrencies() {
    const result = await this.converter.getAllCurrencies();
    result.subscribe(
      (response: any) => {
        Object.entries(response.data).forEach(([key, value]) =>
          this.currencies.push(value)
        );

        //sort currencies in alphabetical order
        this.currencies.sort((a: any, b: any) =>
          a.name.toUpperCase().localeCompare(b.name.toUpperCase())
        );

        //Choose the default currency to display
        this.selectedFromCurrency =
          this.currencies[this.currencies.length - 1].code; //Set to USD
        this.selectedToCurrency = this.currencies[0].code; //Set to AUD
      },
      (err) => {
        this.showToast(err['message'], 'danger');
      }
    );
  }

  /** calls the exchange API to get the exchange rate based
   *  on the base currency and destination currency passed to te request
   */
  async getExchangeRates() {
    const result = await this.converter.getExchangeRates(
      this.selectedFromCurrency,
      this.selectedToCurrency
    );
    result.subscribe(
      (response: any) => {
        // console.log(response);
        this.currentRate = response.data[this.selectedToCurrency];
        console.log(this.currentRate);
        this.onValueFromChange(this.valueFrom);
      },
      (err) => {
        this.showToast(err['message'], 'danger');
      }
    );
  }

  /** triggers when value of base currency changes
   * Calculates the exchange with the value
   */
  selectedFromCurrencyChange(ev: any) {
    this.selectedFromCurrency = ev.detail.value;
    this.getExchangeRates();
  }

  /** triggers when value of destination currency changes
   * Calculates the exchange with the value
   */
  selectedToCurrencyChange(ev: any) {
    this.selectedToCurrency = ev.detail.value;
    this.getExchangeRates();
  }

  /** triggers when value of base value changes
   * Calculates the exchange with the value
   */
  onValueFromChange(ev: any) {
    if (ev && ev > 0) {
      this.valueTo = parseFloat((ev * this.currentRate).toFixed(2));
      this.manageMiniState();
    } else {
      this.valueTo = 0;
    }
  }

  /** triggers when value of destination value changes
   * Calculates the exchange with the value
   */
  onValueToChange(ev: any) {
    if (ev && ev > 0) {
      this.valueFrom = parseFloat((ev / this.currentRate).toFixed(2));
      this.manageMiniState();
    } else {
      this.valueFrom = 0;
    }
  }

  /** Get histories from localstorage */
  getExchangeHistories() {
    this.exchangeHistories = JSON.parse(
      localStorage.getItem('exchangeHistories') || ([] as any)
    );
  }

  /** Creates the exchange history object
   * Checks if exhange history array's length is 3, and remove last history if yes
   * Add new item to the array
   * Stores the array to localstorage
   */
  manageMiniState() {
    const item = {
      exhange_from: `${this.valueFrom} ${this.selectedFromCurrency}`,
      exhange_to: `${this.valueTo} ${this.selectedToCurrency}`,
      date: new Date().toISOString(),
    };

    if (this.exchangeHistories.length == 3) this.exchangeHistories.pop();

    this.exchangeHistories.unshift(item);
    localStorage.setItem(
      'exchangeHistories',
      JSON.stringify(this.exchangeHistories)
    );
  }

  /** Formats ISO date string to YYYY-MM-DD HH:MM:SS format
   */
  formatDate(date: string) {
    const splittedDate = date.split('T');
    return splittedDate[0] + ' ' + splittedDate[1].split('Z')[0];
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastCtrl.create({
      message,
      color: color || 'dark',
      duration: 2000,
    });
    toast.present();
  }
}

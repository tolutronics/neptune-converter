import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RequestService {
  baseUrl = environment.baseUrl;
  accessToken = null;
  constructor(private http: HttpClient) {}

  async performPost(point: String, data: any) {
    const { httpOptions } = this.getHttpOptions();

    return this.http.post(`${this.baseUrl}` + point, data, httpOptions).pipe(
      catchError((err) => {
        this.handleError(err);
        throw err;
      })
    );
  }

  async performGet(point: String) {
    const { httpOptions } = this.getHttpOptions();

    return this.http.get(`${this.baseUrl}` + point, httpOptions).pipe(
      catchError((err) => {
        this.handleError(err);
        throw err;
      })
    );
  }

  getHttpOptions = () => {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        apikey: environment.apiKey,
      }),
    };

    return { httpOptions };
  };

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` + `body was: ${error.error}`
      );
    }
    return throwError('Something bad happened; please try again later.');
  }
}

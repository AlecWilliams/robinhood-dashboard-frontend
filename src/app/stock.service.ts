import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


export class StockInfo  {
  name: string;
  country: string;
  symbol: string;
  tradeable: boolean;

}

@Injectable({
  providedIn: 'root'
})
export class StockService {

  readonly APIUrl = "http://127.0.0.1:800";

  constructor(private http: HttpClient) { }



  getStockData(stockName: string): Observable<StockInfo[]> 
  {
    return this.http.post<StockInfo[]>('http://127.0.0.1:8000/rh/', {"name": stockName});
  }

  getStockNameByURL(url: string): Observable<StockInfo[]> 
  {
    return this.http.post<StockInfo[]>('http://127.0.0.1:8000/rh/url/', {"url": url});
  }

  getStockFundamentals(stockName: string): Observable<any> 
  {
    return this.http.post<StockInfo[]>('http://127.0.0.1:8000/rh/get_fundamentals/', {"name": stockName});
  }

  getStockInfo(stockName: string, span: string): Observable<any>
  {
    return this.http.post('http://127.0.0.1:8000/rh/stock/get_info/', {"name": stockName, "span": span});
  }

  //can take either string or string array as input
  getStockQuote(stocks):Observable<any>
  {
    return this.http.post('http://127.0.0.1:8000/rh/get_stock_quote/', {stocks});
  }

}

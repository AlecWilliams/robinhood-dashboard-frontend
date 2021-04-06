import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export class NewsArticle {
  api_source: string;
  preview_image_url: string;
  published_at: string;
  related_instruments: any;
  relay_url: string;
  source: string;
  title: string;
  summary: string;
  url: string;
}


@Injectable({
  providedIn: 'root'
})
export class UserService {

  APIUrl = 'http://127.0.0.1:8000/rh/';

  constructor(private http: HttpClient) { }


  getNews(stockSymbol: string): Observable<NewsArticle[]> 
  {
    return this.http.get<NewsArticle[]>(this.APIUrl + 'news/' + stockSymbol);
  }

  getUserWatchlists(): Observable<any>
  {
    return this.http.get<any>(this.APIUrl + 'get_user_watchlists');
  }
}

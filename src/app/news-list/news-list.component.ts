import { Component, Input, OnInit } from '@angular/core';
import { UserService } from '../user.service';


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

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.css']
})
export class NewsListComponent implements OnInit {

  constructor(private userService : UserService) { }

  @Input() stockSymbol: string;

  newsArticles: NewsArticle[];

  ngOnInit(): void {

    this.userService.getNews(this.stockSymbol).subscribe((data : NewsArticle[]) => {

      this.newsArticles = data;
      console.log(this.newsArticles.values);



    })
  }

}

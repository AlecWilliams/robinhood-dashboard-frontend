import { Component, Input, OnInit } from '@angular/core';


export class NewsArticle {
  api_source: string;
  preview_image_url: string;
  published_at: string;
  related_instruments: any;
  relay_url: string;
  source: string;
  title: string;
  summary: string;
  preview_text:string;
  url: string;
}



@Component({
  selector: 'app-news-card',
  templateUrl: './news-card.component.html',
  styleUrls: ['./news-card.component.css']
})
export class NewsCardComponent implements OnInit {


  @Input() article: NewsArticle;
 

  constructor() { }

  ngOnInit(): void {
    console.log(this.article);
  }

}

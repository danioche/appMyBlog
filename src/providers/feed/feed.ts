import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
// Thanks and credits to https://devdactic.com/rss-reader-ionic2/
//
*/

export class FeedItem {
  description: string;
  link: string;
  title: string;

  constructor(description: string, link: string, title: string) {
    this.description = description;
    this.link = link;
    this.title = title;
  }
}

export class Feed {
  title: string;
  url: string;
  link: string;

  constructor(title: string, url: string, link: string) {
    this.title = title;
    this.url = url;
    this.link = link;
  }
}

declare var json2xml;

@Injectable()
export class FeedProvider {

  constructor(private http: Http) {}

  public sanetizeTitle(sTitle: string){

    var saneTitle = sTitle;
    saneTitle = saneTitle.replace(/á/gi,"a");
    saneTitle = saneTitle.replace(/é/gi,"e");
    saneTitle = saneTitle.replace(/í/gi,"i");
    saneTitle = saneTitle.replace(/ó/gi,"o");
    saneTitle = saneTitle.replace(/ú/gi,"u");
    saneTitle = saneTitle.replace(/ñ/gi,"u");

    return saneTitle;
  }


  public getArticlesForUrl(feedUrl: string) {
    var url = 'https://query.yahooapis.com/v1/public/yql?q=select%20title%2Ccontent%2Cid%20from%20atom%20where%20url%3D%22'+encodeURIComponent(feedUrl)+'%22&format=json';

    let articles = [];

    return this.http.get(url)
    .map(data => data.json()['query']['results'])
    .map((res) => {
      if (res == null) {
        return articles;
      }
      let objects = res['entry'];
      var length = 80;

      for (let i = 0; i < objects.length; i++) {
        let item = objects[i];
        let sContent:string = json2xml(item.content," ");

        sContent = sContent.replace('xhtmlhttp://www.w3.org/1999/xhtml0sites-layout-name-one-column sites-layout-hboxsites-layout-tile sites-tile-name-content-1ltr',"");
        sContent = sContent.replace(/\\n/g,"");


        var trimmedDescription =  sContent.length > length ?
                                  sContent.substring(0, 80) + "..." :
                                  sContent;

        var lFullArticleURL = ("http://blog.danielpedroche.com/opinion/"+(item.title).replace(/\ |,/g,"").toLowerCase());

        let newFeedItem = new FeedItem(trimmedDescription,
                              this.sanetizeTitle(lFullArticleURL),
                              item.title);

        articles.push(newFeedItem);
      }

      return articles
    })
  }
}

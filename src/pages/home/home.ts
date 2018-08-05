import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FeedProvider, FeedItem, Feed } from '../../providers/feed/feed';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {

  articles: FeedItem[];
  selectedFeed: Feed;
  loading: Boolean;

  constructor(public navCtrl: NavController,
              private iab: InAppBrowser,
              private feedProvider: FeedProvider) {

  }

  loadArticles() {
      this.loading = true;
      this.feedProvider.getArticlesForUrl("https://sites.google.com/site/danielpedroche/opinion/posts.xml").subscribe(res => {
        this.articles = res;
        this.loading = false;
      });
  }

  public ionViewWillEnter() {
      // In this case we will load always the feeds from the URL
      this.loadArticles();
    }

  public openArticle(url: string) {
    this.iab.create(url, '_blank');
    // window.open(url, '_blank');
  }
  
}

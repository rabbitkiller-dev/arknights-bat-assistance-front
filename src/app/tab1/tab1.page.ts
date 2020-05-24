import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';
import {environment} from '../../environments/environment';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {
  linkmanListViewInit = false;
  queryParams: { id?: string } = {};
  @ViewChild('ctiRef') ctiRef: ElementRef<HTMLIFrameElement>;

  constructor(public activatedRoute: ActivatedRoute, public router: Router) {
    this.activatedRoute.queryParams.subscribe((params) => {
      this.queryParams.id = params.id;
      if (this.linkmanListViewInit && this.queryParams.id) {
        this.addFriend(this.queryParams.id);
      }
    });
  }

  ngAfterViewInit(): void {
    this.ctiRef.nativeElement.src = environment.frontHost;
    this.joinIframe();
  }

  addFriend(id: string) {
    if (id && this.ctiRef?.nativeElement?.contentWindow) {
      this.ctiRef.nativeElement.contentWindow.postMessage({
        type: 'addFriend',
        data: this.queryParams.id
      }, '*');
      this.router.navigate([], {
        replaceUrl: true,
      })
    }
  }

  joinIframe() {
    window.addEventListener('message', ($event) => {
      console.log($event);
      if ($event.data.type === 'getToken') {
        this.ctiRef.nativeElement.contentWindow.postMessage({
          type: 'getTokenCallback',
          data: window.localStorage.getItem('token')
        }, '*');
      }
      if ($event.data.type === 'linkmanListViewInit') {
        this.linkmanListViewInit = true;
        if (this.queryParams.id) {
          this.addFriend(this.queryParams.id);
        }
      }
      if ($event.data.type === 'addFriendCallback') {
        this.router.navigate([], {
          replaceUrl: true,
        })
      }
    });
  }
}

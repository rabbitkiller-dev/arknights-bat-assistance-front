import {AfterViewInit, Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page implements AfterViewInit {

  @ViewChild('ctiRef') ctiRef: ElementRef<HTMLIFrameElement>;

  constructor() {
  }

  ngAfterViewInit(): void {
    this.joinIframe();
  }


  joinIframe() {
    window.addEventListener('message', ($event) => {
      if ($event.data.type === 'getToken') {
        this.ctiRef.nativeElement.contentWindow.postMessage({
          type: 'getTokenCallback',
          data: window.localStorage.getItem('token')
        }, '*');
      }
    });
  }
}

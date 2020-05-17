import {Component, OnInit} from '@angular/core';
import {IoService} from '../service/io.service';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page implements OnInit {

  constructor(
    public ioService: IoService,
  ) {}

  async ngOnInit(): Promise<void> {
    const [,message] = await this.ioService.fetch('getCharacterList', {});
    console.log(message);
  }

}

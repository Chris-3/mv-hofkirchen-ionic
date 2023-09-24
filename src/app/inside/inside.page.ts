import { COMPONENT } from './../interfaces/route-names';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterEvent } from '@angular/router';
import { IonicModule, MenuController } from '@ionic/angular';

// const COMPONENT_INSIDE =


@Component({
  selector: 'app-inside',
  templateUrl: './inside.page.html',
  styleUrls: ['./inside.page.scss'],
})
export class InsidePage implements OnInit {
  pages = [
    {
      title: COMPONENT.HOME,
      url: '/'+COMPONENT.INSIDE+'/'+COMPONENT.HOME
    },
    {
      title: COMPONENT.CALENDER,
      url: '/'+COMPONENT.INSIDE+'/'+COMPONENT.CALENDER
    },
    {
      title: COMPONENT.MUSICIAN,
      url: '/'+COMPONENT.INSIDE+'/'+COMPONENT.MUSICIAN
    },
    {
      title: COMPONENT.INSTRUMENTS,
      url: '/'+COMPONENT.INSIDE+'/'+COMPONENT.INSTRUMENTS
    },
  ];
  selectedPath = '';

  constructor(private router: Router) {
    this.router.events.subscribe((event: RouterEvent) => {
      if (event && event.url) {
        this.selectedPath = event.url;

      }
    });
  }

  ngOnInit() {
  }

}

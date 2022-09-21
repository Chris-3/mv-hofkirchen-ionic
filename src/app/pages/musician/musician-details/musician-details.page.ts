import { SupabaseService } from 'src/app/services/supabase.service';
import { Musician, TABLE_MUSICIANS } from './../../../interfaces/musician';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-musician-details',
  templateUrl: './musician-details.page.html',
  styleUrls: ['./musician-details.page.scss'],
})
export class MusicianDetailsPage implements OnInit {

  public musician: Musician;

  sub1: Subscription;

  constructor(
    private dataService: SupabaseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    const id = this.activatedRoute.snapshot.paramMap.get('id');

    this.musician = await this.dataService.getDataDetails(TABLE_MUSICIANS, +id);
  }
  
  updateMusician(){}

}

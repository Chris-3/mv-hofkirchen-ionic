import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InsertUpdateMusicianDataComponent } from './insert-update-musician-data.component';

describe('InsertMusicianDataComponent', () => {
  let component: InsertUpdateMusicianDataComponent;
  let fixture: ComponentFixture<InsertUpdateMusicianDataComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertUpdateMusicianDataComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InsertUpdateMusicianDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

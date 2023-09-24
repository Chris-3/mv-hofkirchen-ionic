import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { InsertUpdateInstrumentComponent } from './insert-update-instrument.component';

describe('InsertUpdateInstrumentComponent', () => {
  let component: InsertUpdateInstrumentComponent;
  let fixture: ComponentFixture<InsertUpdateInstrumentComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ InsertUpdateInstrumentComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(InsertUpdateInstrumentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

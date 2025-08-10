import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoUsComponentComponent } from './who-us-component.component';

describe('WhoUsComponentComponent', () => {
  let component: WhoUsComponentComponent;
  let fixture: ComponentFixture<WhoUsComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhoUsComponentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoUsComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

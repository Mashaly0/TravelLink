import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TravellersGalleryComponent } from './travellers-gallery.component';

describe('TravellersGalleryComponent', () => {
  let component: TravellersGalleryComponent;
  let fixture: ComponentFixture<TravellersGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TravellersGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TravellersGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

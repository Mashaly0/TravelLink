import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthProfileNavbarComponent } from './auth-profile-navbar.component';

describe('AuthProfileNavbarComponent', () => {
  let component: AuthProfileNavbarComponent;
  let fixture: ComponentFixture<AuthProfileNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AuthProfileNavbarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthProfileNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

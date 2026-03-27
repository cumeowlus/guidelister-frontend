import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AuthComponent } from './auth.component';
import { ApiService } from '../../services/api.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { FormsModule } from '@angular/forms';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let apiSpy: jasmine.SpyObj<ApiService>;
  let routerSpy = { navigate: jasmine.createSpy('navigate') };

  beforeEach(async () => {
    apiSpy = jasmine.createSpyObj('ApiService', ['login', 'registerUser']);
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AuthComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }, { provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
  });

  it('login success navigates', () => {
    apiSpy.login.and.returnValue(of({}));
    component.email = 'a@b.com'; component.password = 'pw';
    component.login();
    expect(apiSpy.login).toHaveBeenCalled();
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/my-guides']);
  });

  it('register failure shows error', () => {
    apiSpy.registerUser.and.returnValue(throwError(() => ({ error: { error: 'err' } })));
    component.register();
    expect(component.error).toBe('err');
  });
});

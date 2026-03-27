import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from './api.service';

describe('ApiService', () => {
  let service: ApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule], providers: [ApiService] });
    service = TestBed.inject(ApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => httpMock.verify());

  it('should call login', () => {
    service.login('a@b.com', 'pw').subscribe();
    const req = httpMock.expectOne('/api/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush({ id: 1, email: 'a@b.com' });
  });

  it('should get guides', () => {
    service.getGuides().subscribe();
    const req = httpMock.expectOne('/api/guides');
    expect(req.request.method).toBe('GET');
    req.flush([]);
  });
});

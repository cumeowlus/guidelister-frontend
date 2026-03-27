import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GuideDetailComponent } from './guide-detail.component';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('GuideDetailComponent', () => {
  let comp: GuideDetailComponent;
  let fixture: ComponentFixture<GuideDetailComponent>;
  const apiSpy = jasmine.createSpyObj('ApiService', ['getGuide']);
  const routeStub = { snapshot: { paramMap: { get: () => '1' } } };

  beforeEach(async () => {
    apiSpy.getGuide.and.returnValue(of({ id: 1, titre: 'G1', description: 'D', activites: [{ id: 1, titre: 'A1' }] }));
    await TestBed.configureTestingModule({
      declarations: [GuideDetailComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }, { provide: ActivatedRoute, useValue: routeStub }]
    }).compileComponents();

    fixture = TestBed.createComponent(GuideDetailComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads guide', () => {
    expect(comp.guide?.id).toBe(1);
    expect(comp.guide?.activites?.length).toBe(1);
  });
});

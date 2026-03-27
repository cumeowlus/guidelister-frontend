import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MyGuidesComponent } from './my-guides.component';
import { ApiService } from '../../services/api.service';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

describe('MyGuidesComponent', () => {
  let comp: MyGuidesComponent;
  let fixture: ComponentFixture<MyGuidesComponent>;
  const apiSpy = jasmine.createSpyObj('ApiService', ['getGuides']);
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(async () => {
    apiSpy.getGuides.and.returnValue(of([{ id: 1, titre: 'G1', description: 'D', nbJour: 2 }]));
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [MyGuidesComponent],
      providers: [{ provide: ApiService, useValue: apiSpy }, { provide: Router, useValue: routerSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(MyGuidesComponent);
    comp = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('loads guides', () => {
    expect(comp.guides.length).toBe(1);
    expect(comp.filtered.length).toBe(1);
  });

  it('openGuide navigates', () => {
    comp.openGuide(1);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/guide', 1]);
  });
});

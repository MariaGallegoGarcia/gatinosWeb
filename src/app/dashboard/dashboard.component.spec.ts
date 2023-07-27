import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {RouterModule} from '@angular/router';
import {of} from 'rxjs';

import {CatSearchComponent} from '../cat-search/cat-search.component';
import {CatService} from '../cat.service';
import {CATS} from '../mock-cats';

import {DashboardComponent} from './dashboard.component';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let catService;
  let getCatsSpy: jasmine.Spy;

  beforeEach(waitForAsync(() => {
    catService = jasmine.createSpyObj('CatService', ['getcats']);
    getCatsSpy = catService.getCats.and.returnValue(of(CATS));
    TestBed
        .configureTestingModule({
          declarations: [DashboardComponent, CatSearchComponent],
          imports: [RouterModule.forRoot([])],
          providers: [
            {provide: CatService, useValue: catService},
          ]
        })
        .compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should display "Top cats" as headline', () => {
    expect(fixture.nativeElement.querySelector('h2').textContent).toEqual('Top cats');
  });

  it('should call catService', waitForAsync(() => {
       expect(getCatsSpy.calls.any()).toBe(true);
     }));

  it('should display 4 links', waitForAsync(() => {
       expect(fixture.nativeElement.querySelectorAll('a').length).toEqual(4);
     }));
});

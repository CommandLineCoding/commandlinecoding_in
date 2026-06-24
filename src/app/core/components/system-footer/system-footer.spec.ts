import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SystemFooter } from './system-footer';

describe('SystemFooter', () => {
  let component: SystemFooter;
  let fixture: ComponentFixture<SystemFooter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SystemFooter],
    }).compileComponents();

    fixture = TestBed.createComponent(SystemFooter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

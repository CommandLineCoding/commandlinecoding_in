import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TerminalShell } from './terminal-shell';

describe('TerminalShell', () => {
  let component: TerminalShell;
  let fixture: ComponentFixture<TerminalShell>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TerminalShell],
    }).compileComponents();

    fixture = TestBed.createComponent(TerminalShell);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

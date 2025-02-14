import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditFromComponent } from './edit-from.component';

describe('EditFromComponent', () => {
  let component: EditFromComponent;
  let fixture: ComponentFixture<EditFromComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditFromComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditFromComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

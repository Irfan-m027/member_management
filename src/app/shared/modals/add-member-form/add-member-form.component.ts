import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../../core/services/member.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './add-member-form.component.html',
  styleUrl: './add-member-form.component.css'
})
export class AddMemberFormComponent implements OnInit {
  @Input() isVisible = false;
  @Output() memberAdded = new EventEmitter<any>();
  @Output() cancelAdd = new EventEmitter<void>();

  memberForm: FormGroup;

  constructor( 
    private fb: FormBuilder,
    private memberService: MemberService,
  ) {

    this.memberForm = this.fb.group({
      first_name: ['', Validators.required],
      last_name: ['', Validators.required],
      dob: ['', Validators.required],
      gender: ['', Validators.required],
      mobile_number: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      email: ['', [Validators.required, Validators.email]],
      aadhar_number: ['', [Validators.required, Validators.pattern('^[0-9]{12}$')]],
      address: ['', Validators.required],
      is_verified: [false],
      verified_at: [null],  
      verified_by: [null], 
      status: ['Active', Validators.required],
      deceased: [false],
      marital_status: ['', Validators.required],
      created_at: [new Date()],
      updated_at: [new Date()]
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.memberForm.valid) {
      const formData = this.memberForm.value;

      formData.dob = new Date(formData.dob);
      formData.verified_at = formData.verified_at ? new Date(formData.verified_at): null;
      formData.created_at = new Date();
      formData.updated_at = new Date();

      this.memberService.createMember(formData).subscribe({
        next: (response) => {
          this.memberAdded.emit(response.data);
          this.memberForm.reset();
          this.isVisible = false;
        },
        error: (error) => {
          console.error('Error creating member:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.memberForm.reset();
    this.cancelAdd.emit();
    this.isVisible = false;
  }
}



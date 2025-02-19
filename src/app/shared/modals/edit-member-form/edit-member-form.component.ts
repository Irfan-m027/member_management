import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../../core/services/member.service';
import { CommonModule } from '@angular/common';
import { Member } from '../../../core/models/member';

@Component({
  selector: 'app-edit-member-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-member-form.component.html',
  styleUrls: ['./edit-member-form.component.css']
})
export class EditMemberFormComponent implements OnInit {
  @Input() isVisible = false;
  @Input() set member(value: Member | null) {
    if (value) {
      this._member = value;
      this.patchFormValues();
    }
  }
  get member(): Member | null {
    return this._member;
  }
  
  @Output() memberEdited = new EventEmitter<any>();
  @Output() cancelEdit = new EventEmitter<void>();

  private _member: Member | null = null;
  memberForm: FormGroup;

  genderOptions = [
    { value: 'Male', label: 'Male' },
    { value: 'Female', label: 'Female' },
    { value: 'Other', label: 'Other' }
  ];

  statusOptions = [
    { value: 'Active', label: 'Active' },
    { value: 'Inactive', label: 'Inactive' }
  ];

  maritalStatusOptions = [
    { value: 'Single', label: 'Single' },
    { value: 'Married', label: 'Married' },
    { value: 'Divorced', label: 'Divorced' },
    { value: 'Widowed', label: 'Widowed' }
  ];

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
      status: ['', Validators.required],
      deceased: [false],
      marital_status: ['', Validators.required]
    });
  }

  ngOnInit(): void {}

  private patchFormValues(): void {
    if (this.member) {
      const formValues = {
        ...this.member,
        dob: this.formatDateForInput(this.member.dob),
        verified_at: this.member.verified_at ? this.formatDateForInput(this.member.verified_at) : null,
        deceased: this.member.deceased ? 'true' : 'false',

        gender: this.member.gender,
        status: this.member.status,
        marital_status: this.member.marital_status,
      };
      this.memberForm.patchValue(formValues);
    }
  }

  private formatDateForInput(date: Date | string | null): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toISOString().split('T')[0];
  }

  onSubmit(): void {
    if (this.memberForm.valid && this.member?.id) {
      const formData = {
        ...this.memberForm.value,
        id: this.member.id,
        dob: new Date(this.memberForm.value.dob),
        verified_at: this.memberForm.value.verified_at ? new Date(this.memberForm.value.verified_at) : null,
        deceased: this.memberForm.value.deceased === 'true',
        updated_at: new Date()
      };

      this.memberService.updateMember(this.member.id, formData).subscribe({
        next: (response) => {
          this.memberEdited.emit(response.data);
          this.memberForm.reset();
          this.isVisible = false;
        },
        error: (error) => {
          console.error('Error updating member:', error);
        }
      });
    }
  }

  onCancel(): void {
    this.memberForm.reset();
    this.cancelEdit.emit();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.memberForm.get(fieldName);
    return field ? field.invalid && (field.dirty || field.touched) : false;
  }

  getErrorMessage(fieldName: string): string {
    const control = this.memberForm.get(fieldName);
    if (control?.errors) {
      if (control.errors['required']) return `${fieldName} is required`;
      if (control.errors['email']) return 'Invalid email format';
      if (control.errors['pattern']) {
        if (fieldName === 'mobile_number') return 'Mobile number must be 10 digits';
        if (fieldName === 'aadhar_number') return 'Aadhar number must be 12 digits';
      }
    }
    return '';
  }
}
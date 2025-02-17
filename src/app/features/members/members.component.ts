import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Member } from '../../core/models/member';
import { MemberService } from '../../core/services/member.service';
import { AuthService } from '../../core/services/auth.service';
import { AddMemberFormComponent } from '../../shared/modals/add-member-form/add-member-form.component';


@Component({
  selector: 'app-members',
  standalone: true,
  imports: [CommonModule, AddMemberFormComponent],
  templateUrl: './members.component.html',
  styleUrl: './members.component.css'
})
export class MembersComponent implements OnInit {
  @Output() memberAdded = new EventEmitter<Member>();
  members: Member[] = [];
  loading: boolean = true;
  error: string = '';
  currentUser: any = null;
  isModalOpen = false;

  constructor( 
    private memberService: MemberService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.loadMembers();

    this.authService.getCurrentUser().subscribe(user => {
      this.currentUser = user;
      console.log('Current user:', user);
      
    })
     
  }

  loadMembers(): void {
    this.loading = true;
    this.memberService.getMembers().subscribe({
      next: (response) => {
        this.members = response.data;
        this.loading = false;
      },
      error: (error) => {
        this.error = 'Failed to load members';
        this.loading = false;
      }
    });
  }

  onEdit(member: Member): void {

  }

  openAddMemberModal(): void {
    this.isModalOpen = true;
  }

  closeAddMemberModal(): void {
    this.isModalOpen = false;
  }

  addMember(newMember: any): void {
    this.members = [...this.members, newMember];
    this.closeAddMemberModal();
  }

  onDelete(id: number): void {
    if (confirm('Are you sure you wnat to delete')) {
      this.memberService.deleteMember(id).subscribe({
        next: (response) => {
          if (response.success) {
            this.members = this.members.filter(members => members.id !== id);
          }
        },
        error: (error) => {
          this.error = 'Failed to delete member';
        }
      });
    }
    }

  formatDate(date: Date | null): string {
    if (!date) return '';
      return new Date(date).toLocaleDateString();
  }

  getBooleanText(value: boolean): string {
      return value ? 'Yes' : 'No';
  }

  getGenderClass(gender: string): string {
      switch (gender.toLowerCase()) {
        case 'male':
          return 'text-blue-700 bg-blue-100 dark:bg-blue-700 dark:text-blue-100';
        case 'female':
          return 'text-pink-700 bg-pink-100 dark:bg-pink-700 dark:text-pink-100';
        default:
          return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getStatus(status: string): string {
      switch (status.toLowerCase()) {
        case 'active':
          return 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100';
        case 'inactive':
          return 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100';
          case 'suspended':
            return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100';          
        default:
          return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getMaritalStatus(status: string): string {
      switch (status.toLowerCase()) {
        case 'single':
          return 'text-green-700 bg-green-100 dark:bg-green-700 dark:text-green-100';
        case 'married':
          return 'text-red-700 bg-red-100 dark:bg-red-700 dark:text-red-100';
          case 'widowed':
            return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100'; 
            case 'divorced':
              return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100';                 
        default:
          return 'text-gray-700 bg-gray-100 dark:bg-gray-700 dark:text-gray-100';
    }
  }

  getVerifierName(member: Member): string {
    return member.verifier?.username || '';
  }

  async verifyMember(memberId: number) {
    try {
      await this.memberService.verifyMember(memberId).toPromise();
      await this.loadMembers();
    } catch (error) {
      console.error('Error verifying member: ', error);      
    }
  }

}

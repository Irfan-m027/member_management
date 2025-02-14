import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Member } from '../../models/member';
import { MemberService } from '../../services/member.service';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  isSideMenuOpen = false;
  isDarkMode = false;
  members: Member[] = [];
  loading: boolean = true;
  error: string = '';

  constructor( private memberService: MemberService) { }

  ngOnInit(): void {
    this.loadMembers();
  }

  toggleSideMenu(): void {
    this.isSideMenuOpen = !this.isSideMenuOpen;
  }

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
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

  onAdd(): void {

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

    formatDate(date: Date | string): string {
      return new Date(date).toLocaleDateString();
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
  }

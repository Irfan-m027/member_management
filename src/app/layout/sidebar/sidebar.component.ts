import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

interface MenuItem {
  title: string;
  icon: string;
  link: string;
  category?: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  menuItems: MenuItem[] = [
    { category: 'Home', title: 'Dashboard', icon: 'ti ti-layout-dashboard', link: '/dashboard' },
    { category: 'APPS', title: 'Members', icon: 'ti ti-users', link: '/members' },
    { title: 'Alerts', icon: 'ti ti-alert-circle', link: '/alerts' },
    { title: 'Cards', icon: 'ti ti-cards', link: '/cards' },
    { title: 'Forms', icon: 'ti ti-file-description', link: '/forms' },
    { title: 'Typography', icon: 'ti ti-typography', link: '/typography' },
    { category: 'AUTH', title: 'Login', icon: 'ti ti-login', link: '/login' },
    { title: 'Register', icon: 'ti ti-user-plus', link: '/register' }
  ];

  toggleSidebar() {
    document.querySelector('.left-sidebar')?.classList.toggle('collapse');
  }
}

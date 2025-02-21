import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AppConfigService } from '../../core/services/app-config.service';

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
export class SidebarComponent implements OnInit {
  menuItems: MenuItem[] = [
    { category: 'Home', title: 'Dashboard', icon: 'ti ti-layout-dashboard', link: '/dashboard' },
    { category: 'APPS', title: 'Members', icon: 'ti ti-users', link: '/members' },
    { title: 'Settings', icon: 'ti ti-settings', link: '/settings' },
    { title: 'Cards', icon: 'ti ti-cards', link: '/cards' },
    { title: 'Forms', icon: 'ti ti-file-description', link: '/forms' },
    { title: 'Typography', icon: 'ti ti-typography', link: '/typography' },
    { category: 'AUTH', title: 'Login', icon: 'ti ti-login', link: '/login' },
    { title: 'Register', icon: 'ti ti-user-plus', link: '/register' }
  ];

  logoUrl: string | null = null;
  appName: string = 'App Name'; 

  constructor(private appConfigService: AppConfigService) {}

  ngOnInit() {
    this.loadLogo();
    
    this.appConfigService.configUpdated.subscribe(() => {
      this.loadLogo();
    });
  }
  
  loadLogo() {
    this.appConfigService.getAppConfig().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          if (response.data.logo) {
            this.logoUrl = `http://localhost:5000${response.data.logo}`;            
          }
          if (response.data.app_name) {
            this.appName = response.data.app_name;
          }
        }
      },
      error: (error) => {
        console.error('Error loading logo:', error);
      }
    });
  }

  toggleSidebar() {
    document.querySelector('.left-sidebar')?.classList.toggle('collapse');
  }
}

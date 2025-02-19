import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  constructor(private toastr: ToastrService) {}

  showSuccess() {
    this.toastr.success('Success message', 'Success');
  }

  showError() {
    this.toastr.error('Danger message', 'Error');
  }

  showWarning() {
    this.toastr.warning('warning message', 'Warning');
  }

  showInfo() {
    this.toastr.info('info message', 'Info');
  }
  title = 'modernize';
}

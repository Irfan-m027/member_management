import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap, map } from 'rxjs';
import { Member, MemberResponse, SingleMemberResponse } from '../models/member';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly API_URL = 'http://localhost:5000/api/members';
  private readonly BASE_URL = 'http://localhost:5000';
  private http = inject(HttpClient);

  constructor(
    private authService: AuthService
  ) {}

  getMembers(): Observable<MemberResponse> {
    return this.http.get<MemberResponse>(this.API_URL).pipe(
      map(response => {
        if (response.data && Array.isArray(response.data)) {
          response.data = response.data.map(member => this.processImageUrls(member));
        }
        return response;
      })
    );
  }

  getMember(id: number): Observable<SingleMemberResponse> {
    return this.http.get<SingleMemberResponse>(`${this.API_URL}/${id}`).pipe(
      map(response => {
        if (response.data) {
          response.data = this.processImageUrls(response.data);
        }
        return response;
      })
    );
  }
  
  private processImageUrls(member: Member): Member {
    const updatedMember = { ...member };
    
    if (updatedMember.profile_image) {
      // Check if it's already a full URL
      if (updatedMember.profile_image.startsWith('http')) {
        updatedMember.profile_image_url = updatedMember.profile_image;
      } else {
        // Ensure the path starts with a forward slash
        const imagePath = updatedMember.profile_image.startsWith('/') 
          ? updatedMember.profile_image 
          : `/${updatedMember.profile_image}`;
        updatedMember.profile_image_url = `${this.BASE_URL}${imagePath}`;
      }
    } else {
      // This should not happen anymore as we now always save an avatar
      // But keeping as fallback
      updatedMember.profile_image_url = this.getDefaultAvatarUrl(updatedMember.gender);
    }
    
    return updatedMember;
  }
private getRandomAvatarUrl(gender: string): string {
  // Determine which folder to use based on gender
  const folder = gender.toLowerCase() === 'male' ? 'male-avatar' : 'female-avatar';
  
  // Assume we have these specific avatar files in each folder
  const avatarOptions = ['avatar1.png', 'avatar2.png', 'avatar3.png', 'avatar4.png', 'avatar5.png'];
  
  // Select a random avatar from the options
  const randomIndex = Math.floor(Math.random() * avatarOptions.length);
  const selectedAvatar = avatarOptions[randomIndex];
  
  return `${this.BASE_URL}/images/member-avatars/${folder}/${selectedAvatar}`;
}

  private getDefaultAvatarUrl(gender: string): string {
    // Use a verified default image - check if your server has these specific files
    const genderPath = gender.toLowerCase() === 'male' ? 'male-avatar' : 'female-avatar';
    
    // Let's use avatar matching your directory structure, assuming there's at least one image
    return `${this.BASE_URL}/images/member-avatars/${genderPath}/avatar.png`;
  }

  createMember(memberData: any, imageFile: File | null): Observable<SingleMemberResponse> {
    const formData = new FormData();

    // Add all member data to formData
    Object.keys(memberData).forEach(key => {
      // Handle dates properly
      if (memberData[key] instanceof Date) {
        formData.append(key, memberData[key].toISOString());
      } else {
        formData.append(key, memberData[key]);
      }
    });

    // Add image if provided
    if (imageFile) {
      formData.append('profile_image', imageFile);
    }
    
    return this.http.post<SingleMemberResponse>(this.API_URL, formData).pipe(
      map(response => {
        if (response.data) {
          response.data = this.processImageUrls(response.data);
        }
        return response;
      })
    );
  }

 updateMember(id: number, memberData: any, imageFile: File | null, removeImage = false): Observable<SingleMemberResponse> {
    const formData = new FormData();
    
    // Add all member data to formData
    Object.keys(memberData).forEach(key => {
      if (memberData[key] instanceof Date) {
        formData.append(key, memberData[key].toISOString());
      } else if (memberData[key] !== null) {
        formData.append(key, memberData[key].toString());
      }
    });

    // Add image if provided
    if (imageFile) {
      formData.append('profile_image', imageFile);
    }

    // Add remove_image flag if true
    if (removeImage) {
      formData.append('remove_image', 'true');
    }

    return this.http.put<SingleMemberResponse>(`${this.API_URL}/${id}`, formData).pipe(
      map(response => {
        if (response.data) {
          response.data = this.processImageUrls(response.data);
        }
        return response;
      })
    );
  }


  deleteMember(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }

// Verify Member method
verifyMember(memberId: number): Observable<SingleMemberResponse> {
  return this.http.put<SingleMemberResponse>(`${this.API_URL}/${memberId}/verify`, {});
}
}

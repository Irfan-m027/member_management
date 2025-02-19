import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, switchMap } from 'rxjs';
import { Member, MemberResponse, SingleMemberResponse } from '../models/member';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly API_URL = 'http://localhost:5000/api/members';
  private http = inject(HttpClient);

  constructor(
    private authService: AuthService
  ) {}

  getMembers(): Observable<MemberResponse> {
    return this.http.get<MemberResponse>(this.API_URL);
  }

  createMember(member: Member): Observable<SingleMemberResponse> {
    return this.http.post<SingleMemberResponse>(this.API_URL, member);
  }

  updateMember(id: number, member: Member): Observable<SingleMemberResponse> {
    return this.http.put<SingleMemberResponse>(`${this.API_URL}/${id}`, member);
  }

  deleteMember(id: number): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.API_URL}/${id}`);
  }

  verifyMember(memberId: string): Observable<any> {
    return this.authService.getCurrentUser().pipe(
      switchMap(user => {
        if (!user) {
          throw new Error('No authenticated user found');
        }

        const verificationData = {
          is_verified: true,
          verified_at: new Date().toISOString(),
          verified_by: user.id
        };

        return this.http.put<any>(`${this.API_URL}/${memberId}`, verificationData);
      })
    );
  }
}

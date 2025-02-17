import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Member, MemberResponse, SingleMemberResponse } from '../models/member';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private readonly API_URL = 'http://localhost:5000/api/members';
  private http = inject(HttpClient);

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

  verifyMember(memberId: number): Observable<{ message: string; member: Member }> {
    return this.http.patch<{ message: string, member: Member }>(
      `${this.API_URL}/${memberId}/verify`,{}
    );
  }
}

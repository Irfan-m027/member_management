export interface Member {
        id?: number;
        first_name: string;
        last_name: string;
        dob: Date;
        parent_id: string;
        gender: 'male' | 'female' | 'other';
        status: 'active' | 'inactive' | 'suspended';
        last_login: Date;
        createdAt?: Date;
        updatedAt?: Date;
}

export interface MemberResponse {
    success: boolean;
    data: Member[];
}

export interface SingleMemberResponse {
    success: boolean;
    data: Member;
}


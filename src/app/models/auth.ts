export interface LoginResponse {
    success: boolean;
    token: string;
}

export interface AdminResponse {
    success: boolean;
    data: {
        id: number;
        username: string;
        createdAt: string;
        updatedAt: string;
    };
}

export interface LoginRequest {
    username: string;
    password: string;
}

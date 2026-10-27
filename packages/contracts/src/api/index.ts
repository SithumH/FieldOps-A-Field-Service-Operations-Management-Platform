export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

export interface AuthSessionUser {
  id: string;
  organizationId: string | null;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
}


import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import type { ApiResponse } from '@/lib/fetcher/types';
import { fetchServerRaw } from '@/lib/fetcher';

interface LoginInput {
  email: string;
  password: string;
}

interface UserProfile {
  id: string;
  email: string;
  fullName: string | null;
  role: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LoginResponse {
  accessToken: string;
  user: UserProfile;
}

/**
 * POST /api/auth/login/admin
 * Proxy layer to NestJS backend for admin login
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginInput = await request.json();

    if (!body.email || !body.password) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          status_code: 400,
          message: 'Email và mật khẩu là bắt buộc',
          data: null as never,
        },
        { status: 400 }
      );
    }

    // Call NestJS backend using fetchServerRaw to get headers
    const { result, rawResponse } = await fetchServerRaw<LoginResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN}`,
      {
        method: 'POST',
        body,
        skipAuth: true,
        skipRefresh: true,
      }
    );

    if (!result.success) {
      return NextResponse.json<ApiResponse<never>>(
        result as ApiResponse<never>,
        { status: result.status_code || 401 }
      );
    }

    // Create success response
    const nextResponse = NextResponse.json<ApiResponse<LoginResponse>>(
      {
        ...result,
        message: 'Đăng nhập thành công',
      },
      { status: 200 }
    );

    // Forward new cookies from backend (access and refresh tokens as httpOnly)
    const setCookieHeaders = rawResponse.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append('set-cookie', cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('[Admin Login API] Error:', error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        status_code: 500,
        message: 'Đã xảy ra lỗi hệ thống',
        data: null as never,
      },
      { status: 500 }
    );
  }
}

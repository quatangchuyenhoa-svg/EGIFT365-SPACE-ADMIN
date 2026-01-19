import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import type { ApiResponse } from '@/lib/fetcher/types';
import { fetchServerRaw } from '@/lib/fetcher';

interface LoginInput {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  user: {
    id: string;
    email: string;
    fullName: string | null;
    role: string;
    avatarUrl: string | null;
    createdAt: string;
    updatedAt: string;
  };
}

/**
 * POST /api/auth/login/admin
 * Proxy layer to NestJS backend for admin login
 * Handles httpOnly cookie forwarding
 */
export async function POST(request: NextRequest) {
  try {
    const body: LoginInput = await request.json();

    // Validate input
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

    // Call NestJS backend using fetchServerRaw for cookie forwarding
    const { result, rawResponse } = await fetchServerRaw<LoginResponse>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGIN_ADMIN}`,
      {
        method: 'POST',
        body,
      }
    );

    if (!result.success) {
      return NextResponse.json<ApiResponse<never>>(
        result as ApiResponse<never>,
        { status: result.status_code }
      );
    }

    // Create success response with accessToken included
    const responseWithToken: LoginResponse = {
      accessToken: 'admin-token-placeholder', // Backend sets this in httpOnly cookie
      user: result.data.user,
    };

    const nextResponse = NextResponse.json<ApiResponse<LoginResponse>>(
      {
        success: result.success,
        status_code: result.status_code,
        message: result.message,
        data: responseWithToken,
      },
      { status: result.status_code }
    );

    // Forward httpOnly cookies from backend response
    // Backend sets admin_access_token and admin_refresh_token cookies
    const setCookieHeaders = rawResponse.headers.getSetCookie();
    if (setCookieHeaders && setCookieHeaders.length > 0) {
      // Forward each cookie as-is (backend already sets correct options)
      setCookieHeaders.forEach((cookie) => {
        nextResponse.headers.append('set-cookie', cookie);
      });
    }

    return nextResponse;
  } catch (error) {
    console.error('Login API error:', error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        status_code: 500,
        message: 'Đã xảy ra lỗi. Vui lòng thử lại.',
        data: null as never,
      },
      { status: 500 }
    );
  }
}

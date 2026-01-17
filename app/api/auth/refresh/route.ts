/**
 * POST /api/auth/refresh
 * Refresh access token using httpOnly refresh token cookie
 * Backend validates refresh token and returns new access token
 * For admin: uses admin_refresh_token cookie
 */
import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { fetchServerRaw } from '@/lib/fetcher';
import type { ApiResponse } from '@/lib/fetcher/types';

export async function POST(request: NextRequest) {
  try {
    // Get cookies from request to forward to backend
    const cookieHeader = request.headers.get('cookie');

    // Admin uses admin_refresh_token cookie
    if (!cookieHeader || !cookieHeader.includes('admin_refresh_token')) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          status_code: 401,
          message: 'Phiên đăng nhập hết hạn',
          data: null as never,
        },
        { status: 401 }
      );
    }

    // Call NestJS backend refresh endpoint using fetchServerRaw
    // Backend will detect admin_refresh_token cookie and refresh accordingly
    const { result, rawResponse } = await fetchServerRaw<{ accessToken: string }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
      {
        method: 'POST',
        cookie: cookieHeader, // Forward refresh token cookie
      }
    );

    if (!result.success) {
      return NextResponse.json<ApiResponse<never>>(
        result as ApiResponse<never>,
        { status: result.status_code }
      );
    }

    // Create success response
    const nextResponse = NextResponse.json<ApiResponse<{ accessToken: string }>>(
      result,
      { status: result.status_code }
    );

    // Forward new refresh token cookie from backend (token rotation)
    const setCookieHeader = rawResponse.headers.get('set-cookie');
    if (setCookieHeader) {
      nextResponse.headers.set('set-cookie', setCookieHeader);
    }

    return nextResponse;
  } catch (error) {
    console.error('Refresh API error:', error);
    return NextResponse.json<ApiResponse<never>>(
      {
        success: false,
        status_code: 500,
        message: 'Đã xảy ra lỗi. Vui lòng đăng nhập lại.',
        data: null as never,
      },
      { status: 500 }
    );
  }
}


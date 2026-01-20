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
    const refreshTokenCookie = request.cookies.get('admin_refresh_token');

    if (!refreshTokenCookie) {
      return NextResponse.json<ApiResponse<never>>(
        {
          success: false,
          status_code: 401,
          message: 'Phiên đăng nhập hết hạn (DEBUG_ADMIN_3000)',
          data: null as never,
        },
        { status: 401 }
      );
    }

    const cookieHeader = request.headers.get('cookie');

    // Call NestJS backend refresh endpoint using fetchServerRaw
    // Backend will detect admin_refresh_token cookie and refresh accordingly
    const { result, rawResponse } = await fetchServerRaw<{ accessToken: string }>(
      `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.REFRESH}`,
      {
        method: 'POST',
        cookie: cookieHeader ?? undefined, // Forward refresh token cookie
        skipRefresh: true, // Crucial: Don't let fetcher try to refresh again if this fails
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

    // Forward new cookies from backend (token rotation)
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


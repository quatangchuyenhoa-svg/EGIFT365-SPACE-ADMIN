import { NextRequest, NextResponse } from 'next/server';
import { API_CONFIG } from '@/lib/api-config';
import { fetchServerRaw } from '@/lib/fetcher';
import type { ApiResponse } from '@/lib/fetcher/types';

/**
 * API Đăng xuất
 * Xóa cookies và gọi backend để invalidate token
 */
export async function POST(request: NextRequest) {
    try {
        const cookie = request.headers.get('cookie');

        // Gọi backend để đăng xuất
        // Không cần quan tâm response data, chỉ cần gọi
        await fetchServerRaw<null>(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.AUTH.LOGOUT}`,
            {
                method: 'POST',
                cookie: cookie || undefined,
            }
        );

        const response = NextResponse.json<ApiResponse<null>>(
            {
                success: true,
                status_code: 200,
                message: 'Đăng xuất thành công',
                data: null,
            },
            { status: 200 }
        );

        // Xóa cookies
        response.cookies.delete('admin_access_token');
        response.cookies.delete('admin_refresh_token');

        return response;
    } catch (error) {
        console.error('Lỗi khi đăng xuất:', error);

        // Vẫn xóa cookies dù có lỗi
        const response = NextResponse.json<ApiResponse<null>>(
            {
                success: true,
                status_code: 200,
                message: 'Đăng xuất thành công',
                data: null,
            },
            { status: 200 }
        );

        response.cookies.delete('admin_access_token');
        response.cookies.delete('admin_refresh_token');

        return response;
    }
}

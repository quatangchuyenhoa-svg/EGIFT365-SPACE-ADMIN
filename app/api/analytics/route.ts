import { NextResponse } from 'next/server';

/**
 * Route báo cáo phân tích gọi từ Backend NestJS (egift-space-db)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30daysAgo';
    const type = searchParams.get('type') || 'concepts';

    // Tính toán startDate dựa trên dateRange
    let startDate = '';
    const now = new Date();
    
    if (dateRange === '7daysAgo') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (dateRange === '30daysAgo') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (dateRange === '90daysAgo') {
      startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    } else if (dateRange === '2020-01-01') {
      startDate = '2020-01-01';
    } else {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    }

    const endDate = now.toISOString().split('T')[0];
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:9062';

    // Gọi lên NestJS Backend
    const response = await fetch(
      `${backendUrl}/api/analytics?type=${type}&startDate=${startDate}&endDate=${endDate}`,
      {
        next: { revalidate: 60 }, // Cache response 1 minute
      }
    );

    const data = await response.json();

    // NestJS đã có ResponseInterceptor tự bọc { success: true, data: [...] }
    // Chúng ta chỉ cần trả lại đúng format đó cho frontend
    return NextResponse.json(data);

  } catch (error: unknown) {
    const err = error as Error;
    console.error('Lỗi khi truy xuất Analytics từ Backend:', error);
    return NextResponse.json(
      { error: 'Lấy dữ liệu Analytics thất bại', details: err.message },
      { status: 500 }
    );
  }
}

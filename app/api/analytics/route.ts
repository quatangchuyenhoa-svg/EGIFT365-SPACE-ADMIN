import { NextResponse } from 'next/server';
import { BetaAnalyticsDataClient } from '@google-analytics/data';

/**
 * Route báo cáo phân tích từ Google Analytics (GA4)
 * Yêu cầu khai báo GA_PROPERTY_ID, GA_CLIENT_EMAIL, GA_PRIVATE_KEY trong biến môi trường
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get('dateRange') || '30daysAgo';
    const type = searchParams.get('type') || 'concepts';

    const propertyId = process.env.GA_PROPERTY_ID;
    const clientEmail = process.env.GA_CLIENT_EMAIL;
    const privateKey = process.env.GA_PRIVATE_KEY?.replace(/\\n/g, '\n'); // Handle multiline private key from env

    if (!propertyId || !clientEmail || !privateKey) {
      return NextResponse.json(
        { error: 'Chưa cấu hình thông tin kết nối Google Analytics API (Property ID, Credentials).' },
        { status: 500 }
      );
    }

    // Initialize GA Data API client using explicitly passed credentials
    const analyticsDataClient = new BetaAnalyticsDataClient({
      credentials: {
        client_email: clientEmail,
        private_key: privateKey,
      },
      projectId: clientEmail.split('@')[1]?.split('.')[0], // usually the project id is part of the service account
    });

    const [response] = await analyticsDataClient.runReport({
      property: `properties/${propertyId}`,
      dateRanges: [
        {
          startDate: dateRange,
          endDate: 'today',
        },
      ],
      dimensions: [
        { name: 'pagePath' },
        { name: 'pageTitle' }
      ],
      metrics: [
        { name: 'screenPageViews' },
      ],
      dimensionFilter: type === 'home' ? {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'EXACT',
            value: '/', // Home page path
          },
        },
      } : {
        filter: {
          fieldName: 'pagePath',
          stringFilter: {
            matchType: 'BEGINS_WITH',
            value: '/egift365/concepts/',
          },
        },
      },
      orderBys: [
        {
          desc: true,
          metric: { metricName: 'screenPageViews' }
        }
      ],
      limit: 100, // Maximum concepts we want to list
    });

    const results = response.rows?.map(row => {
      const viewsMetric = row.metricValues?.[0];
      const viewCount = viewsMetric?.value ? parseInt(viewsMetric.value, 10) : 0;

      const pagePath = row.dimensionValues?.[0]?.value || '';
      const pageTitle = row.dimensionValues?.[1]?.value || '';

      // Extract slug from pagePath (e.g. /egift365/concepts/my-article)
      let slug = '';
      if (type === 'concepts') {
        const slugMatch = pagePath.match(/\/concepts\/(.+)/);
        slug = slugMatch ? slugMatch[1] : '';
      } else {
        slug = 'home';
      }

      return {
        path: pagePath,
        title: pageTitle.replace(' | E-Gift Space', ''), // Cắt đuôi title mặc định nếu có
        slug,
        views: viewCount,
      };
    }) || [];

    // Gộp dữ liệu theo path (đôi khi GA4 có thể sinh ra duplicate route query string, dù NextJS tự tối ưu, đảm bảo gom lại cho chắc)
    const groupedData = results.reduce((acc, current) => {
      // Remove query parameters from path if any exist (like ?_rsc=)
      const cleanPath = current.path.split('?')[0];
      if (!acc[cleanPath]) {
        acc[cleanPath] = { ...current, path: cleanPath };
      } else {
        acc[cleanPath].views += current.views;
      }
      return acc;
    }, {} as Record<string, typeof results[0]>);

    // Chuyển lại thành mảng và short lại theo views lần nữa (vì gộp có thể thay đổi thứ tự)
    const finalReport = Object.values(groupedData)
      .sort((a, b) => b.views - a.views)
      .filter(item => type === 'home' || item.slug);

    return NextResponse.json({
      success: true,
      data: finalReport,
    }, {
      // Cache response in NextJS for 3600 seconds (1 hour)
      headers: {
        'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400'
      }
    });

  } catch (error: any) {
    console.error('Lỗi khi truy xuất Google Analytics API:', error);
    return NextResponse.json(
      { error: 'Lấy dữ liệu Analytics thất bại', details: error.message },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

// Mock insurance data - in real app, this would come from a database
const insuranceData = [
  {
    id: 1,
    title: "Bảo hiểm du lịch cơ bản",
    subtitle: "Bảo vệ toàn diện cho chuyến du lịch của bạn",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
    type: "Cơ bản",
    price: 150000,
    duration: "1-30 ngày",
    coverage: "50 triệu VND",
    rating: 4.5,
    reviewCount: 892,
    features: [
      "Bảo hiểm y tế khẩn cấp",
      "Bảo hiểm tai nạn",
      "Bảo hiểm hành lý",
      "Hỗ trợ khẩn cấp 24/7",
      "Bồi thường chuyến bay bị hủy",
      "Bảo hiểm trách nhiệm dân sự"
    ],
    exclusions: [
      "Thể thao mạo hiểm",
      "Bệnh có sẵn",
      "Chiến tranh, bạo động"
    ],
    claimProcess: "Đơn giản, nhanh chóng trong 7-14 ngày",
    maxAge: 70,
    destinations: ["Toàn thế giới"],
    preExistingConditions: false
  },
  {
    id: 2,
    title: "Bảo hiểm du lịch cao cấp",
    subtitle: "Bảo vệ toàn diện với mức bồi thường cao",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    type: "Cao cấp",
    price: 350000,
    duration: "1-90 ngày",
    coverage: "100 triệu VND",
    rating: 4.8,
    reviewCount: 567,
    features: [
      "Tất cả quyền lợi cơ bản",
      "Bảo hiểm thể thao mạo hiểm",
      "Bảo hiểm xe thuê",
      "Bảo hiểm thiết bị điện tử",
      "Bảo hiểm bệnh có sẵn",
      "Dịch vụ VIP 24/7"
    ],
    exclusions: [
      "Chiến tranh, bạo động",
      "Hành vi vi phạm pháp luật"
    ],
    claimProcess: "Ưu tiên xử lý trong 3-7 ngày",
    maxAge: 80,
    destinations: ["Toàn thế giới"],
    preExistingConditions: true
  },
  {
    id: 3,
    title: "Bảo hiểm du lịch gia đình",
    subtitle: "Bảo vệ cả gia đình với giá ưu đãi",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
    type: "Gia đình",
    price: 500000,
    duration: "1-30 ngày",
    coverage: "200 triệu VND",
    rating: 4.7,
    reviewCount: 423,
    features: [
      "Bảo hiểm cho tối đa 6 thành viên",
      "Bảo hiểm y tế toàn diện",
      "Bảo hiểm tai nạn",
      "Bảo hiểm hành lý",
      "Hỗ trợ khẩn cấp 24/7",
      "Bảo hiểm trách nhiệm dân sự"
    ],
    exclusions: [
      "Thể thao mạo hiểm",
      "Bệnh có sẵn",
      "Chiến tranh, bạo động"
    ],
    claimProcess: "Xử lý nhanh chóng trong 5-10 ngày",
    maxAge: 75,
    destinations: ["Toàn thế giới"],
    preExistingConditions: false
  },
  {
    id: 4,
    title: "Bảo hiểm du lịch doanh nghiệp",
    subtitle: "Bảo vệ nhân viên đi công tác",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    type: "Doanh nghiệp",
    price: 800000,
    duration: "1-365 ngày",
    coverage: "500 triệu VND",
    rating: 4.6,
    reviewCount: 234,
    features: [
      "Bảo hiểm cho tối đa 50 nhân viên",
      "Bảo hiểm y tế toàn diện",
      "Bảo hiểm tai nạn",
      "Bảo hiểm hành lý",
      "Hỗ trợ khẩn cấp 24/7",
      "Bảo hiểm trách nhiệm dân sự",
      "Bảo hiểm thiết bị công việc"
    ],
    exclusions: [
      "Thể thao mạo hiểm",
      "Chiến tranh, bạo động",
      "Hành vi vi phạm pháp luật"
    ],
    claimProcess: "Xử lý ưu tiên trong 2-5 ngày",
    maxAge: 65,
    destinations: ["Toàn thế giới"],
    preExistingConditions: true
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const duration = searchParams.get('duration');
    const priceRange = searchParams.get('priceRange');
    const coverage = searchParams.get('coverage');

    let filteredInsurance = [...insuranceData];

    // Apply filters
    if (type && type !== 'all') {
      filteredInsurance = filteredInsurance.filter(insurance => 
        insurance.type === type
      );
    }

    if (duration && duration !== 'all') {
      filteredInsurance = filteredInsurance.filter(insurance => {
        const days = parseInt(insurance.duration.split(' ')[0]);
        switch (duration) {
          case '1-7': return days >= 1 && days <= 7;
          case '8-15': return days >= 8 && days <= 15;
          case '16-30': return days >= 16 && days <= 30;
          case '31-90': return days >= 31 && days <= 90;
          case '90+': return days > 90;
          default: return true;
        }
      });
    }

    if (priceRange && priceRange !== 'all') {
      filteredInsurance = filteredInsurance.filter(insurance => {
        const price = insurance.price;
        switch (priceRange) {
          case 'budget': return price < 200000;
          case 'mid': return price >= 200000 && price <= 500000;
          case 'high': return price > 500000 && price <= 1000000;
          case 'luxury': return price > 1000000;
          default: return true;
        }
      });
    }

    if (coverage && coverage !== 'all') {
      filteredInsurance = filteredInsurance.filter(insurance => {
        const coverageValue = parseInt(insurance.coverage.split(' ')[0]);
        switch (coverage) {
          case '50M': return coverageValue <= 50;
          case '100M': return coverageValue > 50 && coverageValue <= 100;
          case '200M': return coverageValue > 100 && coverageValue <= 200;
          case '500M+': return coverageValue > 200;
          default: return true;
        }
      });
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: filteredInsurance,
      total: filteredInsurance.length,
      filters: {
        type,
        duration,
        priceRange,
        coverage
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Không thể lấy dữ liệu bảo hiểm'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate creating a new insurance policy
    const newPolicy = {
      id: Date.now(),
      insuranceId: body.insuranceId,
      userId: body.userId,
      startDate: body.startDate,
      endDate: body.endDate,
      travelers: body.travelers,
      destinations: body.destinations,
      totalPrice: body.totalPrice,
      status: 'active',
      policyNumber: `IN${Date.now().toString().slice(-8)}`,
      createdAt: new Date().toISOString()
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));

    return NextResponse.json({
      success: true,
      message: 'Mua bảo hiểm thành công',
      data: newPolicy
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Bad request',
        message: 'Dữ liệu mua bảo hiểm không hợp lệ'
      },
      { status: 400 }
    );
  }
} 
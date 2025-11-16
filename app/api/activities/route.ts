import { NextResponse } from 'next/server';

// Mock activities data - in real app, this would come from a database
const activitiesData = [
  {
    id: 1,
    title: "Lặn ngắm san hô Phú Quốc",
    subtitle: "Khám phá thế giới dưới đáy biển với hướng dẫn viên chuyên nghiệp",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
    category: "Thể thao biển",
    location: "Phú Quốc, Kiên Giang",
    duration: "3-4 giờ",
    groupSize: "2-8 người",
    price: 850000,
    originalPrice: 1200000,
    discount: "29%",
    rating: 4.8,
    reviewCount: 567,
    difficulty: "Trung bình",
    ageRequirement: "12+",
    included: ["Thiết bị lặn", "Hướng dẫn viên", "Bảo hiểm", "Ảnh dưới nước"],
    highlights: [
      "Lặn tại 3 điểm san hô đẹp nhất",
      "Hướng dẫn viên PADI certified",
      "Thiết bị chất lượng cao",
      "Ảnh kỷ niệm miễn phí"
    ],
    schedule: "08:00 - 12:00 hàng ngày",
    bestTime: "Tháng 11 - Tháng 4",
    availableDates: ["2024-02-15", "2024-02-16", "2024-02-17"]
  },
  {
    id: 2,
    title: "Leo núi Fansipan - Nóc nhà Đông Dương",
    subtitle: "Chinh phục đỉnh núi cao nhất Việt Nam với view tuyệt đẹp",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
    category: "Leo núi",
    location: "Sapa, Lào Cai",
    duration: "2 ngày 1 đêm",
    groupSize: "4-12 người",
    price: 1800000,
    originalPrice: 2500000,
    discount: "28%",
    rating: 4.9,
    reviewCount: 892,
    difficulty: "Khó",
    ageRequirement: "16+",
    included: ["Hướng dẫn viên", "Thiết bị leo núi", "Ăn uống", "Homestay", "Bảo hiểm"],
    highlights: [
      "Leo núi Fansipan 3.143m",
      "Ngắm bình minh trên đỉnh núi",
      "Khám phá văn hóa dân tộc",
      "View ruộng bậc thang tuyệt đẹp"
    ],
    schedule: "Thứ 7 - Chủ nhật hàng tuần",
    bestTime: "Tháng 9 - Tháng 11",
    availableDates: ["2024-02-17", "2024-02-18", "2024-02-24"]
  },
  {
    id: 3,
    title: "Khám phá phố cổ Hội An về đêm",
    subtitle: "Trải nghiệm văn hóa truyền thống với đèn lồng và ẩm thực địa phương",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    category: "Văn hóa",
    location: "Hội An, Quảng Nam",
    duration: "4-5 giờ",
    groupSize: "2-15 người",
    price: 450000,
    originalPrice: 650000,
    discount: "31%",
    rating: 4.7,
    reviewCount: 1234,
    difficulty: "Dễ",
    ageRequirement: "Mọi lứa tuổi",
    included: ["Hướng dẫn viên", "Vé tham quan", "Thả đèn hoa đăng", "Ăn tối địa phương"],
    highlights: [
      "Tham quan phố cổ về đêm",
      "Thả đèn hoa đăng sông Hoài",
      "Thưởng thức ẩm thực địa phương",
      "Chụp ảnh với trang phục truyền thống"
    ],
    schedule: "18:00 - 22:00 hàng ngày",
    bestTime: "Tháng 2 - Tháng 8",
    availableDates: ["2024-02-15", "2024-02-16", "2024-02-17", "2024-02-18"]
  },
  {
    id: 4,
    title: "Chèo thuyền kayak vịnh Hạ Long",
    subtitle: "Khám phá vịnh Hạ Long từ góc nhìn mới với thuyền kayak",
    image: "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop",
    category: "Thể thao biển",
    location: "Vịnh Hạ Long, Quảng Ninh",
    duration: "6-8 giờ",
    groupSize: "2-10 người",
    price: 1200000,
    originalPrice: 1800000,
    discount: "33%",
    rating: 4.6,
    reviewCount: 456,
    difficulty: "Trung bình",
    ageRequirement: "14+",
    included: ["Thuyền kayak", "Hướng dẫn viên", "Ăn trưa", "Bảo hiểm", "Vận chuyển"],
    highlights: [
      "Chèo thuyền qua hang động",
      "Khám phá vịnh trong làng",
      "Tắm biển tại bãi biển hoang sơ",
      "Ngắm hoàng hôn trên vịnh"
    ],
    schedule: "08:00 - 16:00 hàng ngày",
    bestTime: "Tháng 3 - Tháng 11",
    availableDates: ["2024-02-15", "2024-02-16", "2024-02-17"]
  },
  {
    id: 5,
    title: "Cooking class ẩm thực Việt Nam",
    subtitle: "Học nấu các món ăn truyền thống Việt Nam với đầu bếp chuyên nghiệp",
    image: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop",
    category: "Ẩm thực",
    location: "Hà Nội",
    duration: "3-4 giờ",
    groupSize: "2-8 người",
    price: 650000,
    originalPrice: 900000,
    discount: "28%",
    rating: 4.8,
    reviewCount: 789,
    difficulty: "Dễ",
    ageRequirement: "Mọi lứa tuổi",
    included: ["Nguyên liệu", "Hướng dẫn viên", "Tài liệu hướng dẫn", "Bữa ăn", "Chứng chỉ"],
    highlights: [
      "Học nấu 4 món ăn truyền thống",
      "Tham quan chợ địa phương",
      "Hướng dẫn viên tiếng Anh",
      "Nhận chứng chỉ hoàn thành"
    ],
    schedule: "09:00 - 13:00 hàng ngày",
    bestTime: "Quanh năm",
    availableDates: ["2024-02-15", "2024-02-16", "2024-02-17", "2024-02-18"]
  }
];

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const location = searchParams.get('location');
    const priceRange = searchParams.get('priceRange');
    const difficulty = searchParams.get('difficulty');

    let filteredActivities = [...activitiesData];

    // Apply filters
    if (category && category !== 'all') {
      filteredActivities = filteredActivities.filter(activity => 
        activity.category === category
      );
    }

    if (location && location !== 'all') {
      filteredActivities = filteredActivities.filter(activity => 
        activity.location.includes(location)
      );
    }

    if (priceRange && priceRange !== 'all') {
      filteredActivities = filteredActivities.filter(activity => {
        const price = activity.price;
        switch (priceRange) {
          case 'budget': return price < 500000;
          case 'mid': return price >= 500000 && price <= 1500000;
          case 'high': return price > 1500000 && price <= 3000000;
          case 'luxury': return price > 3000000;
          default: return true;
        }
      });
    }

    if (difficulty && difficulty !== 'all') {
      filteredActivities = filteredActivities.filter(activity => 
        activity.difficulty === difficulty
      );
    }

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100));

    return NextResponse.json({
      success: true,
      data: filteredActivities,
      total: filteredActivities.length,
      filters: {
        category,
        location,
        priceRange,
        difficulty
      }
    });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error',
        message: 'Không thể lấy dữ liệu hoạt động'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Simulate creating a new activity booking
    const newBooking = {
      id: Date.now(),
      activityId: body.activityId,
      userId: body.userId,
      participants: body.participants,
      selectedDate: body.selectedDate,
      totalPrice: body.totalPrice,
      status: 'confirmed',
      bookingCode: `AC${Date.now().toString().slice(-6)}`,
      createdAt: new Date().toISOString()
    };

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));

    return NextResponse.json({
      success: true,
      message: 'Đặt hoạt động thành công',
      data: newBooking
    }, { status: 201 });

  } catch (error) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'Bad request',
        message: 'Dữ liệu đặt hoạt động không hợp lệ'
      },
      { status: 400 }
    );
  }
} 
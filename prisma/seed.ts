import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seeding...')

  // ================== DESTINATIONS ==================
  const destinations = await prisma.destination.createMany({
    data: [
      {
        city: 'Phú Quốc',
        country: 'Việt Nam',
        province: 'Kiên Giang',
        description: 'Đảo ngọc Phú Quốc - thiên đường du lịch với những bãi biển đẹp, hải sản tươi ngon.',
        image: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&h=600&fit=crop',
        rating: 4.8,
        reviewCount: 15420,
        hotels: 156,
        fromPrice: 1200000,
        toPrice: 8000000,
        bestTime: 'Tháng 11 - Tháng 4',
        category: 'Biển đảo',
        popularity: 'Rất cao',
        slug: 'phu-quoc',
        temperature: '25-32°C',
        condition: 'Nắng đẹp, ít mưa',
        humidity: '70-85%',
        rainfall: 'Thấp',
        flightTime: '45 phút từ TP.HCM',
        ferryTime: '2.5 giờ từ Rạch Giá',
        carTime: 'Không thể đi xe'
      },
      {
        city: 'Đà Nẵng',
        country: 'Việt Nam',
        province: 'Đà Nẵng',
        description: 'Thành phố đáng sống nhất Việt Nam với bãi biển Mỹ Khê tuyệt đẹp.',
        image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1200&h=600&fit=crop',
        rating: 4.7,
        reviewCount: 12890,
        hotels: 234,
        fromPrice: 800000,
        toPrice: 6000000,
        bestTime: 'Tháng 2 - Tháng 8',
        category: 'Biển',
        popularity: 'Cao',
        slug: 'da-nang',
        temperature: '22-35°C',
        condition: 'Nắng đẹp, mưa vừa',
        humidity: '65-80%',
        rainfall: 'Trung bình',
        flightTime: '1 giờ từ Hà Nội',
        ferryTime: '2.5 giờ từ Huế',
        carTime: '3 giờ từ Huế'
      },
      {
        city: 'Nha Trang',
        country: 'Việt Nam',
        province: 'Khánh Hòa',
        description: 'Thành phố biển xinh đẹp với nhiều hòn đảo hoang sơ.',
        image: 'https://images.unsplash.com/photo-1526481280691-19585f32e7f7?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1526481280691-19585f32e7f7?w=1200&h=600&fit=crop',
        rating: 4.6,
        reviewCount: 9876,
        hotels: 189,
        fromPrice: 600000,
        toPrice: 4500000,
        bestTime: 'Tháng 1 - Tháng 8',
        category: 'Biển',
        popularity: 'Cao',
        slug: 'nha-trang',
        temperature: '24-33°C',
        condition: 'Nắng đẹp, mưa ít',
        humidity: '70-85%',
        rainfall: 'Thấp',
        flightTime: '45 phút từ TP.HCM',
        ferryTime: '1 giờ từ Nha Trang',
        carTime: '6 giờ từ TP.HCM'
      },
      {
        city: 'Sapa',
        country: 'Việt Nam',
        province: 'Lào Cai',
        description: 'Thị trấn miền núi cao với ruộng bậc thang tuyệt đẹp.',
        image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=1200&h=600&fit=crop',
        rating: 4.9,
        reviewCount: 11234,
        hotels: 145,
        fromPrice: 500000,
        toPrice: 3500000,
        bestTime: 'Tháng 9 - Tháng 11',
        category: 'Núi',
        popularity: 'Rất cao',
        slug: 'sapa',
        temperature: '15-25°C',
        condition: 'Mát mẻ, sương mù',
        humidity: '80-90%',
        rainfall: 'Trung bình',
        flightTime: 'Không có sân bay',
        ferryTime: 'Không có phà',
        carTime: '6 giờ từ Hà Nội'
      },
      {
        city: 'Hà Nội',
        country: 'Việt Nam',
        province: 'Hà Nội',
        description: 'Thủ đô nghìn năm văn hiến với Hồ Gươm, phố cổ, ẩm thực đặc sắc.',
        image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=1200&h=600&fit=crop',
        rating: 4.7,
        reviewCount: 20000,
        hotels: 350,
        fromPrice: 700000,
        toPrice: 7000000,
        bestTime: 'Tháng 9 - Tháng 4',
        category: 'Thành phố',
        popularity: 'Rất cao',
        slug: 'ha-noi',
        temperature: '15-33°C',
        condition: 'Nắng, mưa theo mùa',
        humidity: '70-90%',
        rainfall: 'Trung bình',
        flightTime: 'Có sân bay quốc tế Nội Bài',
        ferryTime: 'Không có',
        carTime: 'N/A'
      },
      {
        city: 'Hội An',
        country: 'Việt Nam',
        province: 'Quảng Nam',
        description: 'Phố cổ UNESCO với đèn lồng, chùa Cầu, ẩm thực đường phố.',
        image: 'https://images.unsplash.com/photo-1549887534-3db1bd59dcca?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1549887534-3db1bd59dcca?w=1200&h=600&fit=crop',
        rating: 4.8,
        reviewCount: 15000,
        hotels: 200,
        fromPrice: 500000,
        toPrice: 4000000,
        bestTime: 'Tháng 2 - Tháng 9',
        category: 'Di sản',
        popularity: 'Rất cao',
        slug: 'hoi-an',
        temperature: '20-34°C',
        condition: 'Khí hậu ôn hòa',
        humidity: '70-85%',
        rainfall: 'Trung bình',
        flightTime: '30 phút từ sân bay Đà Nẵng',
        ferryTime: 'Không có',
        carTime: '30 phút từ Đà Nẵng'
      },
      {
        city: 'Hạ Long',
        country: 'Việt Nam',
        province: 'Quảng Ninh',
        description: 'Kỳ quan thiên nhiên thế giới - vịnh Hạ Long.',
        image: 'https://images.unsplash.com/photo-1589391886645-d51941c10f6c?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1589391886645-d51941c10f6c?w=1200&h=600&fit=crop',
        rating: 4.9,
        reviewCount: 17000,
        hotels: 220,
        fromPrice: 1000000,
        toPrice: 6000000,
        bestTime: 'Tháng 3 - Tháng 6',
        category: 'Biển',
        popularity: 'Rất cao',
        slug: 'ha-long',
        temperature: '22-33°C',
        condition: 'Nắng, có mưa',
        humidity: '70-85%',
        rainfall: 'Trung bình',
        flightTime: '1 giờ từ Hà Nội',
        ferryTime: 'Có tàu du lịch',
        carTime: '2.5 giờ từ Hà Nội'
      },
      {
        city: 'Đà Lạt',
        country: 'Việt Nam',
        province: 'Lâm Đồng',
        description: 'Thành phố ngàn hoa với khí hậu mát mẻ quanh năm.',
        image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=1200&h=600&fit=crop',
        rating: 4.8,
        reviewCount: 14000,
        hotels: 180,
        fromPrice: 600000,
        toPrice: 5000000,
        bestTime: 'Quanh năm',
        category: 'Núi',
        popularity: 'Rất cao',
        slug: 'da-lat',
        temperature: '15-25°C',
        condition: 'Mát, sương mù',
        humidity: '70-85%',
        rainfall: 'Trung bình',
        flightTime: '1 giờ từ TP.HCM',
        ferryTime: 'Không có',
        carTime: '7 giờ từ TP.HCM'
      },
      {
        city: 'Huế',
        country: 'Việt Nam',
        province: 'Thừa Thiên - Huế',
        description: 'Cố đô Huế với Đại Nội, chùa Thiên Mụ, lăng tẩm triều Nguyễn.',
        image: 'https://images.unsplash.com/photo-1622034683782-6e79fba399a7?w=800&h=600&fit=crop',
        heroImage: 'https://images.unsplash.com/photo-1622034683782-6e79fba399a7?w=1200&h=600&fit=crop',
        rating: 4.7,
        reviewCount: 10000,
        hotels: 160,
        fromPrice: 500000,
        toPrice: 4000000,
        bestTime: 'Tháng 1 - Tháng 8',
        category: 'Văn hóa',
        popularity: 'Cao',
        slug: 'hue',
        temperature: '20-35°C',
        condition: 'Nắng nóng, có mưa',
        humidity: '70-90%',
        rainfall: 'Cao',
        flightTime: '1 giờ từ Hà Nội',
        ferryTime: 'Không có',
        carTime: '2 giờ từ Đà Nẵng'
      }
    ]
  })

  const allDestinations = await prisma.destination.findMany()

  // ================== HOTELS ==================
  for (const dest of allDestinations) {
    await prisma.hotel.createMany({
      data: [
        {
          name: `Hotel Luxury ${dest.city}`,
          image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&h=600&fit=crop',
          location: `${dest.city}, ${dest.province}`,
          rating: 4.5,
          reviewCount: 1000,
          price: 2500000,
          originalPrice: 4000000,
          discount: '35%',
          description: `Khách sạn sang trọng tại ${dest.city}`,
          destinationId: dest.id
        },
        {
          name: `Resort Paradise ${dest.city}`,
          image: 'https://images.unsplash.com/photo-1501117716987-c8e86b5356df?w=800&h=600&fit=crop',
          location: `${dest.city}, ${dest.province}`,
          rating: 4.7,
          reviewCount: 1500,
          price: 3200000,
          originalPrice: 5000000,
          discount: '30%',
          description: `Resort cao cấp view đẹp tại ${dest.city}`,
          destinationId: dest.id
        }
      ]
    })
  }

  // ================== FLIGHTS ==================
  await prisma.flight.createMany({
    data: [
      {
        airline: 'Vietnam Airlines',
        flightNumber: 'VN123',
        departure: 'Hà Nội (HAN)',
        arrival: 'TP.HCM (SGN)',
        departureTime: '08:00',
        arrivalTime: '10:15',
        duration: '2h 15m',
        price: 1200000,
        originalPrice: 1800000,
        discount: '33%',
        stops: 'Bay thẳng',
        aircraft: 'Airbus A350',
        class: 'Economy',
        availableSeats: 45,
        departureDate: '2025-09-01'
      },
      {
        airline: 'VietJet Air',
        flightNumber: 'VJ456',
        departure: 'Hà Nội (HAN)',
        arrival: 'Đà Nẵng (DAD)',
        departureTime: '14:30',
        arrivalTime: '15:45',
        duration: '1h 15m',
        price: 599000,
        originalPrice: 1200000,
        discount: '50%',
        stops: 'Bay thẳng',
        aircraft: 'Airbus A320',
        class: 'Economy',
        availableSeats: 23,
        departureDate: '2025-09-05'
      },
      {
        airline: 'Bamboo Airways',
        flightNumber: 'QH789',
        departure: 'TP.HCM (SGN)',
        arrival: 'Phú Quốc (PQC)',
        departureTime: '09:00',
        arrivalTime: '10:00',
        duration: '1h',
        price: 800000,
        originalPrice: 1200000,
        discount: '33%',
        stops: 'Bay thẳng',
        aircraft: 'Embraer 190',
        class: 'Economy',
        availableSeats: 30,
        departureDate: '2025-09-10'
      },
      {
        airline: 'Vietnam Airlines',
        flightNumber: 'VN101',
        departure: 'Đà Nẵng (DAD)',
        arrival: 'Đà Lạt (DLI)',
        departureTime: '07:30',
        arrivalTime: '09:00',
        duration: '1h30m',
        price: 1200000,
        originalPrice: 1600000,
        discount: '25%',
        stops: 'Bay thẳng',
        aircraft: 'ATR72',
        class: 'Economy',
        availableSeats: 20,
        departureDate: '2025-09-12'
      }
    ]
  })

  // ================== TOUR PACKAGES ==================
  for (const dest of allDestinations.slice(0, 10)) {
    const package1 = await prisma.tourPackage.create({
      data: {
        title: `Combo ${dest.city} 3N2Đ`,
        subtitle: `Khám phá ${dest.city} với khách sạn + vé máy bay + tour`,
        description: `Hành trình khám phá ${dest.city} đầy thú vị với những trải nghiệm độc đáo. Từ cảnh sắc thiên nhiên hùng vĩ đến văn hóa bản địa đặc sắc, tour này sẽ mang đến cho bạn những kỷ niệm khó quên.`,
        image: 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1200&h=800&fit=crop',
        badge: 'HOT',
        discount: 'Giảm 30%',
        originalPrice: 4000000,
        price: 2800000,
        duration: '3 ngày 2 đêm',
        groupSize: '2-10 người',
        departure: 'Hà Nội',
        destinationId: dest.id,
        rating: 4.7,
        reviewCount: 200,
        validUntil: '2025-12-31',
        category: 'Combo'
      }
    })

    // Create highlights
    await prisma.packageHighlight.createMany({
      data: [
        { packageId: package1.id, description: 'Khám phá những điểm đến nổi tiếng nhất' },
        { packageId: package1.id, description: 'Thưởng thức ẩm thực địa phương đặc sắc' },
        { packageId: package1.id, description: 'Trải nghiệm văn hóa bản địa chân thực' },
        { packageId: package1.id, description: 'Nghỉ ngơi tại khách sạn chất lượng cao' },
        { packageId: package1.id, description: 'Hướng dẫn viên chuyên nghiệp, nhiệt tình' }
      ]
    })

    // Create itinerary
    await prisma.packageItinerary.createMany({
      data: [
        { 
          packageId: package1.id, 
          day: '1', 
          content: 'Khởi hành từ Hà Nội → Đến điểm đến → Check-in khách sạn → Ăn tối → Nghỉ đêm',
          startTime: '07:00',
          transport: 'Xe ô tô',
          meals: 'Ăn tối'
        },
        { 
          packageId: package1.id, 
          day: '2', 
          content: 'Ăn sáng → Tham quan các điểm du lịch chính → Ăn trưa → Tiếp tục khám phá → Ăn tối',
          startTime: '08:00',
          transport: 'Xe ô tô + Đi bộ',
          meals: 'Ăn sáng, trưa, tối'
        },
        { 
          packageId: package1.id, 
          day: '3', 
          content: 'Ăn sáng → Mua sắm → Ăn trưa → Khởi hành về Hà Nội',
          startTime: '07:30',
          transport: 'Xe ô tô',
          meals: 'Ăn sáng, trưa'
        }
      ]
    })

    // Create included/not included
    await prisma.packageIncluded.createMany({
      data: [
        { packageId: package1.id, item: 'Vé máy bay khứ hồi' },
        { packageId: package1.id, item: 'Khách sạn 3-4 sao' },
        { packageId: package1.id, item: 'Ăn uống theo chương trình' },
        { packageId: package1.id, item: 'Xe đưa đón' },
        { packageId: package1.id, item: 'Hướng dẫn viên' },
        { packageId: package1.id, item: 'Bảo hiểm du lịch' }
      ]
    })

    await prisma.packageNotIncluded.createMany({
      data: [
        { packageId: package1.id, item: 'Chi phí cá nhân' },
        { packageId: package1.id, item: 'Đồ uống' },
        { packageId: package1.id, item: 'Tiền tip' },
        { packageId: package1.id, item: 'Vé tham quan ngoài chương trình' }
      ]
    })

    // Create sections for rich content
    await prisma.tourPackageSection.createMany({
      data: [
        {
          packageId: package1.id,
          title: 'Văn hóa & Ẩm thực',
          content: `Khám phá văn hóa độc đáo của ${dest.city} với những phong tục tập quán truyền thống. Thưởng thức các món ăn đặc sản địa phương được chế biến từ những nguyên liệu tươi ngon nhất.`,
          photos: ['https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop'],
          position: 1
        },
        {
          packageId: package1.id,
          title: 'Trải nghiệm nổi bật',
          content: `Tắm biển tại những bãi biển đẹp nhất, chèo kayak khám phá vịnh, ngắm hoàng hôn lãng mạn, khám phá chợ đêm sôi động và nhiều hoạt động thú vị khác.`,
          photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
          position: 2
        }
      ]
    })

    // Create stops with rich content
    await prisma.tourPackageStop.createMany({
      data: [
        {
          packageId: package1.id,
          title: 'Bãi biển chính',
          description: 'Bãi biển đẹp với cát trắng mịn, nước biển trong xanh, lý tưởng cho việc tắm biển và thư giãn.',
          guide: 'Nên tắm biển vào sáng sớm hoặc chiều muộn để tránh nắng gắt',
          address: 'Bãi biển chính, ' + dest.city,
          latitude: 21.0285,
          longitude: 105.8542,
          photos: ['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop'],
          tips: ['Mang theo kem chống nắng', 'Chuẩn bị đồ tắm', 'Không bơi quá xa bờ'],
          bestTime: 'Sáng sớm hoặc chiều muộn',
          mapThumb: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&h=200&fit=crop',
          position: 1
        },
        {
          packageId: package1.id,
          title: 'Chợ đêm',
          description: 'Chợ đêm sôi động với nhiều món ăn đường phố, đồ lưu niệm và không khí vui nhộn.',
          guide: 'Nên đi vào buổi tối từ 18:00-22:00 để có trải nghiệm tốt nhất',
          address: 'Chợ đêm, ' + dest.city,
          latitude: 21.0285,
          longitude: 105.8542,
          photos: ['https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=600&fit=crop'],
          tips: ['Mặc cả khi mua đồ', 'Thử các món ăn địa phương', 'Mang tiền mặt'],
          bestTime: 'Buổi tối 18:00-22:00',
          mapThumb: 'https://images.unsplash.com/photo-1524661135-423995f22d0b?w=200&h=200&fit=crop',
          position: 2
        }
      ]
    })
  }

     // ================== ACTIVITIES ==================
  const activitiesData = [
    { title: 'Lặn ngắm san hô', category: 'Biển', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' },
    { title: 'Đi thuyền kayak', category: 'Biển', image: 'https://images.unsplash.com/photo-1526483360412-f4dbaf036963?w=800&h=600&fit=crop' },
    { title: 'Trekking Fansipan', category: 'Leo núi', image: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800&h=600&fit=crop' },
    { title: 'Khám phá phố cổ', category: 'Văn hóa', image: 'https://images.unsplash.com/photo-1549887534-3db1bd59dcca?w=800&h=600&fit=crop' },
    { title: 'Chèo SUP', category: 'Thể thao nước', image: 'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?w=800&h=600&fit=crop' },
    { title: 'Tour ẩm thực đường phố', category: 'Ẩm thực', image: 'https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&h=600&fit=crop' },
    { title: 'Khám phá hang động', category: 'Phiêu lưu', image: 'https://images.unsplash.com/photo-1526481280691-19585f32e7f7?w=800&h=600&fit=crop' },
    { title: 'Ngắm bình minh biển', category: 'Relax', image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&h=600&fit=crop' },
    { title: 'Cắm trại trên đồi', category: 'Camping', image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800&h=600&fit=crop' },
    { title: 'Khám phá chợ nổi', category: 'Văn hóa', image: 'https://images.unsplash.com/photo-1503220317375-aaad61436b1b?w=800&h=600&fit=crop' },
  ]

  for (const activity of activitiesData) {
    await prisma.activity.create({
      data: {
        title: activity.title,
        subtitle: `${activity.title} - Trải nghiệm tuyệt vời`,
        image: activity.image,
        category: activity.category,
        difficulty: 'Trung bình',
        ageRequirement: '12+',
        schedule: 'Hàng ngày',
        bestTime: 'Quanh năm',
        location: 'Việt Nam',
        price: Math.floor(200000 + Math.random() * 500000),
        originalPrice: Math.floor(500000 + Math.random() * 800000),
        discount: '10%',
        duration: `${1 + Math.floor(Math.random() * 3)} giờ`,
        groupSize: '1-10 người',
        rating: Math.round((3.5 + Math.random() * 1.5) * 10) / 10,
        reviewCount: Math.floor(50 + Math.random() * 300),
      }
    })
  }

  // ================== INSURANCE ==================
  const insuranceData = [
    {
      name: 'Bảo hiểm cơ bản',
      coverage: 'Tai nạn, y tế cơ bản',
      price: 200000,
      provider: 'BaoViet',
      image: 'https://images.unsplash.com/photo-1588776814546-ec6f89d9cf1d?w=800&h=600&fit=crop'
    },
    {
      name: 'Bảo hiểm nâng cao',
      coverage: 'Tai nạn, y tế, hành lý',
      price: 500000,
      provider: 'AIA',
      image: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=600&fit=crop'
    },
    {
      name: 'Bảo hiểm VIP',
      coverage: 'Toàn diện: tai nạn, y tế, hành lý, hoãn chuyến',
      price: 1000000,
      provider: 'Prudential',
      image: 'https://images.unsplash.com/photo-1549921296-3a6b5a0c2c8d?w=800&h=600&fit=crop'
    },
  ]

  for (const ins of insuranceData) {
    await prisma.insurance.create({
      data: {
        title: ins.name,
        subtitle: ins.coverage,
        image: ins.image,
        type: ins.provider,
        price: ins.price,
        duration: '1-30 ngày',
        coverage: ins.coverage,
        rating: 4.5,
        reviewCount: 0,
        claimProcess: 'Xử lý trong 7-14 ngày',
        maxAge: 75,
        preExistingConditions: false
      }
    })
  }

  // ================== USERS ==================
  const usersData = [
    { name: 'Nguyen Van A', email: 'a@example.com', password: '123456', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
    { name: 'Tran Thi B', email: 'b@example.com', password: '123456', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
    { name: 'Le Van C', email: 'c@example.com', password: '123456', avatar: 'https://randomuser.me/api/portraits/men/65.jpg' },
    { name: 'Pham Thi D', email: 'd@example.com', password: '123456', avatar: 'https://randomuser.me/api/portraits/women/12.jpg' },
    { name: 'Hoang Van E', email: 'e@example.com', password: '123456', avatar: 'https://randomuser.me/api/portraits/men/78.jpg' },
  ]

  for (const user of usersData) {
    await prisma.user.create({ data: user })
  }

  console.log('✅ Seeding completed successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
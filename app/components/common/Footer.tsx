import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Linkedin,
  Smartphone,
  CreditCard,
  Award,
  Shield,
  Star,
  Users,
  Clock,
  Headphones,
  Download,
  ExternalLink,
  Heart,
  Plane,
  Hotel,
  Car,
  Mountain,
  Calendar,
  Gift,
} from "lucide-react";

export default function ModernFooter() {
  const footerData = {
    company: {
      name: "Traveloka Vietnam",
      slogan: "Your Journey, Our Passion",
      address: "Tầng 18, Tòa nhà Capital Place, 29 Liễu Giai, Ba Đình, Hà Nội",
      taxCode: "Mã số doanh nghiệp: 0109080056",
      license:
        "Giấy phép kinh doanh số 0109080056 do Sở Kế hoạch và Đầu tư Hà Nội cấp ngày 28/12/2018",
      phone: "1900 2083",
      email: "support@traveloka.com",
    },
    links: [
      {
        title: "Về Traveloka",
        icon: Globe,
        items: [
          { text: "Về chúng tôi", url: "/about", icon: Users },
          { text: "Trung tâm trợ giúp", url: "/help", icon: Headphones },
          { text: "Điều khoản sử dụng", url: "/terms", icon: Shield },
          { text: "Chính sách bảo mật", url: "/privacy", icon: Shield },
          { text: "Tuyển dụng", url: "/careers", icon: Heart },
        ],
      },
      {
        title: "Sản phẩm",
        icon: Gift,
        items: [
          { text: "Khách sạn", url: "/hotels", icon: Hotel },
          { text: "Vé máy bay", url: "/flights", icon: Plane },
          { text: "Combo tiết kiệm", url: "/packages", icon: Gift },
          { text: "Hoạt động & Vui chơi", url: "/activities", icon: Mountain },
          { text: "Thuê xe", url: "/car-rental", icon: Car },
        ],
      },
      {
        title: "Hỗ trợ khách hàng",
        icon: Headphones,
        items: [
          { text: "Hotline: 1900 2083", url: "tel:19002083", icon: Phone },
          {
            text: "Email hỗ trợ",
            url: "mailto:support@traveloka.com",
            icon: Mail,
          },
          { text: "Chat trực tuyến", url: "/chat", icon: Headphones },
          { text: "FAQ", url: "/faq", icon: Headphones },
          { text: "Hướng dẫn đặt chỗ", url: "/guide", icon: Calendar },
        ],
      },
    ],
    socialMedia: [
      {
        name: "Facebook",
        icon: Facebook,
        url: "https://facebook.com/traveloka",
        color: "hover:text-blue-600",
      },
      {
        name: "Instagram",
        icon: Instagram,
        url: "https://instagram.com/traveloka",
        color: "hover:text-pink-600",
      },
      {
        name: "Twitter",
        icon: Twitter,
        url: "https://twitter.com/traveloka",
        color: "hover:text-blue-400",
      },
      {
        name: "Youtube",
        icon: Youtube,
        url: "https://youtube.com/traveloka",
        color: "hover:text-red-600",
      },
      {
        name: "LinkedIn",
        icon: Linkedin,
        url: "https://linkedin.com/company/traveloka",
        color: "hover:text-blue-700",
      },
    ],
    apps: [
      {
        name: "App Store",
        url: "https://apps.apple.com/app/traveloka",
        logo: "🍎",
        subtitle: "Download on the",
      },
      {
        name: "Google Play",
        url: "https://play.google.com/store/apps/details?id=com.traveloka",
        logo: "📱",
        subtitle: "Get it on",
      },
      {
        name: "AppGallery",
        url: "https://appgallery.huawei.com",
        logo: "📲",
        subtitle: "Explore it on",
      },
    ],
    paymentMethods: [
      { name: "Visa", color: "bg-blue-600", text: "VISA" },
      { name: "Mastercard", color: "bg-red-500", text: "MC" },
      { name: "JCB", color: "bg-blue-800", text: "JCB" },
      { name: "American Express", color: "bg-green-600", text: "AMEX" },
      { name: "PayPal", color: "bg-blue-500", text: "PP" },
      { name: "MoMo", color: "bg-pink-500", text: "MoMo" },
      { name: "ZaloPay", color: "bg-blue-400", text: "ZP" },
    ],
    awards: [
      {
        name: "Best Travel App 2023",
        icon: Award,
        color: "text-yellow-500",
      },
      {
        name: "Top Brand 2022",
        icon: Star,
        color: "text-blue-500",
      },
      {
        name: "Customer Choice Award",
        icon: Heart,
        color: "text-red-500",
      },
    ],
    stats: [
      { label: "Khách hàng hài lòng", value: "10M+", icon: Users },
      { label: "Đối tác toàn cầu", value: "50K+", icon: Globe },
      { label: "Hỗ trợ 24/7", value: "24/7", icon: Clock },
      { label: "Quốc gia phục vụ", value: "100+", icon: MapPin },
    ],
  };

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-gray-900 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-64 h-64 bg-blue-400 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-400 rounded-full filter blur-3xl"></div>
      </div>

      <div className="relative z-10">
        {/* Stats Section */}
        <div className="border-b border-white/10">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              {footerData.stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div key={index} className="group">
                    <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 transform hover:scale-105">
                      <Icon className="w-8 h-8 mx-auto mb-4 text-blue-400 group-hover:text-blue-300 transition-colors" />
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {stat.value}
                      </div>
                      <div className="text-gray-300 text-sm">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        {/* Mini Map Section */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-12">
            <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              Bản đồ Thanh Hoá
            </h4>
            <div className="rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d598934.8881745646!2d105.22411824999999!3d19.806692649999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31366f28a46d8db1%3A0xc5bfa59cc9d2e0e5!2zVGhhbmggSMOyYQ!5e0!3m2!1svi!2s!4v1692765687749!5m2!1svi!2s"
                width="100%"
                height="250"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="mb-8">
                <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
                  Traveloka
                </h2>
                <p className="text-gray-300 italic">
                  {footerData.company.slogan}
                </p>
              </div>

              <div className="space-y-4 mb-8">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {footerData.company.address}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-green-400" />
                  <a
                    href={`tel:${footerData.company.phone}`}
                    className="text-gray-300 hover:text-gray-900 transition-colors"
                  >
                    {footerData.company.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-red-400" />
                  <a
                    href={`mailto:${footerData.company.email}`}
                    className="text-gray-300 hover:text-gray-900 transition-colors"
                  >
                    {footerData.company.email}
                  </a>
                </div>
              </div>

              <div className="text-xs text-gray-900 space-y-1">
                <p>{footerData.company.taxCode}</p>
                <p className="leading-relaxed">{footerData.company.license}</p>
              </div>
            </div>

            {/* Footer Links */}
            {footerData.links.map((section, index) => {
              const SectionIcon = section.icon;
              return (
                <div key={index}>
                  <div className="flex items-center gap-2 mb-6">
                    <SectionIcon className="w-5 h-5 text-blue-400" />
                    <h4 className="text-lg font-semibold text-gray-900">
                      {section.title}
                    </h4>
                  </div>
                  <ul className="space-y-3">
                    {section.items.map((item, itemIndex) => {
                      const ItemIcon = item.icon;
                      return (
                        <li key={itemIndex}>
                          <a
                            href={item.url}
                            className="flex items-center gap-2 text-gray-300 hover:text-gray-900 transition-all duration-300 group"
                          >
                            <ItemIcon className="w-4 h-4 text-gray-500 group-hover:text-blue-400 transition-colors" />
                            <span className="group-hover:translate-x-1 transition-transform">
                              {item.text}
                            </span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              );
            })}

            {/* Mobile Apps */}
            <div>
              <div className="flex items-center gap-2 mb-6">
                <Smartphone className="w-5 h-5 text-blue-400" />
                <h4 className="text-lg font-semibold text-gray-900">
                  Tải ứng dụng
                </h4>
              </div>
              <div className="space-y-4">
                {footerData.apps.map((app, index) => (
                  <a
                    key={index}
                    href={app.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-white/5 hover:bg-white/10 rounded-lg p-3 transition-all duration-300 group"
                  >
                    <div className="text-2xl">{app.logo}</div>
                    <div>
                      <div className="text-xs text-gray-900">
                        {app.subtitle}
                      </div>
                      <div className="text-gray-900 font-medium group-hover:text-blue-400 transition-colors">
                        {app.name}
                      </div>
                    </div>
                    <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-900 ml-auto" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Social Media & Payment Methods */}
        <div className="border-t border-white/10">
          <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Social Media */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Heart className="w-5 h-5 text-red-400" />
                  Kết nối với chúng tôi
                </h4>
                <div className="flex gap-4">
                  {footerData.socialMedia.map((social, index) => {
                    const Icon = social.icon;
                    return (
                      <a
                        key={index}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`bg-white/10 hover:bg-white/20 p-3 rounded-full transition-all duration-300 transform hover:scale-110 ${social.color}`}
                      >
                        <Icon className="w-5 h-5" />
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* Payment Methods */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-green-400" />
                  Phương thức thanh toán
                </h4>
                <div className="grid grid-cols-4 gap-3">
                  {footerData.paymentMethods.map((method, index) => (
                    <div
                      key={index}
                      className={`${method.color} text-gray-900 text-xs font-bold px-3 py-2 rounded-md text-center hover:scale-105 transition-transform`}
                    >
                      {method.text}
                    </div>
                  ))}
                </div>
              </div>

              {/* Awards */}
              <div>
                <h4 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-400" />
                  Giải thưởng
                </h4>
                <div className="space-y-3">
                  {footerData.awards.map((award, index) => {
                    const Icon = award.icon;
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors"
                      >
                        <Icon className={`w-6 h-6 ${award.color}`} />
                        <span className="text-gray-300 text-sm">
                          {award.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="bg-black/20 border-t border-white/10">
          <div className="container mx-auto px-4 py-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="text-gray-900 text-sm text-center md:text-left">
                © {new Date().getFullYear()} Traveloka Vietnam. Bảo lưu mọi
                quyền.
              </div>
              <div className="flex items-center gap-6 text-sm text-gray-900">
                <a
                  href="/terms"
                  className="hover:text-gray-900 transition-colors"
                >
                  Điều khoản
                </a>
                <a
                  href="/privacy"
                  className="hover:text-gray-900 transition-colors"
                >
                  Bảo mật
                </a>
                <a
                  href="/cookies"
                  className="hover:text-gray-900 transition-colors"
                >
                  Cookie
                </a>
                <a
                  href="/sitemap"
                  className="hover:text-gray-900 transition-colors"
                >
                  Sitemap
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

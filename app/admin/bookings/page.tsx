"use client";

import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
} from "react";
import {
  Search,
  Filter,
  Eye,
  RefreshCcw,
  CheckCircle,
  XCircle,
  FileText,
  Info,
  PlusCircle,
  Calendar,
  Users,
  DollarSign,
  User,
  Package,
  ChevronLeft,
  ChevronRight,
  X,
  Clock,
  AlertCircle,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

// Types
type PackageBooking = {
  id: string;
  bookingCode: string;
  packageId: number;
  participants: number;
  totalPrice: number;
  status: string;
  selectedDate?: string | null;
  specialRequests?: string | null;
  contactInfo?: string | null;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
  package?: { id: number; title: string };
};

type BookingLog = {
  id: string;
  bookingId: string;
  bookingCode: string;
  action: string;
  message?: string;
  createdAt: string;
  userId?: string;
};

type ApiResponse<T> = {
  data: T;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
  };
};

// Custom UI Components (giữ nguyên các component UI từ code gốc)
const Card = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-white rounded-lg border border-gray-200 shadow-sm ${className}`}
  >
    {children}
  </div>
);

const CardHeader = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 pb-4 ${className}`}>{children}</div>;

const CardTitle = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <h3 className={`text-lg font-semibold ${className}`}>{children}</h3>;

const CardContent = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => <div className={`p-6 pt-0 ${className}`}>{children}</div>;

const Badge = ({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}) => {
  const baseStyles =
    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium";
  const variants = {
    default: "bg-blue-100 text-blue-800 border border-blue-200",
    secondary: "bg-gray-100 text-gray-800 border border-gray-200",
    outline: "border border-gray-300 text-gray-700",
  };

  return (
    <span className={`${baseStyles} ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({
  children,
  variant = "default",
  size = "default",
  className = "",
  ...props
}: {
  children: React.ReactNode;
  variant?: "default" | "secondary" | "outline" | "ghost" | "destructive";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  const baseStyles =
    "inline-flex items-center justify-center rounded-md font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2";

  const variants = {
    default: "bg-blue-600 text-white hover:bg-blue-700",
    secondary: "bg-gray-100 text-gray-900 hover:bg-gray-200",
    outline: "border border-gray-300 bg-white hover:bg-gray-50",
    ghost: "hover:bg-gray-100 hover:text-gray-900",
    destructive: "bg-red-600 text-white hover:bg-red-700",
  };

  const sizes = {
    default: "h-10 px-4 py-2",
    sm: "h-9 px-3 text-sm",
    lg: "h-11 px-8",
    icon: "h-10 w-10",
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({
  className = "",
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${className}`}
      {...props}
    />
  );
};

// Select Component (giữ nguyên)
const Select = ({
  value,
  onValueChange,
  children,
}: {
  value: string;
  onValueChange: (value: string) => void;
  children: React.ReactNode;
}) => {
  return (
    <div className="relative">
      {React.Children.map(children, (child) =>
        React.isValidElement(child) && child.type === SelectTrigger
          ? React.cloneElement(child, { value, onValueChange } as any)
          : child
      )}
    </div>
  );
};

const SelectTrigger = ({
  value,
  onValueChange,
  children,
  className = "",
}: {
  value: string;
  onValueChange: (value: string) => void;
  children?: React.ReactNode;
  className?: string;
}) => {
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <button
        ref={triggerRef}
        onClick={() => setOpen(!open)}
        className={`flex h-10 w-full items-center justify-between rounded-md border border-gray-300 bg-white px-3 py-2 text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
      >
        <span>{children || <SelectValue value={value} />}</span>
        <ChevronDown className="h-4 w-4 opacity-50" />
      </button>
      {open && (
        <SelectContent
          onClose={() => setOpen(false)}
          onValueChange={(newValue) => {
            onValueChange(newValue);
            setOpen(false);
          }}
          value={value}
        />
      )}
    </>
  );
};

const SelectValue = ({ value }: { value: string }) => {
  const options: Record<string, string> = {
    all: "Tất cả trạng thái",
    pending: "Chờ xác nhận",
    confirmed: "Đã xác nhận",
    completed: "Hoàn thành",
    cancelled: "Đã hủy",
    refunded: "Đã hoàn tiền",
  };

  return <span>{options[value] || value}</span>;
};

const SelectContent = ({
  onClose,
  onValueChange,
  value,
}: {
  onClose: () => void;
  onValueChange: (value: string) => void;
  value: string;
}) => {
  const options = [
    { value: "all", label: "Tất cả trạng thái" },
    { value: "pending", label: "Chờ xác nhận" },
    { value: "confirmed", label: "Đã xác nhận" },
    { value: "completed", label: "Hoàn thành" },
    { value: "cancelled", label: "Đã hủy" },
    { value: "refunded", label: "Đã hoàn tiền" },
  ];

  return (
    <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-auto">
      {options.map((option) => (
        <div
          key={option.value}
          onClick={() => onValueChange(option.value)}
          className={`cursor-pointer px-3 py-2 text-sm hover:bg-gray-100 ${
            value === option.value ? "bg-blue-50 text-blue-600" : ""
          }`}
        >
          {option.label}
        </div>
      ))}
    </div>
  );
};

const SelectItem = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  return <div data-value={value}>{children}</div>;
};

// Tabs Context (giữ nguyên)
type TabsContextType = {
  activeTab: string;
  setActiveTab: (tab: string) => void;
};

const TabsContext = createContext<TabsContextType | undefined>(undefined);

const useTabs = () => {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error("Tabs components must be used within a Tabs provider");
  }
  return context;
};

const Tabs = ({
  defaultValue,
  children,
  className = "",
}: {
  defaultValue: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

const TabsList = ({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`inline-flex h-10 items-center justify-center rounded-md bg-gray-100 p-1 ${className}`}
    >
      {children}
    </div>
  );
};

const TabsTrigger = ({
  value,
  children,
  className = "",
}: {
  value: string;
  children: React.ReactNode;
  className?: string;
}) => {
  const { activeTab, setActiveTab } = useTabs();
  const isActive = activeTab === value;

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-white transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
        isActive
          ? "bg-white text-gray-900 shadow-sm"
          : "text-gray-600 hover:text-gray-900"
      } ${className}`}
    >
      {children}
    </button>
  );
};

const TabsContent = ({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) => {
  const { activeTab } = useTabs();

  if (activeTab !== value) return null;

  return <div className="mt-4">{children}</div>;
};

// Constants
const STATUS_CONFIG: Record<
  string,
  { label: string; color: string; icon: React.ReactNode }
> = {
  pending: {
    label: "Chờ xác nhận",
    color: "bg-amber-50 text-amber-700 border-amber-200",
    icon: <Clock className="w-3 h-3" />,
  },
  confirmed: {
    label: "Đã xác nhận",
    color: "bg-blue-50 text-blue-700 border-blue-200",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  completed: {
    label: "Hoàn thành",
    color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: <CheckCircle className="w-3 h-3" />,
  },
  cancelled: {
    label: "Đã hủy",
    color: "bg-red-50 text-red-700 border-red-200",
    icon: <XCircle className="w-3 h-3" />,
  },
  refunded: {
    label: "Đã hoàn tiền",
    color: "bg-gray-50 text-gray-700 border-gray-200",
    icon: <DollarSign className="w-3 h-3" />,
  },
};

// API Service Functions
const apiService = {
  // Lấy danh sách bookings
  async getBookings(params: {
    status?: string;
    q?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ApiResponse<PackageBooking[]>> {
    const queryParams = new URLSearchParams();
    if (params.status && params.status !== "all")
      queryParams.append("status", params.status);
    if (params.q) queryParams.append("q", params.q);
    if (params.page) queryParams.append("page", params.page.toString());
    if (params.pageSize)
      queryParams.append("pageSize", params.pageSize.toString());

    const response = await fetch(`/api/admin/bookings?${queryParams}`);
    if (!response.ok) {
      throw new Error("Failed to fetch bookings");
    }
    return response.json();
  },

  // Lấy chi tiết booking
  async getBookingDetail(id: string): Promise<{ booking: PackageBooking }> {
    const response = await fetch(`/api/admin/bookings/${id}`);
    if (!response.ok) {
      throw new Error("Failed to fetch booking details");
    }
    return response.json();
  },

  // Lấy logs của booking
  async getBookingLogs(id: string): Promise<{ logs: BookingLog[] }> {
    const response = await fetch(`/api/admin/bookings/${id}/logs`);
    if (!response.ok) {
      throw new Error("Failed to fetch booking logs");
    }
    return response.json();
  },

  // Cập nhật trạng thái booking
  async updateBookingStatus(
    id: string,
    data: {
      status: string;
      adminUserId: string;
      bookingCode: string;
      note?: string;
      previousStatus: string;
    }
  ): Promise<{ updated: PackageBooking }> {
    const response = await fetch(`/api/admin/bookings/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update booking status");
    }
    return response.json();
  },

  // Thêm log mới
  async addBookingLog(
    id: string,
    data: {
      message: string;
      adminUserId: string;
      bookingCode: string;
    }
  ): Promise<BookingLog> {
    // Giả sử bạn có API endpoint để thêm log
    const response = await fetch(`/api/admin/bookings/${id}/logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to add booking log");
    }
    return response.json();
  },
};

// Main Component - ĐÃ CẬP NHẬT VỚI API THỰC TẾ
export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<PackageBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<PackageBooking | null>(null);
  const [searchInput, setSearchInput] = useState("");
  const [totalBookings, setTotalBookings] = useState(0);
  const [stats, setStats] = useState({
    total: "0",
    pending: "0",
    confirmed: "0",
    revenue: "0",
  });

  const fetchList = async () => {
    setLoading(true);
    try {
      const response = await apiService.getBookings({
        status,
        q: search,
        page,
        pageSize: 20,
      });

      setBookings(response.data || []);
      setTotalBookings(response.meta?.total || 0);

      // Cập nhật stats (trong thực tế bạn nên có API riêng cho stats)
      updateStats(response.data || []);
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      setBookings([]);
    }
    setLoading(false);
  };

  const updateStats = (bookings: PackageBooking[]) => {
    const total = bookings.length;
    const pending = bookings.filter((b) => b.status === "pending").length;
    const confirmed = bookings.filter((b) => b.status === "confirmed").length;
    const revenue = bookings.reduce((sum, b) => sum + b.totalPrice, 0);

    setStats({
      total: total.toString(),
      pending: pending.toString(),
      confirmed: confirmed.toString(),
      revenue: new Intl.NumberFormat("vi-VN", {
        notation: "compact",
        maximumFractionDigits: 1,
      }).format(revenue),
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchInput);
      setPage(1); // Reset về trang 1 khi tìm kiếm
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    fetchList();
  }, [status, search, page]);

  const STATS_DATA = [
    {
      label: "Tổng booking",
      value: stats.total,
      color: "bg-blue-500",
      icon: <Package className="w-5 h-5" />,
    },
    {
      label: "Chờ xác nhận",
      value: stats.pending,
      color: "bg-amber-500",
      icon: <Clock className="w-5 h-5" />,
    },
    {
      label: "Đã xác nhận",
      value: stats.confirmed,
      color: "bg-green-500",
      icon: <CheckCircle className="w-5 h-5" />,
    },
    {
      label: "Doanh thu",
      value: stats.revenue,
      color: "bg-purple-500",
      icon: <DollarSign className="w-5 h-5" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 text-transparent bg-clip-text">
              🛫 Quản lý Đặt tour
            </h1>
            <p className="text-gray-600 mt-2">
              Quản lý và theo dõi tất cả các booking du lịch
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors"
            >
              ← Về trang chính
            </Link>
            <Button onClick={fetchList} variant="outline" size="sm">
              <RefreshCcw className="w-4 h-4 mr-2" />
              Làm mới
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATS_DATA.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    {stat.label}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.color} text-white`}>
                  {stat.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Main Content */}
        <Card className="shadow-lg border-0 rounded-2xl overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-cyan-500 text-white pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <Package className="w-6 h-6" />
              Danh sách Booking
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {/* Filters & Search */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Tìm kiếm mã booking, tên khách hàng, email..."
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger
                  value={status}
                  onValueChange={setStatus}
                  className="w-full lg:w-64"
                >
                  <SelectValue value={status} />
                </SelectTrigger>
              </Select>
            </div>

            {/* Table */}
            <div className="rounded-lg border border-gray-200 overflow-hidden bg-white">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr className="text-left text-gray-600 font-medium">
                      <th className="p-4 font-semibold">Mã Booking</th>
                      <th className="p-4 font-semibold">Tour</th>
                      <th className="p-4 font-semibold">Khách hàng</th>
                      <th className="p-4 font-semibold">Ngày đi</th>
                      <th className="p-4 font-semibold text-right">
                        Tổng tiền
                      </th>
                      <th className="p-4 font-semibold text-center">
                        Trạng thái
                      </th>
                      <th className="p-4 font-semibold text-center">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {loading ? (
                      <div className="flex items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
                      </div>
                    ) : bookings.length === 0 ? (
                      <tr>
                        <td colSpan={7} className="p-8 text-center">
                          <div className="text-gray-500 space-y-2">
                            <Package className="w-12 h-12 mx-auto text-gray-300" />
                            <p>Không tìm thấy booking nào</p>
                            <p className="text-sm">
                              Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
                            </p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      <AnimatePresence>
                        {bookings.map((booking, index) => (
                          <motion.tr
                            key={booking.id}
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ delay: index * 0.05 }}
                            className="hover:bg-blue-50/50 transition-colors group"
                          >
                            <td className="p-4">
                              <div className="font-mono font-semibold text-blue-600">
                                {booking.bookingCode}
                              </div>
                            </td>
                            <td className="p-4">
                              <div
                                className="max-w-xs truncate"
                                title={booking.package?.title}
                              >
                                {booking.package?.title ?? "—"}
                              </div>
                            </td>
                            <td className="p-4">
                              <div>
                                <div className="font-medium text-gray-900">
                                  {booking.user?.name ?? "—"}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {booking.user?.email}
                                </div>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1 text-gray-600">
                                <Calendar className="w-3 h-3" />
                                {booking.selectedDate
                                  ? new Date(
                                      booking.selectedDate
                                    ).toLocaleDateString("vi-VN")
                                  : new Date(
                                      booking.createdAt
                                    ).toLocaleDateString("vi-VN")}
                              </div>
                            </td>
                            <td className="p-4 text-right">
                              <div className="font-semibold text-gray-900">
                                {new Intl.NumberFormat("vi-VN").format(
                                  booking.totalPrice
                                )}
                                ₫
                              </div>
                            </td>
                            <td className="p-4 text-center">
                              <StatusBadge status={booking.status} />
                            </td>
                            <td className="p-4 text-center">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelected(booking)}
                                className="opacity-70 group-hover:opacity-100 transition-opacity"
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Chi tiết
                              </Button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-6 border-t border-gray-200">
              <div className="text-sm text-gray-600">
                Hiển thị{" "}
                <span className="font-medium">
                  {(page - 1) * 20 + 1}-{Math.min(page * 20, totalBookings)}
                </span>{" "}
                của {totalBookings} kết quả
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  Trước
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: Math.ceil(totalBookings / 20) },
                    (_, i) => i + 1
                  )
                    .slice(0, 5)
                    .map((p) => (
                      <Button
                        key={p}
                        variant={page === p ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPage(p)}
                        className="w-8 h-8 p-0"
                      >
                        {p}
                      </Button>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= Math.ceil(totalBookings / 20)}
                >
                  Sau
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selected && (
          <BookingDetailModal
            booking={selected}
            onClose={() => setSelected(null)}
            onStatusUpdate={fetchList} // Refresh list when status changes
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config = STATUS_CONFIG[status] || {
    label: status,
    color: "bg-gray-100 text-gray-700 border-gray-200",
    icon: <AlertCircle className="w-3 h-3" />,
  };

  return (
    <Badge
      variant="outline"
      className={`${config.color} flex items-center gap-1 w-fit`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
}

function BookingDetailModal({
  booking,
  onClose,
  onStatusUpdate,
}: {
  booking: PackageBooking;
  onClose: () => void;
  onStatusUpdate?: () => void;
}) {
  const [logs, setLogs] = useState<BookingLog[]>([]);
  const [logMessage, setLogMessage] = useState("");
  const [addingLog, setAddingLog] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [bookingDetail, setBookingDetail] = useState<PackageBooking>(booking);

  useEffect(() => {
    fetchBookingDetail();
    fetchLogs();
  }, [booking.id]);

  const fetchBookingDetail = async () => {
    try {
      const response = await apiService.getBookingDetail(booking.id);
      setBookingDetail(response.booking);
    } catch (error) {
      console.error("Failed to fetch booking details:", error);
    }
  };

  const fetchLogs = async () => {
    try {
      const response = await apiService.getBookingLogs(booking.id);
      setLogs(response.logs || []);
    } catch (error) {
      console.error("Failed to fetch logs:", error);
      setLogs([]);
    }
  };

  const addLog = async () => {
    if (!logMessage.trim()) return;

    setAddingLog(true);
    try {
      // Giả sử admin user ID từ session/localStorage
      const adminUserId = "admin-user-id"; // Thay bằng ID thực tế

      await apiService.addBookingLog(booking.id, {
        message: logMessage,
        adminUserId,
        bookingCode: booking.bookingCode,
      });

      // Refresh logs
      await fetchLogs();
      setLogMessage("");
    } catch (error) {
      console.error("Failed to add log:", error);
    }
    setAddingLog(false);
  };

  const updateStatus = async (newStatus: string) => {
    setUpdatingStatus(true);
    try {
      const adminUserId = "admin-user-id"; // Thay bằng ID thực tế

      await apiService.updateBookingStatus(booking.id, {
        status: newStatus,
        adminUserId,
        bookingCode: booking.bookingCode,
        previousStatus: bookingDetail.status,
        note: `Cập nhật trạng thái từ ${bookingDetail.status} sang ${newStatus}`,
      });

      // Refresh data
      await fetchBookingDetail();
      await fetchLogs();

      // Notify parent to refresh list
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error("Failed to update status:", error);
    }
    setUpdatingStatus(false);
  };

  const getActionLabel = (action: string): string => {
    const labels: Record<string, string> = {
      admin_note: "Ghi chú quản trị viên",
      created: "Tạo booking",
      confirmed: "Xác nhận booking",
      completed: "Hoàn thành",
      cancelled: "Đã hủy",
      refunded: "Đã hoàn tiền",
      updated: "Cập nhật",
    };
    return labels[action] || action;
  };

  return (
    <motion.div
      className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white w-full max-w-4xl max-h-[90vh] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="relative bg-gradient-to-r from-blue-500 to-cyan-500 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">
                Booking #{bookingDetail.bookingCode}
              </h2>
              <p className="text-blue-100 mt-1">Chi tiết đặt tour</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/20 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <StatusBadge status={bookingDetail.status} />
            <div className="text-sm text-blue-100">
              Tạo ngày:{" "}
              {new Date(bookingDetail.createdAt).toLocaleDateString("vi-VN")}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <Tabs defaultValue="detail" className="p-6">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="detail" className="flex items-center gap-2">
                <Info className="w-4 h-4" />
                Thông tin chi tiết
              </TabsTrigger>
              <TabsTrigger value="logs" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Lịch sử hoạt động
              </TabsTrigger>
            </TabsList>

            {/* Detail Tab */}
            <TabsContent value="detail">
              <div className="space-y-6">
                {/* Status Actions */}
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium">
                      Thay đổi trạng thái
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {[
                        "pending",
                        "confirmed",
                        "completed",
                        "cancelled",
                        "refunded",
                      ]
                        .filter((s) => s !== bookingDetail.status)
                        .map((status) => (
                          <Button
                            key={status}
                            variant="outline"
                            size="sm"
                            onClick={() => updateStatus(status)}
                            disabled={updatingStatus}
                          >
                            {updatingStatus
                              ? "Đang cập nhật..."
                              : `Chuyển sang ${STATUS_CONFIG[status]?.label}`}
                          </Button>
                        ))}
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <User className="w-4 h-4" />
                        Thông tin khách hàng
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Họ tên:</span>
                        <span className="font-medium">
                          {bookingDetail.user?.name || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">
                          {bookingDetail.user?.email || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Liên hệ:</span>
                        <span className="font-medium">
                          {bookingDetail.contactInfo || "—"}
                        </span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium flex items-center gap-2">
                        <Package className="w-4 h-4" />
                        Thông tin tour
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tour:</span>
                        <span className="font-medium text-right">
                          {bookingDetail.package?.title || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Ngày đi:</span>
                        <span className="font-medium">
                          {bookingDetail.selectedDate
                            ? new Date(
                                bookingDetail.selectedDate
                              ).toLocaleDateString("vi-VN")
                            : "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Số người:</span>
                        <span className="font-medium flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          {bookingDetail.participants}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Tổng tiền:</span>
                        <span className="font-medium text-green-600 flex items-center gap-1">
                          <DollarSign className="w-3 h-3" />
                          {new Intl.NumberFormat("vi-VN").format(
                            bookingDetail.totalPrice
                          )}
                          ₫
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {bookingDetail.specialRequests && (
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-medium">
                        Yêu cầu đặc biệt
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">
                        {bookingDetail.specialRequests}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Logs Tab */}
            <TabsContent value="logs">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Lịch sử hoạt động
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Add Log Form */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-medium text-sm mb-3">
                      Thêm ghi chú mới
                    </h4>
                    <div className="flex gap-2">
                      <Input
                        value={logMessage}
                        onChange={(e) => setLogMessage(e.target.value)}
                        placeholder="Nhập ghi chú..."
                        className="flex-1"
                        onKeyPress={(e) => e.key === "Enter" && addLog()}
                      />
                      <Button
                        onClick={addLog}
                        disabled={!logMessage.trim() || addingLog}
                        size="sm"
                      >
                        {addingLog ? "Đang thêm..." : "Thêm"}
                      </Button>
                    </div>
                  </div>

                  {/* Logs List */}
                  {logs.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <FileText className="w-12 h-12 mx-auto text-gray-300 mb-3" />
                      <p>Chưa có hoạt động nào được ghi nhận</p>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-auto">
                      {logs.map((log) => (
                        <motion.div
                          key={log.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex gap-4 p-4 bg-white border border-gray-100 rounded-lg hover:shadow-sm transition-shadow"
                        >
                          <div className="flex-shrink-0 w-2 bg-blue-500 rounded-full" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-1">
                              <span className="font-medium text-gray-900">
                                {getActionLabel(log.action)}
                              </span>
                              <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                {new Date(log.createdAt).toLocaleString(
                                  "vi-VN"
                                )}
                              </span>
                            </div>
                            {log.message && (
                              <p className="text-sm text-gray-700 mt-1">
                                {log.message}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </motion.div>
    </motion.div>
  );
}

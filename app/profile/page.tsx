// app/profile/page.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });

  // ✅ Lấy thông tin người dùng đang đăng nhập
  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/login", { credentials: "include" });
      const data = await res.json();
      if (!data.isLoggedIn) {
        router.push("/auth/login");
        return;
      }
      console.log("User data:", data.user); // Debug thông tin user
      setUser(data.user);
      setForm({
        name: data.user.name || "",
        email: data.user.email || "",
        phone: data.user.phone || "",
        password: "",
      });
      setLoading(false);
    };
    fetchUser();
  }, [router]);

  // ✅ Hàm xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Gửi request cập nhật thông tin
  const handleUpdate = async () => {
    if (!user) return;
    const res = await fetch(`/api/users/${user.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Cập nhật thành công!");

      // 🔄 QUAN TRỌNG: Cập nhật session và reload header
      await updateSessionAndReload();
    } else {
      alert(data.error || "Cập nhật thất bại");
    }
  };

  // 🔄 Hàm cập nhật session và reload header
  const updateSessionAndReload = async () => {
    try {
      // Gọi API để cập nhật session với thông tin mới
      const res = await fetch("/api/auth/refresh-session", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        // Dispatch event để thông báo cho Header reload
        window.dispatchEvent(new Event("userProfileUpdated"));

        // Reload lại trang profile để lấy thông tin mới
        setTimeout(() => {
          router.refresh();
        }, 100);
      }
    } catch (error) {
      console.error("Error updating session:", error);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600"></div>
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto p-6 mt-24 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Chỉnh sửa thông tin cá nhân
      </h2>
      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Họ và tên</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Số điện thoại</label>
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>
        <div>
          <label className="block font-medium mb-1">
            Mật khẩu mới (tùy chọn)
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nhập nếu muốn đổi mật khẩu"
            className="w-full border rounded-lg px-4 py-2"
          />
        </div>

        <button
          onClick={handleUpdate}
          className="w-full bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 transition-all"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
}

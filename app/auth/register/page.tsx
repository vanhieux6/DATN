"use client";
import { useState } from "react";
import {
  MotionDiv,
  MotionH2,
  MotionH3,
  MotionP,
  MotionButton,
} from "../../components/common/MotionWrapper";
import Link from "next/link";
// app/auth/register/page.tsx
interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  gender: string;
  agreeToTerms: boolean;
  receiveNewsletter: boolean;
}

interface Errors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  dateOfBirth?: string;
  gender?: string;
  agreeToTerms?: string;
  [key: string]: string | undefined;
}

export default function RegisterPage() {
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    gender: "",
    agreeToTerms: false,
    receiveNewsletter: true,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState<Errors>({});

  const steps = [
    { id: 1, title: "Thông tin cá nhân", icon: "👤" },
    { id: 2, title: "Tài khoản & Bảo mật", icon: "🔐" },
    { id: 3, title: "Xác nhận", icon: "✅" },
  ];

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateStep = (step: number) => {
    const newErrors: Errors = {};

    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = "Vui lòng nhập họ";
      if (!formData.lastName.trim()) newErrors.lastName = "Vui lòng nhập tên";
      if (!formData.dateOfBirth)
        newErrors.dateOfBirth = "Vui lòng chọn ngày sinh";
      if (!formData.gender) newErrors.gender = "Vui lòng chọn giới tính";
    }

    if (step === 2) {
      if (!formData.email.trim()) newErrors.email = "Vui lòng nhập email";
      else if (!/\S+@\S+\.\S+/.test(formData.email))
        newErrors.email = "Email không hợp lệ";

      if (!formData.phone.trim())
        newErrors.phone = "Vui lòng nhập số điện thoại";
      else if (!/^[0-9]{10,11}$/.test(formData.phone))
        newErrors.phone = "Số điện thoại không hợp lệ";

      if (!formData.password) newErrors.password = "Vui lòng nhập mật khẩu";
      else if (formData.password.length < 8)
        newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";

      if (!formData.confirmPassword)
        newErrors.confirmPassword = "Vui lòng xác nhận mật khẩu";
      else if (formData.password !== formData.confirmPassword)
        newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (step === 3) {
      if (!formData.agreeToTerms)
        newErrors.agreeToTerms = "Vui lòng đồng ý với điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => Math.min(prev + 1, steps.length));
    }
  };

  const handlePrev = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateStep(currentStep)) {
      try {
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: `${formData.firstName} ${formData.lastName}`,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
          }),
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Đăng ký thất bại");
          return;
        }

        alert("Đăng ký thành công!");
        window.location.href = "/auth/login"; // chuyển sang trang đăng nhập
      } catch (err) {
        console.error("Register error:", err);
        alert("Có lỗi xảy ra, vui lòng thử lại!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <MotionH2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4"
            >
              Tạo tài khoản mới
            </MotionH2>
            <MotionP
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Tham gia Traveloka để khám phá thế giới với những ưu đãi đặc biệt
            </MotionP>
          </div>

          {/* Progress Steps */}
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg p-6 mb-8"
          >
            <div className="flex items-center justify-between">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step.id
                        ? "bg-red-600 border-red-600 text-gray-900"
                        : "bg-gray-100 border-gray-300 text-gray-500"
                    }`}
                  >
                    <span className="text-lg">{step.icon}</span>
                  </div>
                  <div className="ml-3">
                    <div
                      className={`text-sm font-medium ${
                        currentStep >= step.id
                          ? "text-red-600"
                          : "text-gray-500"
                      }`}
                    >
                      {step.title}
                    </div>
                  </div>
                  {index < steps.length - 1 && (
                    <div
                      className={`w-16 h-0.5 mx-4 transition-all duration-300 ${
                        currentStep > step.id ? "bg-red-600" : "bg-gray-300"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </MotionDiv>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              <MotionDiv
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-2xl shadow-lg p-8"
              >
                <form onSubmit={handleSubmit}>
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <MotionH3 className="text-2xl font-bold text-gray-900 mb-6">
                        Thông tin cá nhân
                      </MotionH3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Họ <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.firstName}
                            onChange={(e) =>
                              handleInputChange("firstName", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.firstName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Nhập họ của bạn"
                          />
                          {errors.firstName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.firstName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Tên <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            value={formData.lastName}
                            onChange={(e) =>
                              handleInputChange("lastName", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.lastName
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Nhập tên của bạn"
                          />
                          {errors.lastName && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.lastName}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Ngày sinh <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            value={formData.dateOfBirth}
                            onChange={(e) =>
                              handleInputChange("dateOfBirth", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.dateOfBirth
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          />
                          {errors.dateOfBirth && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.dateOfBirth}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Giới tính <span className="text-red-500">*</span>
                          </label>
                          <select
                            value={formData.gender}
                            onChange={(e) =>
                              handleInputChange("gender", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.gender
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                          >
                            <option value="">Chọn giới tính</option>
                            <option value="male">Nam</option>
                            <option value="female">Nữ</option>
                            <option value="other">Khác</option>
                          </select>
                          {errors.gender && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.gender}
                            </p>
                          )}
                        </div>
                      </div>
                    </MotionDiv>
                  )}

                  {/* Step 2: Account & Security */}
                  {currentStep === 2 && (
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <MotionH3 className="text-2xl font-bold text-gray-900 mb-6">
                        Tài khoản & Bảo mật
                      </MotionH3>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Email <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              handleInputChange("email", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.email
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="example@email.com"
                          />
                          {errors.email && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.email}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Số điện thoại{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              handleInputChange("phone", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.phone
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="0123456789"
                          />
                          {errors.phone && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.phone}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Mật khẩu <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            value={formData.password}
                            onChange={(e) =>
                              handleInputChange("password", e.target.value)
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.password
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Tối thiểu 8 ký tự"
                          />
                          {errors.password && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.password}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-900 mb-2">
                            Xác nhận mật khẩu{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="password"
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              handleInputChange(
                                "confirmPassword",
                                e.target.value
                              )
                            }
                            className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent transition-colors ${
                              errors.confirmPassword
                                ? "border-red-500"
                                : "border-gray-300"
                            }`}
                            placeholder="Nhập lại mật khẩu"
                          />
                          {errors.confirmPassword && (
                            <p className="text-red-500 text-sm mt-1">
                              {errors.confirmPassword}
                            </p>
                          )}
                        </div>
                      </div>
                    </MotionDiv>
                  )}

                  {/* Step 3: Confirmation */}
                  {currentStep === 3 && (
                    <MotionDiv
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="space-y-6"
                    >
                      <MotionH3 className="text-2xl font-bold text-gray-900 mb-6">
                        Xác nhận thông tin
                      </MotionH3>

                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h4 className="font-semibold text-gray-900 mb-4">
                          Thông tin cá nhân
                        </h4>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Họ tên:</span>
                            <span className="ml-2 font-medium">
                              {formData.firstName} {formData.lastName}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Ngày sinh:</span>
                            <span className="ml-2 font-medium">
                              {formData.dateOfBirth}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Giới tính:</span>
                            <span className="ml-2 font-medium capitalize">
                              {formData.gender}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Email:</span>
                            <span className="ml-2 font-medium">
                              {formData.email}
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">
                              Số điện thoại:
                            </span>
                            <span className="ml-2 font-medium">
                              {formData.phone}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="agreeToTerms"
                            checked={formData.agreeToTerms}
                            onChange={(e) =>
                              handleInputChange(
                                "agreeToTerms",
                                e.target.checked
                              )
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="agreeToTerms"
                            className="text-sm text-gray-600"
                          >
                            Tôi đồng ý với{" "}
                            <span className="text-red-600 cursor-pointer">
                              điều khoản sử dụng
                            </span>{" "}
                            và{" "}
                            <span className="text-red-600 cursor-pointer">
                              chính sách bảo mật
                            </span>{" "}
                            của Traveloka
                          </label>
                        </div>
                        {errors.agreeToTerms && (
                          <p className="text-red-500 text-sm">
                            {errors.agreeToTerms}
                          </p>
                        )}

                        <div className="flex items-start space-x-3">
                          <input
                            type="checkbox"
                            id="receiveNewsletter"
                            checked={formData.receiveNewsletter}
                            onChange={(e) =>
                              handleInputChange(
                                "receiveNewsletter",
                                e.target.checked
                              )
                            }
                            className="mt-1"
                          />
                          <label
                            htmlFor="receiveNewsletter"
                            className="text-sm text-gray-600"
                          >
                            Tôi muốn nhận thông tin về khuyến mãi và tin tức du
                            lịch
                          </label>
                        </div>
                      </div>
                    </MotionDiv>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between mt-8">
                    <MotionButton
                      type="button"
                      onClick={handlePrev}
                      disabled={currentStep === 1}
                      className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                        currentStep === 1
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-gray-600 text-gray-900 hover:bg-gray-700"
                      }`}
                      whileHover={currentStep !== 1 ? { scale: 1.05 } : {}}
                      whileTap={currentStep !== 1 ? { scale: 0.95 } : {}}
                    >
                      Quay lại
                    </MotionButton>

                    {currentStep < steps.length ? (
                      <MotionButton
                        type="button"
                        onClick={handleNext}
                        className="px-8 py-3 bg-gradient-to-r from-red-600 to-red-700 text-gray-900 rounded-xl font-semibold hover:from-red-700 hover:to-red-800 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Tiếp tục
                      </MotionButton>
                    ) : (
                      <MotionButton
                        type="submit"
                        className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-gray-900 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all duration-300"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Tạo tài khoản
                      </MotionButton>
                    )}
                  </div>
                </form>
              </MotionDiv>
            </div>

            {/* Right Sidebar */}
            <div className="lg:col-span-1">
              <MotionDiv
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-6 sticky top-6"
              >
                <MotionH3 className="text-xl font-bold text-gray-900 mb-4">
                  Lợi ích khi đăng ký
                </MotionH3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Ưu đãi đặc biệt
                      </div>
                      <div className="text-sm text-gray-600">
                        Nhận thông báo về khuyến mãi sớm nhất
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Đặt tour nhanh chóng
                      </div>
                      <div className="text-sm text-gray-600">
                        Lưu thông tin để đặt tour dễ dàng hơn
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Hỗ trợ 24/7
                      </div>
                      <div className="text-sm text-gray-600">
                        Đội ngũ hỗ trợ chuyên nghiệp
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <span className="text-green-500 text-xl">✓</span>
                    <div>
                      <div className="font-medium text-gray-900">
                        Tích điểm thưởng
                      </div>
                      <div className="text-sm text-gray-600">
                        Tích lũy điểm cho mỗi chuyến đi
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t pt-4 pb-2 mt-5">
                  <p className="text-sm text-gray-600 mb-3">Đã có tài khoản?</p>
                  <Link href="/auth/login">
                    <MotionButton
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-gray-900 py-3 px-6 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Đăng nhập
                    </MotionButton>
                  </Link>
                </div>
              </MotionDiv>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

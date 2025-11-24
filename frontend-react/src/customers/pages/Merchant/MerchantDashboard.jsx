// src/pages/Merchant/MerchantDashboard.jsx
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const MerchantDashboard = () => {
  const { jwt } = useSelector((s) => s.auth);
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);

  // modal preview
  const [previewSrc, setPreviewSrc] = useState(null);

  useEffect(() => {
    console.log("MerchantDashboard mounted, jwt =", jwt);

    const fetchOverview = async () => {
      try {
        console.log(">>> GỌI API /api/merchant/me");
        const res = await fetch("http://localhost:5454/api/merchant/me", {
          headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
        });

        console.log("Status /api/merchant/me =", res.status);
        const data = await res.json();
        console.log("Data merchant =", data);
        setForm(data);
      } catch (e) {
        console.error("Lỗi lấy thông tin merchant:", e);
      } finally {
        setLoading(false);
      }
    };

    fetchOverview();
  }, [jwt]);

  const resolveImageUrl = (url) => {
    if (!url) return null;
    // nếu đã là absolute url thì dùng luôn
    if (url.startsWith("http://") || url.startsWith("https://")) return url;
    // nếu backend trả relative path, prefix base host (thay đổi base nếu cần)
    const base = "http://localhost:5454";
    // trim slashes
    if (url.startsWith("/")) return `${base}${url}`;
    return `${base}/${url}`;
  };

  if (loading) {
    return <div className="p-6">Đang tải thông tin nhà hàng...</div>;
  }

  if (!form) {
    return <div className="p-6">Không có dữ liệu merchant.</div>;
  }

  const SectionTitle = ({ children }) => (
    <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-6">{children}</h2>
  );
  const SubTitle = ({ children }) => (
    <h3 className="text-xl font-semibold text-gray-700 mb-3 mt-5">
      {children}
    </h3>
  );

  const inputClass =
    "px-4 text-black py-2 border border-gray-300 rounded text-sm w-full bg-gray-100 cursor-not-allowed";
  const labelClass = "text-sm font-medium text-gray-700";

  // image fields from backend: identity, business, kitchen, others
  const images = [
    { key: "identity", label: "CMND/CCCD / Giấy tờ định danh" },
    { key: "business", label: "Giấy phép kinh doanh" },
    { key: "kitchen", label: "Ảnh bếp / Food" },
    { key: "others", label: "Ảnh khác" },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl shadow-2xl">
        <header className="mb-6">
          <h1 className="text-3xl font-extrabold text-green-600">
            Thông tin Nhà hàng của bạn
          </h1>
          <p className="text-gray-500 mt-1">
            Đây là hồ sơ nhà hàng đã đăng ký. Các trường chỉ để xem, không thể
            chỉnh sửa tại đây.
          </p>
        </header>

        {/* IMAGE GRID */}
        <section>
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Hình ảnh</h3>
            <p className="text-sm text-gray-500">
              Click vào ảnh để xem lớn
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {images.map((img) => {
              const raw = form[img.key];
              const src = resolveImageUrl(raw);
              return (
                <div
                  key={img.key}
                  className="flex items-center gap-4 bg-gray-50 p-3 rounded-lg border border-gray-100"
                >
                  <div className="w-28 h-20 flex-shrink-0 bg-white rounded-md overflow-hidden border border-gray-200 shadow-sm">
                    {src ? (
                      // use button so it's keyboard accessible
                      <button
                        onClick={() => setPreviewSrc(src)}
                        className="w-full h-full"
                        title={`Xem ${img.label}`}
                      >
                        <img
                          src={src}
                          alt={img.label}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 px-2">
                        Không có ảnh
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="text-sm font-medium text-gray-700">
                          {img.label}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 break-words">
                          {raw ? (
                            <a
                              href={src}
                              target="_blank"
                              rel="noreferrer"
                              className="underline text-emerald-600"
                            >
                              Mở ảnh trong tab mới
                            </a>
                          ) : (
                            <span className="text-gray-400">Chưa có</span>
                          )}
                        </div>
                      </div>

                      {raw && (
                        <div className="text-xs text-gray-500">
                          <button
                            onClick={() => {
                              // open in new tab
                              const u = resolveImageUrl(raw);
                              window.open(u, "_blank", "noopener");
                            }}
                            className="px-2 py-1 rounded bg-emerald-100 text-emerald-700 hover:bg-emerald-200 text-xs"
                          >
                            Mở
                          </button>
                        </div>
                      )}
                    </div>
                    {/* optionally show raw url truncated */}
                    {raw && (
                      <div className="mt-2 text-xs text-gray-400 break-all">
                        {raw.length > 120 ? raw.slice(0, 120) + "…" : raw}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="space-y-6 mt-6">
          {/* 1. Thông tin cửa hàng */}
          <section>
            <SectionTitle>1. Thông tin Cửa hàng</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Tên cửa hàng</label>
                <input
                  value={form.name || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Tên người đại diện</label>
                <input
                  value={form.representativeName || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Email Merchant</label>
                <input
                  value={form.merchantEmail || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Số điện thoại</label>
                <input
                  value={form.merchantPhoneNumber || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Mô hình kinh doanh</label>
                <input
                  value={form.businessModel || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>
                  Số lượng đơn hàng trung bình / ngày
                </label>
                <input
                  value={form.dailyOrderVolume ?? ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
            </div>

            <div className="sm:col-span-2 mt-4">
              <label className={labelClass}>Địa chỉ cửa hàng</label>
              <input
                value={form.restaurantAddress || ""}
                readOnly
                disabled
                className={inputClass}
              />
            </div>
          </section>

          {/* ... remainder unchanged ... */}
          <section>
            <SectionTitle>2. Thông tin Đăng ký Pháp lý</SectionTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Hình thức đăng ký</label>
                <input
                  value={form.registrationType || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>
                  Tên đăng ký kinh doanh đầy đủ
                </label>
                <input
                  value={form.legalBusinessName || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>
                  Mã số doanh nghiệp/Mã số thuế
                </label>
                <input
                  value={form.businessRegistrationCode || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Ngày đăng ký kinh doanh</label>
                <input
                  value={form.registrationDate || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1 sm:col-span-2">
                <label className={labelClass}>Ngành nghề kinh doanh</label>
                <input
                  value={form.businessIndustry || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>3. Thông tin Thanh toán (Ngân hàng)</SectionTitle>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Tên ngân hàng</label>
                <input
                  value={form.bankName || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Số tài khoản</label>
                <input
                  value={form.bankAccountNumber || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Tên chủ tài khoản</label>
                <input
                  value={form.bankAccountHolderName || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
            </div>
          </section>

          <section>
            <SectionTitle>4. Thông tin Chủ sở hữu/Đại diện</SectionTitle>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Tên Chủ sở hữu</label>
                <input
                  value={form.ownerName || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Ngày sinh</label>
                <input
                  value={form.ownerDateOfBirth || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Số CMND/CCCD</label>
                <input
                  value={form.ownerIdNumber || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Ngày cấp</label>
                <input
                  value={form.ownerIdIssueDate || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Nơi cấp</label>
                <input
                  value={form.ownerIdIssuePlace || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Ngày hết hạn</label>
                <input
                  value={form.ownerIdExpiryDate || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
            </div>

            <SubTitle>Địa chỉ</SubTitle>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>
                  Địa chỉ thường trú (theo CCCD)
                </label>
                <input
                  value={form.ownerPermanentAddress || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Địa chỉ hiện tại</label>
                <input
                  value={form.ownerCurrentAddress || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Quốc gia</label>
                <input
                  value={form.ownerCountry || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col space-y-1">
                <label className={labelClass}>Thành phố</label>
                <input
                  value={form.ownerCity || ""}
                  readOnly
                  disabled
                  className={inputClass}
                />
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* Modal preview */}
      {previewSrc && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
          onClick={() => setPreviewSrc(null)}
        >
          <div
            className="bg-white rounded-lg overflow-hidden max-w-4xl w-full max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-end p-2">
              <button
                onClick={() => setPreviewSrc(null)}
                className="text-gray-600 hover:text-gray-800 px-3 py-1"
              >
                Đóng
              </button>
            </div>
            <div className="p-4 flex items-center justify-center">
              <img
                src={previewSrc}
                alt="Preview"
                className="max-w-full max-h-[70vh] object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MerchantDashboard;

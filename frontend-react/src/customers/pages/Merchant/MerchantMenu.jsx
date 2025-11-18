import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:5454/api/product";

const MerchantMenu = () => {
  const { jwt, user } = useSelector((state) => state.auth) || {};

  // ===== CATEGORY STATE =====
  const [categoryName, setCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categories, setCategories] = useState([]); // lưu list category từ backend
  const [loadingCategories, setLoadingCategories] = useState(false);

  // ===== FOOD STATE =====
  const [foodForm, setFoodForm] = useState({
    name: "",
    description: "",
    price: "",
    foodCategoryId: "",
    available: true,
    ingredientCategoryDTOs: [],
  });
  const [creatingFood, setCreatingFood] = useState(false);

  // ===== ẢNH (file & preview) =====
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // ================== LẤY LIST CATEGORY TỪ BACKEND ==================
  const fetchCategories = async () => {
    if (!jwt) return;
    try {
      setLoadingCategories(true);
      const res = await fetch(`${API_BASE}/categories`, {
        headers: {
          Authorization: `Bearer ${jwt}`,
        },
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Lỗi lấy categories:", res.status, text);
        return;
      }

      const json = await res.json();
      // backend trả về { success, message, data }
      const list = json.data || [];
      setCategories(list);

      // nếu đang chưa chọn category nào thì auto chọn category đầu tiên
      if (!foodForm.foodCategoryId && list.length > 0) {
        setFoodForm((prev) => ({
          ...prev,
          foodCategoryId: list[0].id.toString(),
        }));
      }
    } catch (err) {
      console.error("Lỗi gọi API lấy categories:", err);
    } finally {
      setLoadingCategories(false);
    }
  };

  // Gọi 1 lần khi component mount
  useEffect(() => {
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt]);

  // ================== HANDLERS ==================

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      alert("Tên category không được trống");
      return;
    }
    if (!jwt) {
      alert("Thiếu JWT, vui lòng đăng nhập lại");
      return;
    }

    try {
      setCreatingCategory(true);
      const res = await fetch(`${API_BASE}/add-category`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
        body: JSON.stringify({ name: categoryName }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Lỗi tạo category:", res.status, text);
        alert("Tạo category thất bại, xem console để biết thêm chi tiết.");
        return;
      }

      const newCategory = await res.json();
      setCategoryName("");
      alert("Tạo category thành công! ID: " + newCategory.id);

      // 👉 Sau khi tạo category: load lại list
      await fetchCategories();
    } catch (err) {
      console.error("Lỗi gọi API tạo category:", err);
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleFoodChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFoodForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===== Chọn ảnh: chỉ lưu file & tạo preview, không upload Cloudinary trên FE =====
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }

    setImageFile(file);

    // tạo preview
    const url = URL.createObjectURL(file);
    setImagePreview((old) => {
      if (old) URL.revokeObjectURL(old);
      return url;
    });
  };

  // ===== IngredientCategory & IngredientItem =====
  const addIngredientCategory = () => {
    setFoodForm((prev) => ({
      ...prev,
      ingredientCategoryDTOs: [
        ...prev.ingredientCategoryDTOs,
        { name: "", ingredients: [] },
      ],
    }));
  };

  const removeIngredientCategory = (index) => {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      copy.splice(index, 1);
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  };

  const handleIngredientCategoryNameChange = (index, value) => {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      copy[index] = { ...copy[index], name: value };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  };

  const addIngredientItem = (catIndex) => {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      const cat = copy[catIndex];
      const newItems = cat.ingredients ? [...cat.ingredients] : [];
      newItems.push({
        name: "",
        price: "",
        inStoke: true,
      });
      copy[catIndex] = { ...cat, ingredients: newItems };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  };

  const removeIngredientItem = (catIndex, itemIndex) => {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      const cat = copy[catIndex];
      const newItems = [...(cat.ingredients || [])];
      newItems.splice(itemIndex, 1);
      copy[catIndex] = { ...cat, ingredients: newItems };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  };

  const handleIngredientItemChange = (catIndex, itemIndex, field, value) => {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      const cat = copy[catIndex];
      const newItems = [...(cat.ingredients || [])];
      newItems[itemIndex] = {
        ...newItems[itemIndex],
        [field]: field === "inStoke" ? value : value,
      };
      copy[catIndex] = { ...cat, ingredients: newItems };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  };

  const handleAddFood = async (e) => {
    e.preventDefault();

    if (!jwt) {
      alert("Thiếu JWT, vui lòng đăng nhập lại");
      return;
    }
    if (!foodForm.name.trim()) {
      alert("Tên món không được để trống");
      return;
    }
    if (!foodForm.price) {
      alert("Giá không được để trống");
      return;
    }
    if (!foodForm.foodCategoryId) {
      alert("Vui lòng chọn Category cho món ăn");
      return;
    }

    // Payload JSON cho AddFoodRequest (KHÔNG có field image)
    const payload = {
      name: foodForm.name,
      description: foodForm.description,
      price: Number(foodForm.price),
      foodCategoryId: Number(foodForm.foodCategoryId), // gửi ID category
      available: foodForm.available,
      ingredientCategoryDTOs: foodForm.ingredientCategoryDTOs.map((cat) => ({
        name: cat.name,
        ingredients: (cat.ingredients || []).map((it) => ({
          name: it.name,
          price: it.price ? Number(it.price) : 0,
          inStoke: it.inStoke ?? true,
        })),
      })),
      // Jackson đọc ISO string thành java.util.Date được
      creationDate: new Date().toISOString(),
    };

    // Dùng FormData để gửi multipart/form-data
    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(payload)], { type: "application/json" })
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      setCreatingFood(true);
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwt}`,
          // KHÔNG set "Content-Type": fetch + FormData tự set boundary
        },
        body: formData,
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Lỗi tạo món:", res.status, text);
        alert("Tạo món thất bại, xem console để biết chi tiết.");
        return;
      }

      const createdFood = await res.json();
      console.log("Created food:", createdFood);
      alert("Tạo món thành công!");

      // Reset form
      setFoodForm({
        name: "",
        description: "",
        price: "",
        foodCategoryId: categories[0]?.id?.toString() || "",
        available: true,
        ingredientCategoryDTOs: [],
      });
      setImageFile(null);
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
      setImagePreview("");
    } catch (err) {
      console.error("Lỗi gọi API tạo món:", err);
    } finally {
      setCreatingFood(false);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold mb-4 text-emerald-600">
        Quản lý thực đơn
      </h1>

      {/* ADD CATEGORY */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-emerald-600">
          Thêm loại món (Category)
        </h2>
        <form onSubmit={handleAddCategory} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-600">
              Tên category
            </label>
            <input
              type="text"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Ví dụ: Cơm, Đồ uống, Món chính..."
            />
          </div>

          <button
            type="submit"
            disabled={creatingCategory}
            className={`px-4 py-2 rounded-lg font-semibold text-white ${
              creatingCategory
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-emerald-600 hover:bg-emerald-700"
            }`}
          >
            {creatingCategory ? "Đang tạo..." : "Thêm category"}
          </button>
        </form>

        <div className="mt-3">
          <h3 className="font-medium mb-1 text-sm text-gray-700">
            Danh sách category:
          </h3>
          {loadingCategories ? (
            <p className="text-xs text-gray-500">Đang tải categories...</p>
          ) : categories.length === 0 ? (
            <p className="text-xs text-gray-500">
              Chưa có category nào, hãy tạo mới.
            </p>
          ) : (
            <ul className="text-sm list-disc list-inside text-gray-700">
              {categories.map((c) => (
                <li key={c.id}>
                  ID: <span className="font-mono">{c.id}</span> – {c.name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* ADD FOOD */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold mb-2 text-emerald-600">
          Thêm món ăn (Food)
        </h2>
        <form onSubmit={handleAddFood} className="space-y-4">
          {/* Tên + Giá */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1 text-emerald-600">
                Tên món
              </label>
              <input
                type="text"
                name="name"
                value={foodForm.name}
                onChange={handleFoodChange}
                className="w-full border rounded-lg px-3 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ví dụ: Cơm tấm sườn bì chả"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1 text-emerald-600">
                Giá (VND)
              </label>
              <input
                type="number"
                name="price"
                value={foodForm.price}
                onChange={handleFoodChange}
                className="w-full border rounded-lg px-3 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Ví dụ: 45000"
                min="0"
              />
            </div>
          </div>

          {/* Mô tả */}
          <div>
            <label className="block text-sm font-medium mb-1 text-emerald-600">Mô tả</label>
            <textarea
              name="description"
              value={foodForm.description}
              onChange={handleFoodChange}
              rows={3}
              className="w-full border rounded-lg px-3 py-2 bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              placeholder="Mô tả ngắn về món ăn..."
            />
          </div>

          {/* Category SELECT + Available */}
          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm font-medium mb-1 text-emerald-600">
                Category cho món ăn
              </label>
              <select
                name="foodCategoryId"
                value={foodForm.foodCategoryId}
                onChange={handleFoodChange}
                className="w-full border rounded-lg px-3 py-2 bg-white text-black focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="">
                  {loadingCategories
                    ? "Đang tải categories..."
                    : "Chọn category"}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} (ID: {c.id})
                  </option>
                ))}
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Nếu chưa có category, hãy tạo ở phần trên.
              </p>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-6">
              <input
                id="available"
                type="checkbox"
                name="available"
                checked={foodForm.available}
                onChange={handleFoodChange}
                className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
              />
              <label htmlFor="available" className="text-sm font-medium text-emerald-600">
                Món này đang bán (available)
              </label>
            </div>
          </div>

          {/* Ảnh (file, gửi cho backend) */}
          <div className="space-y-2">
            <label className="block text-sm font-medium mb-1 text-emerald-600">
              Ảnh món ăn
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-900
               file:mr-4 file:py-2 file:px-4
               file:rounded-full file:border-0
               file:text-sm file:font-semibold
               file:bg-emerald-50 file:text-emerald-700
               hover:file:bg-emerald-100"
            />
            {imagePreview && (
              <div className="mt-2">
                <p className="text-xs text-gray-500 mb-1">
                  Ảnh sẽ được upload kèm món ăn:
                </p>
                <img
                  src={imagePreview}
                  alt="preview"
                  className="h-24 rounded-lg object-cover border"
                />
              </div>
            )}
          </div>

          {/* Ingredient Categories + Items */}
          <div className="border rounded-lg p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-sm">
                Tuỳ chọn nguyên liệu (Ingredient Categories)
              </h3>
              <button
                type="button"
                onClick={addIngredientCategory}
                className="px-3 py-1 text-xs rounded-full bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
              >
                + Thêm nhóm nguyên liệu
              </button>
            </div>

            {foodForm.ingredientCategoryDTOs.length === 0 && (
              <p className="text-xs text-gray-500">
                Ví dụ nhóm: "Chọn topping", "Chọn size", "Thêm nước chấm"...
              </p>
            )}

            {foodForm.ingredientCategoryDTOs.map((cat, catIndex) => (
              <div
                key={catIndex}
                className="border rounded-lg p-3 space-y-2 bg-gray-50"
              >
                <div className="flex items-center justify-between gap-3">
                  <input
                    type="text"
                    value={cat.name}
                    onChange={(e) =>
                      handleIngredientCategoryNameChange(
                        catIndex,
                        e.target.value
                      )
                    }
                    className="flex-1 border rounded-lg px-3 py-1 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    placeholder="Tên nhóm, ví dụ: Chọn topping"
                  />
                  <button
                    type="button"
                    onClick={() => removeIngredientCategory(catIndex)}
                    className="text-xs text-red-600 hover:underline"
                  >
                    Xoá nhóm
                  </button>
                </div>

                <div className="space-y-2 mt-2">
                  {(cat.ingredients || []).map((it, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="grid md:grid-cols-4 gap-2 items-center"
                    >
                      <input
                        type="text"
                        value={it.name}
                        onChange={(e) =>
                          handleIngredientItemChange(
                            catIndex,
                            itemIndex,
                            "name",
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-2 py-1 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Tên tuỳ chọn, ví dụ: Trân châu trắng"
                      />
                      <input
                        type="number"
                        value={it.price}
                        onChange={(e) =>
                          handleIngredientItemChange(
                            catIndex,
                            itemIndex,
                            "price",
                            e.target.value
                          )
                        }
                        className="border rounded-lg px-2 py-1 text-sm bg-white text-black placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Giá thêm (VND)"
                        min="0"
                      />
                      <label className="inline-flex items-center text-xs">
                        <input
                          type="checkbox"
                          checked={it.inStoke}
                          onChange={(e) =>
                            handleIngredientItemChange(
                              catIndex,
                              itemIndex,
                              "inStoke",
                              e.target.checked
                            )
                          }
                          className="h-3 w-3 text-emerald-600 border-gray-300 rounded mr-1"
                        />
                        Còn hàng
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          removeIngredientItem(catIndex, itemIndex)
                        }
                        className="text-xs text-red-600 hover:underline"
                      >
                        Xoá
                      </button>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addIngredientItem(catIndex)}
                    className="text-xs text-emerald-600 hover:underline"
                  >
                    + Thêm tuỳ chọn
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={creatingFood}
              className={`px-6 py-2 rounded-lg font-semibold text-white ${
                creatingFood
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {creatingFood ? "Đang tạo món..." : "Thêm món ăn"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default MerchantMenu;

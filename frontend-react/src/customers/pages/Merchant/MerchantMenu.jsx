import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const API_BASE = "http://localhost:5454/api/product";

const emptyFoodForm = (categories = []) => ({
  name: "",
  description: "",
  price: "",
  foodCategoryId: categories[0]?.id?.toString() || "",
  available: true,
  ingredientCategoryDTOs: [],
  creationDate: new Date().toISOString(),
});

const MerchantMenu = () => {
  const { jwt, user } = useSelector((state) => state.auth) || {};

  // ===== CATEGORY STATE =====
  const [categoryName, setCategoryName] = useState("");
  const [creatingCategory, setCreatingCategory] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState("");

  const [categorySearch, setCategorySearch] = useState("");

  // ===== FOOD STATE =====
  const [foodForm, setFoodForm] = useState(emptyFoodForm());
  const [creatingFood, setCreatingFood] = useState(false);

  const [foods, setFoods] = useState([]);
  const [loadingFoods, setLoadingFoods] = useState(false);
  const [foodPage, setFoodPage] = useState({ page: 1, size: 10, total: 0 });

  const [foodSearch, setFoodSearch] = useState("");
  const [foodFilterAvailable, setFoodFilterAvailable] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("");

  const [detailFood, setDetailFood] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [editingFoodId, setEditingFoodId] = useState(null);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // helpers
  const authHeaders = () => (jwt ? { Authorization: `Bearer ${jwt}` } : {});

  const extractData = async (res) => {
    const json = await res.json().catch(() => null);
    if (!json) return null;
    if (json.data !== undefined) return json.data;
    return json;
  };

  // ================== CATEGORY API ==================
  const fetchCategories = async (q = "") => {
    if (!jwt) return;
    try {
      setLoadingCategories(true);
      const url = q
        ? `${API_BASE}/categories/search?name=${encodeURIComponent(q)}`
        : `${API_BASE}/categories`;

      const res = await fetch(url, { headers: { ...authHeaders() } });
      if (!res.ok) return console.error("Get category failed");

      const data = await extractData(res);
      setCategories(data || []);

      setFoodForm((prev) => ({
        ...prev,
        foodCategoryId:
          prev.foodCategoryId || (data?.[0]?.id?.toString() || ""),
      }));
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, [jwt]);

    useEffect(() => {
    if (!jwt) return;
    fetchFoods(1, foodPage.size);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jwt, foodSearch, foodFilterAvailable, selectedCategoryFilter]);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!categoryName.trim()) return alert("Tên category không được rỗng");

    try {
      setCreatingCategory(true);
      const res = await fetch(`${API_BASE}/add-category`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name: categoryName.trim() }),
      });

      if (!res.ok) {
        console.error("Add category fail");
        return alert("Tạo category thất bại");
      }

      await fetchCategories();
      setCategoryName("");
      alert("Thành công");
    } finally {
      setCreatingCategory(false);
    }
  };

  const startEditCategory = (c) => {
    setEditingCategoryId(c.id);
    setEditingCategoryName(c.name);
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditingCategoryName("");
  };

  const submitEditCategory = async (id) => {
    if (!editingCategoryName.trim()) return alert("Tên không hợp lệ");

    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", ...authHeaders() },
      body: JSON.stringify({ name: editingCategoryName.trim() }),
    });

    if (!res.ok) return alert("Lỗi cập nhật");

    await fetchCategories();
    cancelEditCategory();
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm("Xóa category?"))
      return;

    const res = await fetch(`${API_BASE}/categories/${id}`, {
      method: "DELETE",
      headers: { ...authHeaders() },
    });

    if (!res.ok) return alert("Không thể xóa category");

    fetchCategories();
  };

  // ================== FOOD API STARTS NEXT (TIẾP THEO Ở PHẦN 2) ==================

  return (
    <div className="space-y-8 text-black">
      {/* CATEGORY SECTION */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-emerald-600">
            Loại món (Category)
          </h2>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tìm category..."
              value={categorySearch}
              onChange={(e) => setCategorySearch(e.target.value)}
              className="border rounded px-3 py-1 text-black placeholder-gray-500"
            />
            <button
              onClick={() => fetchCategories(categorySearch)}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
            >
              Tìm
            </button>
            <button
              onClick={() => {
                setCategorySearch("");
                fetchCategories();
              }}
              className="px-3 py-1 rounded border text-sm text-black"
            >
              Reset
            </button>
          </div>
        </div>

        <form onSubmit={handleAddCategory} className="space-y-3">
          <div className="grid md:grid-cols-3 gap-3 items-center">
            <input
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder="Tên category mới..."
              className="col-span-2 border rounded px-3 py-2 text-black placeholder-gray-500"
            />
            <button
              type="submit"
              disabled={creatingCategory}
              className={`px-4 py-2 rounded ${
                creatingCategory
                  ? "bg-gray-400 text-black"
                  : "bg-emerald-600 text-white"
              }`}
            >
              {creatingCategory ? "Đang tạo..." : "Thêm category"}
            </button>
          </div>
        </form>

        <div>
          {loadingCategories ? (
            <p>Đang tải...</p>
          ) : categories.length === 0 ? (
            <p className="text-gray-600 text-sm">Chưa có category</p>
          ) : (
            <ul className="space-y-2">
              {categories.map((c) => (
                <li key={c.id} className="flex items-center justify-between">
                  <div>
                    {editingCategoryId === c.id ? (
                      <input
                        value={editingCategoryName}
                        onChange={(e) => setEditingCategoryName(e.target.value)}
                        className="border px-2 py-1 rounded text-black"
                      />
                    ) : (
                      <span>
                        ID:{" "}
                        <span className="font-mono">{c.id}</span> — {c.name}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {editingCategoryId === c.id ? (
                      <>
                        <button
                          onClick={() => submitEditCategory(c.id)}
                          className="px-2 py-1 rounded bg-emerald-600 text-white text-sm"
                        >
                          Lưu
                        </button>
                        <button
                          onClick={cancelEditCategory}
                          className="px-2 py-1 rounded border text-sm text-black"
                        >
                          Huỷ
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => startEditCategory(c)}
                          className="px-2 py-1 rounded border text-sm text-black"
                        >
                          Sửa
                        </button>
                        <button
                          onClick={() => handleDeleteCategory(c.id)}
                          className="px-2 py-1 rounded border text-sm text-red-600"
                        >
                          Xoá
                        </button>
                      </>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
      {/* FOOD LIST & CONTROLS */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-emerald-600">Danh sách món</h2>

          <div className="flex items-center gap-2">
            <select
              value={selectedCategoryFilter || ""}
              onChange={(e) => setSelectedCategoryFilter(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            >
              <option value="">Tất cả category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              placeholder="Tìm món..."
              value={foodSearch}
              onChange={(e) => setFoodSearch(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            />

            <select
              value={foodFilterAvailable}
              onChange={(e) => setFoodFilterAvailable(e.target.value)}
              className="border rounded px-2 py-1 text-black"
            >
              <option value="">Tất cả</option>
              <option value="true">Đang bán</option>
              <option value="false">Ngưng bán</option>
            </select>

            <button
              onClick={() => fetchFoods(1, foodPage.size)}
              className="px-3 py-1 rounded bg-emerald-600 text-white text-sm"
            >
              Tìm
            </button>
          </div>
        </div>

        <div>
          {loadingFoods ? (
            <p>Đang tải món...</p>
          ) : foods.length === 0 ? (
            <p className="text-gray-600 text-sm">Chưa có món nào.</p>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left">
                  <th className="py-2">ID</th>
                  <th>Ảnh</th>
                  <th>Tên</th>
                  <th>Giá</th>
                  <th>Category</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {foods.map((f) => (
                  <tr key={f.id} className="border-t">
                    <td className="py-2">{f.id}</td>
                    <td className="py-2">
                      {f.image ? (
                        <img
                          src={f.image}
                          alt=""
                          className="h-12 w-12 object-cover rounded"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No image</span>
                      )}
                    </td>
                    <td className="py-2 text-black">{f.name}</td>
                    <td className="py-2 text-black">
                      {f.basePrice ?? f.price}
                    </td>
                    <td className="py-2 text-black">
                      {f.category?.name || f.categoryName || "-"}
                    </td>
                    <td className="py-2">
                      <select
                        value={String(f.available)} // "true" hoặc "false"
                        onChange={(e) => toggleAvailable(f.id, e.target.value === "true")}
                        className="border rounded px-2 py-1 text-black"
                      >
                        <option value="true">Đang bán</option>
                        <option value="false">Ngưng bán</option>
                      </select>
                    </td>

                    <td className="py-2 space-x-2">
                      <button
                        onClick={() => openFoodDetail(f.id)}
                        className="px-2 py-1 rounded border text-xs text-black"
                      >
                        View
                      </button>
                      <button
                        onClick={() => openFoodEdit(f)}
                        className="px-2 py-1 rounded border text-xs text-black"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFood(f.id)}
                        className="px-2 py-1 rounded text-xs text-red-600 border"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {/* pagination */}
          <div className="flex items-center justify-between mt-3">
            <div className="text-sm text-gray-600">Hiển thị {foods.length} / {foodPage.total} món</div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => fetchFoods(Math.max(1, foodPage.page - 1), foodPage.size)}
                className="px-2 py-1 border rounded text-black"
              >
                Prev
              </button>
              <div className="px-2 py-1 border rounded text-black">Page {foodPage.page}</div>
              <button
                onClick={() => fetchFoods(foodPage.page + 1, foodPage.size)}
                className="px-2 py-1 border rounded text-black"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ADD / EDIT FOOD FORM */}
      <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
        <h2 className="text-xl font-semibold text-emerald-600">
          {editingFoodId ? "Sửa món" : "Thêm món"}
        </h2>

        <form onSubmit={editingFoodId ? submitUpdateFood : handleAddFood} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-emerald-600">Tên món</label>
              <input
                name="name"
                value={foodForm.name}
                onChange={(e) => setFoodForm({ ...foodForm, name: e.target.value })}
                className="w-full border rounded px-3 py-2 text-black"
              />
            </div>
            <div>
              <label className="block text-sm text-emerald-600">Giá</label>
              <input
                name="price"
                type="number"
                value={foodForm.price}
                onChange={(e) => setFoodForm({ ...foodForm, price: e.target.value })}
                className="w-full border rounded px-3 py-2 text-black"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-emerald-600">Mô tả</label>
            <textarea
              name="description"
              rows={3}
              value={foodForm.description}
              onChange={(e) => setFoodForm({ ...foodForm, description: e.target.value })}
              className="w-full border rounded px-3 py-2 text-black"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4 items-center">
            <div>
              <label className="block text-sm text-emerald-600">Category</label>
              <select
                name="foodCategoryId"
                value={foodForm.foodCategoryId}
                onChange={(e) => setFoodForm({ ...foodForm, foodCategoryId: e.target.value })}
                className="w-full border rounded px-3 py-2 text-black"
              >
                <option value="">{loadingCategories ? "Đang tải..." : "Chọn category"}</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2 mt-4 md:mt-6">
              <input
                id="available"
                type="checkbox"
                checked={!!foodForm.available}
                onChange={(e) => setFoodForm({ ...foodForm, available: e.target.checked })}
              />
              <label htmlFor="available" className="text-sm text-emerald-600 text-black">Món này đang bán (available)</label>
            </div>
          </div>

          <div>
            <label className="block text-sm text-emerald-600 text-black">Ảnh món</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleImageChangeLocal(e)}
              className="block w-full text-sm text-black"
            />
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="h-24 mt-2 rounded object-cover border" />
            )}
          </div>

          <div className="border rounded p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-black">Tuỳ chọn nguyên liệu</h3>
              <button type="button" onClick={addIngredientCategoryLocal} className="px-2 py-1 text-xs rounded bg-emerald-100 text-black">+ Thêm nhóm</button>
            </div>

            {foodForm.ingredientCategoryDTOs.length === 0 && <p className="text-xs text-gray-500">Chưa có nhóm tuỳ chọn</p>}

            {foodForm.ingredientCategoryDTOs.map((cat, catIndex) => (
              <div key={catIndex} className="bg-gray-50 p-3 rounded space-y-2">
                <div className="flex items-center justify-between">
                  <input
                    value={cat.name}
                    onChange={(e) => handleIngredientCategoryNameChangeLocal(catIndex, e.target.value)}
                    className="border px-2 py-1 rounded flex-1 text-black"
                    placeholder="Tên nhóm"
                  />
                  <button type="button" onClick={() => removeIngredientCategoryLocal(catIndex)} className="ml-2 text-xs text-red-600">Xoá</button>
                </div>

                {(cat.ingredients || []).map((it, itemIndex) => (
                  <div key={itemIndex} className="grid md:grid-cols-4 gap-2 items-center">
                    <input
                      value={it.name}
                      onChange={(e) => handleIngredientItemChangeLocal(catIndex, itemIndex, "name", e.target.value)}
                      placeholder="Tên tuỳ chọn"
                      className="border px-2 py-1 rounded text-black"
                    />
                    <input
                      value={it.price}
                      type="number"
                      onChange={(e) => handleIngredientItemChangeLocal(catIndex, itemIndex, "price", e.target.value)}
                      placeholder="Giá"
                      className="border px-2 py-1 rounded text-black"
                    />
                    <label className="inline-flex items-center text-black">
                      <input
                        type="checkbox"
                        checked={!!it.inStoke}
                        onChange={(e) => handleIngredientItemChangeLocal(catIndex, itemIndex, "inStoke", e.target.checked)}
                        className="mr-1"
                      />
                      Còn hàng
                    </label>
                    <button type="button" onClick={() => removeIngredientItemLocal(catIndex, itemIndex)} className="text-xs text-red-600">Xoá</button>
                  </div>
                ))}

                <button type="button" onClick={() => addIngredientItemLocal(catIndex)} className="text-xs text-emerald-600">+ Thêm tuỳ chọn</button>
              </div>
            ))}
          </div>

          <div>
            <button
              type="submit"
              disabled={creatingFood}
              className={`px-6 py-2 rounded ${creatingFood ? "bg-gray-400 text-black" : "bg-emerald-600 text-white"}`}
            >
              {creatingFood ? (editingFoodId ? "Đang cập nhật..." : "Đang tạo...") : (editingFoodId ? "Cập nhật món" : "Thêm món")}
            </button>
            {editingFoodId && (
              <button type="button" onClick={() => { closeEdit(); }} className="ml-2 px-4 py-2 border rounded text-black">Huỷ</button>
            )}
          </div>
        </form>
      </section>
      {/* DETAIL MODAL (simple) */}
      {detailOpen && detailFood && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded p-6 w-11/12 md:w-2/3 max-h-[90vh] overflow-auto text-black">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">{detailFood.name}</h3>
              <button onClick={() => { setDetailOpen(false); setDetailFood(null); }} className="px-2 py-1 border rounded text-black">Đóng</button>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                {detailFood.image ? (
                  <img src={detailFood.image} alt="" className="w-full h-48 object-cover rounded" />
                ) : (
                  <div className="h-48 bg-gray-100 flex items-center justify-center">No image</div>
                )}
              </div>
              <div className="md:col-span-2 text-black">
                <p className="text-sm"><strong>Giá:</strong> {detailFood.basePrice}</p>
                <p className="text-sm"><strong>Category:</strong> {detailFood.category?.name}</p>
                <p className="mt-2 text-sm"><strong>Mô tả:</strong> {detailFood.description}</p>

                <div className="mt-4">
                  <h4 className="font-semibold">Nhóm tuỳ chọn</h4>
                  {(detailFood.productToppingGroups || []).map((g) => (
                    <div key={g.id} className="border rounded p-2 mt-2">
                      <div className="text-sm font-medium">{g.toppingGroup?.name}</div>
                      <div className="text-xs text-gray-600">Min {g.toppingGroup?.minSelection} - Max {g.toppingGroup?.maxSelection}</div>
                      <ul className="mt-1">
                        {(g.toppingGroup?.toppings || []).map((t) => (
                          <li key={t.id} className="text-xs">{t.name} — {t.price}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  ); // end return

  // ================== REMAINING HELPERS / ACTIONS ==================
  // Note: these functions must appear in the component scope (before export).
  // If you pasted sections in order they will be in correct scope.

  // fetchFoods implementation
  async function fetchFoods(page = 1, size = 10) {
    if (!jwt) return;
    try {
      setLoadingFoods(true);
      const params = new URLSearchParams();
      params.append("merchantId", user?.id);
      if (foodSearch) params.append("name", foodSearch);
      if (foodFilterAvailable !== "") params.append("available", foodFilterAvailable);
      if (selectedCategoryFilter) params.append("categoryId", selectedCategoryFilter);
      params.append("page", page);
      params.append("limit", size);

      const res = await fetch(`${API_BASE}/get-all?${params.toString()}`, {
        headers: { ...authHeaders() },
      });
      if (!res.ok) {
        console.error("Lỗi lấy foods", res.status, await res.text());
        return;
      }
      const json = await res.json();
      const data = json.data || [];
      setFoods(data);
      if (json.page) {
        setFoodPage({
          page: json.page.number || page,
          size: json.page.size || size,
          total: json.page.totalElements || data.length,
        });
      } else {
        setFoodPage({ page, size, total: data.length });
      }
    } catch (err) {
      console.error("fetchFoods", err);
    } finally {
      setLoadingFoods(false);
    }
  }

  // effect: refetch foods when filters change


  // open detail
  async function openFoodDetail(foodId) {
    if (!jwt) return;
    try {
      const res = await fetch(`${API_BASE}/getone/${foodId}`, {
        headers: { ...authHeaders() },
      });
      if (!res.ok) {
        console.error("getone failed", res.status, await res.text());
        return alert("Không tải được chi tiết món");
      }
      const d = await extractData(res);
      setDetailFood(d);
      setDetailOpen(true);
    } catch (err) {
      console.error(err);
      alert("Lỗi tải chi tiết");
    }
  }

  // open edit - prefill form
  function openFoodEdit(food) {
    setEditingFoodId(food.id);
    setFoodForm({
      name: food.name || "",
      description: food.description || "",
      price: food.basePrice != null ? String(food.basePrice) : (food.price != null ? String(food.price) : ""),
      foodCategoryId: food.category?.id?.toString() || (categories[0]?.id?.toString() || ""),
      available: food.available === undefined ? true : !!food.available,
      ingredientCategoryDTOs:
        (food.productToppingGroups || []).map((ptg) => ({
          name: ptg.toppingGroup?.name || "",
          ingredients:
            (ptg.toppingGroup?.toppings || []).map((t) => ({
              name: t.name,
              price: t.price,
              inStoke: true,
            })) || [],
        })) || [],
      creationDate: food.creationDate || new Date().toISOString(),
    });

    setImagePreview(food.image || "");
    setImageFile(null);
    setEditOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function closeEdit() {
    setEditOpen(false);
    setEditingFoodId(null);
    setFoodForm(emptyFoodForm(categories));
    if (imagePreview) { try { URL.revokeObjectURL(imagePreview); } catch {} }
    setImagePreview("");
    setImageFile(null);
  }

  // update food (PUT multipart)
  async function submitUpdateFood(e) {
    e?.preventDefault?.();

    if (!jwt) return alert("Thiếu JWT");
    if (!editingFoodId) return alert("Không có food để cập nhật");

    const payload = {
      name: foodForm.name,
      description: foodForm.description,
      price: Number(foodForm.price),
      foodCategoryId: Number(foodForm.foodCategoryId),
      available: !!foodForm.available,
      ingredientCategoryDTOs: (foodForm.ingredientCategoryDTOs || []).map((cat) => ({
        name: cat.name,
        ingredients: (cat.ingredients || []).map((it) => ({
          name: it.name,
          price: it.price ? Number(it.price) : 0,
          inStoke: it.inStoke ?? true,
        })),
      })),
      creationDate: foodForm.creationDate || new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    try {
      const res = await fetch(`${API_BASE}/update/${editingFoodId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("update food failed", res.status, txt);
        return alert("Cập nhật món thất bại: " + txt);
      }
      alert("Cập nhật món thành công");
      closeEdit();
      fetchFoods(foodPage.page, foodPage.size);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật món");
    }
  }

  // create food
  async function handleAddFood(e) {
    e?.preventDefault?.();

    if (!jwt) return alert("Thiếu JWT");
    if (!foodForm.name?.trim()) return alert("Tên món không được để trống");
    if (!foodForm.price) return alert("Giá không được để trống");
    if (!foodForm.foodCategoryId) return alert("Vui lòng chọn Category cho món ăn");

    const payload = {
      name: foodForm.name,
      description: foodForm.description,
      price: Number(foodForm.price),
      foodCategoryId: Number(foodForm.foodCategoryId),
      available: foodForm.available,
      ingredientCategoryDTOs: foodForm.ingredientCategoryDTOs.map((cat) => ({
        name: cat.name,
        ingredients: (cat.ingredients || []).map((it) => ({
          name: it.name,
          price: it.price ? Number(it.price) : 0,
          inStoke: it.inStoke ?? true,
        })),
      })),
      creationDate: foodForm.creationDate || new Date().toISOString(),
    };

    const formData = new FormData();
    formData.append("data", new Blob([JSON.stringify(payload)], { type: "application/json" }));
    if (imageFile) formData.append("image", imageFile);

    try {
      setCreatingFood(true);
      const res = await fetch(`${API_BASE}/add`, {
        method: "POST",
        headers: { Authorization: `Bearer ${jwt}` },
        body: formData,
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("Lỗi tạo món:", res.status, txt);
        return alert("Tạo món thất bại, xem console để biết chi tiết.");
      }
      alert("Tạo món thành công!");
      setFoodForm(emptyFoodForm(categories));
      setImageFile(null);
      if (imagePreview) { try { URL.revokeObjectURL(imagePreview); } catch {} }
      setImagePreview("");
      fetchFoods(1, foodPage.size);
      fetchCategories();
    } catch (err) {
      console.error("Lỗi gọi API tạo món:", err);
    } finally {
      setCreatingFood(false);
    }
  }

  // toggle available
  async function toggleAvailable(foodId, newAvailable) {
    if (!jwt) return;
    try {
      const res = await fetch(`${API_BASE}/${foodId}/available`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${jwt}` },
        body: JSON.stringify({ available: newAvailable }),
        // cache: 'no-store' // có thể bật nếu nghi ngờ cache
      });

      if (!res.ok) {
        const txt = await res.text();
        console.error("patch available failed", res.status, txt);
        return alert("Cập nhật trạng thái thất bại: " + txt);
      }

      // 1) Cập nhật local state nhanh (immediate)
      setFoods(prev => prev.map(f => f.id === foodId ? { ...f, available: newAvailable } : f));

      // 2) Đồng thời refetch dữ liệu hiện tại (đảm bảo dữ liệu list & paging chính xác)
      await fetchFoods(foodPage.page, foodPage.size);
    } catch (err) {
      console.error(err);
      alert("Lỗi cập nhật trạng thái");
    }
  }


  // delete food
  async function handleDeleteFood(foodId) {
    if (!window.confirm("Xác nhận xóa món này? (Nếu món đã có order sẽ không xóa được)")) return;
    if (!jwt) return;
    try {
      const res = await fetch(`${API_BASE}/${foodId}`, {
        method: "DELETE",
        headers: { ...authHeaders() },
      });
      if (!res.ok) {
        const txt = await res.text();
        console.error("delete food failed", res.status, txt);
        return alert("Xóa thất bại: " + txt);
      }
      alert("Xóa món thành công");
      fetchFoods(foodPage.page, foodPage.size);
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Lỗi xóa món");
    }
  }

  // image handler (shared)
  function handleImageChangeLocal(e) {
    const file = e.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setImagePreview("");
      return;
    }
    setImageFile(file);
    const url = URL.createObjectURL(file);
    setImagePreview((old) => {
      if (old) try { URL.revokeObjectURL(old); } catch {}
      return url;
    });
  }

  // ingredient handlers
  function addIngredientCategoryLocal() {
    setFoodForm((prev) => ({
      ...prev,
      ingredientCategoryDTOs: [...prev.ingredientCategoryDTOs, { name: "", ingredients: [] }],
    }));
  }

  function removeIngredientCategoryLocal(index) {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      copy.splice(index, 1);
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  }

  function handleIngredientCategoryNameChangeLocal(index, value) {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      copy[index] = { ...copy[index], name: value };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  }

  function addIngredientItemLocal(catIndex) {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      const cat = copy[catIndex];
      const newItems = cat.ingredients ? [...cat.ingredients] : [];
      newItems.push({ name: "", price: "", inStoke: true });
      copy[catIndex] = { ...cat, ingredients: newItems };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  }

  function removeIngredientItemLocal(catIndex, itemIndex) {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      const cat = copy[catIndex];
      const newItems = [...(cat.ingredients || [])];
      newItems.splice(itemIndex, 1);
      copy[catIndex] = { ...cat, ingredients: newItems };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  }

  function handleIngredientItemChangeLocal(catIndex, itemIndex, field, value) {
    setFoodForm((prev) => {
      const copy = [...prev.ingredientCategoryDTOs];
      const cat = copy[catIndex];
      const newItems = [...(cat.ingredients || [])];
      newItems[itemIndex] = { ...newItems[itemIndex], [field]: field === "inStoke" ? value : value };
      copy[catIndex] = { ...cat, ingredients: newItems };
      return { ...prev, ingredientCategoryDTOs: copy };
    });
  }

}; // end component

export default MerchantMenu;

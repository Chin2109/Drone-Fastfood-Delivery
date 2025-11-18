import React, { useState, useEffect } from "react";
import axios from "axios";

const RestaurantAddFood = ( {merchantId} ) => {
  const [categories, setCategories] = useState([]);
  const [ingredientCategories, setIngredientCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    available: true,
    image: "",
    food_category_id: "",
    selectedIngredients: []
  });

  // Load categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const catRes = await axios.get(`http://localhost:5454/api/category/restaurant/${merchantId}`);
        setCategories(catRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchData();
  }, [merchantId]);

  // Load ingredient category + items
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const ingCatRes = await axios.get("http://localhost:5454/api/ingredient-category");
        setIngredientCategories(ingCatRes.data);

        const ingItemRes = await axios.get("http://localhost:5454/api/ingredients");
        setIngredients(ingItemRes.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchIngredients();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const toggleIngredient = (id) => {
    setForm((prev) => {
      const exists = prev.selectedIngredients.includes(id);
      return {
        ...prev,
        selectedIngredients: exists
          ? prev.selectedIngredients.filter((item) => item !== id)
          : [...prev.selectedIngredients, id]
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const sendData = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      available: form.available,
      image: form.image,
      food_category_id: form.food_category_id,
      ingredients: form.selectedIngredients
    };

    try {
      await axios.post("http://localhost:5454/api/food", sendData);
      alert("Thêm món ăn thành công!");
    } catch (err) {
      console.error(err);
      alert("Lỗi khi thêm món ăn");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-xl rounded-xl mt-10 text-black bg-white">
      <h2 className="text-3xl font-bold mb-6">Thêm Món Ăn</h2>

      <form className="space-y-4 text-black" onSubmit={handleSubmit}>

        {/* Name */}
        <div>
          <label className="font-semibold block">Tên món</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="font-semibold block">Mô tả</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            rows="3"
            required
          />
        </div>

        {/* Price */}
        <div>
          <label className="font-semibold block">Giá</label>
          <input
            type="number"
            name="price"
            value={form.price}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          />
        </div>

        {/* Category */}
        <div>
          <label className="font-semibold block">Danh mục</label>
          <select
            name="food_category_id"
            value={form.food_category_id}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
            required
          >
            <option value="">Chọn danh mục</option>
            {categories.map((cat) => (
              <option value={cat.id} key={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="font-semibold block">Ảnh (URL)</label>
          <input
            type="text"
            name="image"
            value={form.image}
            onChange={handleChange}
            className="w-full border px-4 py-2 rounded"
          />
        </div>

        {/* Ingredients */}
        <div>
          <h3 className="text-xl font-bold mt-6 mb-2">Nguyên liệu</h3>

          {ingredientCategories.map((category) => (
            <div key={category.id} className="mb-4">
              <p className="font-semibold mb-2">{category.name}</p>

              <div className="grid grid-cols-2 gap-2">
                {ingredients
                  .filter((ing) => ing.category_id === category.id)
                  .map((item) => (
                    <label key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={form.selectedIngredients.includes(item.id)}
                        onChange={() => toggleIngredient(item.id)}
                      />
                      <span>{item.name} (+{item.price}₫)</span>
                    </label>
                  ))}
              </div>
            </div>
          ))}
        </div>

        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700"
        >
          Thêm món ăn
        </button>
      </form>
    </div>
  );
};

export default RestaurantAddFood;
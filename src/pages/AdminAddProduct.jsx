import React, { useState } from "react";
import { adminAPI } from "../services/api";
import { toast } from "react-toastify";
import { UploadCloud, Trash2 } from "lucide-react";

const AdminAddProduct = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    brand: "",
    description: "",
    externalId: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const categories = [
    "men's clothing",
    "women's clothing",
    "electronics",
    "jewelery",
    "footwear",
    "accessories",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreview(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("externalId", formData.externalId);
      formDataToSend.append("name", formData.name);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("description", formData.description);

      if (imageFile) formDataToSend.append("image", imageFile);

      const { data } = await adminAPI.addProduct(formDataToSend);
      toast.success(data.message);

      setFormData({
        name: "",
        price: "",
        category: "",
        brand: "",
        description: "",
        externalId: "",
      });
      setImageFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Add Product Error:", error);
      toast.error(error.response?.data?.message || "Failed to add product");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-xl-10 col-lg-11">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">

              <form onSubmit={handleSubmit}>
                {/* add column spacing here */}
                <div className="row gx-5 gy-4">
                  {/* LEFT COLUMN */}
                  <div className="col-md-6">
                    <div className="mb-3">
                      <label className="form-label fw-semibold">Product Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Price (₹)</label>
                      <input
                        type="number"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="Enter price"
                        required
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Category</label>
                      <select
                        name="category"
                        className="form-select form-select-lg"
                        value={formData.category}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat, index) => (
                          <option key={index} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Brand</label>
                      <input
                        type="text"
                        name="brand"
                        value={formData.brand}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="Enter brand"
                      />
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">External ID</label>
                      <input
                        type="text"
                        name="externalId"
                        value={formData.externalId}
                        onChange={handleChange}
                        className="form-control form-control-lg"
                        placeholder="Unique external ID"
                        required
                      />
                    </div>
                  </div>

                  {/* RIGHT COLUMN */}
                  <div className="col-md-6">
                    <div
                      className={`border border-3 rounded-4 p-5 text-center mb-5 position-relative ${
                        isDragging ? "bg-light border-primary" : "border-secondary"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <div className="mb-2">
                        <UploadCloud size={40} className="text-muted" />
                      </div>
                      <p className="text-muted mb-2 fs-6">
                        Drag & drop product image here or click to upload
                      </p>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="form-control mt-3"
                      />

                      {preview && (
                        <div className="mt-3 position-relative d-inline-block">
                          <img
                            src={preview}
                            alt="Preview"
                            className="img-thumbnail"
                            style={{
                              width: "220px",
                              height: "220px",
                              objectFit: "cover",
                              borderRadius: "12px",
                            }}
                          />
                          <button
                            type="button"
                            className="btn btn-danger btn-sm position-absolute top-0 end-0 m-2 rounded-circle shadow-sm"
                            onClick={removeImage}
                            style={{
                              width: "32px",
                              height: "32px",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label fw-semibold">Description</label>
                      <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={4}
                        className="form-control form-control-lg"
                        placeholder="Enter product description"
                      ></textarea>
                    </div>
                  </div>
                </div>

                <div className="text-end mt-4">
                  <button type="submit" className="btn btn-primary btn-lg px-5 shadow-sm">
                    Add Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAddProduct;

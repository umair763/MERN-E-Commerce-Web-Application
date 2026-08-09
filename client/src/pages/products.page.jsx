import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { ProductsTableResp, ProductsCreateDialogue, ProductsEditDialogue } from "../components/modules/products";
import { UiDelete } from "../common/ui.delete";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const EMPTY_PRODUCT_FORM = {
  name: "",
  sku: "",
  category: "",
  image: null,
  price: "",
  stock: "",
  status: "",
  description: "",
};

export const ProductsPage = () => {
  const { success, error } = useToast();
  const [products, setProducts] = useState([]);

  const [categories, setCategories] = useState([]);

  // ADD STATES

  const [isAddOpen, setIsAddOpen] = useState(false);

  const [addForm, setAddForm] = useState(EMPTY_PRODUCT_FORM);

  const [addErrors, setAddErrors] = useState({});

  const [addLoading, setAddLoading] = useState(false);

  // EDIT STATES

  const [editingProduct, setEditingProduct] = useState(null);

  const [editForm, setEditForm] = useState(EMPTY_PRODUCT_FORM);

  const [editErrors, setEditErrors] = useState({});

  const [editLoading, setEditLoading] = useState(false);

  // DELETE STATE

  const [deletingProduct, setDeletingProduct] = useState(null);

  // ==========================
  // GET ALL PRODUCTS
  // ==========================

  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/products`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setProducts(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  // fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/categories`, {
        method: "GET",
        credentials: "include",
      });

      const result = await response.json();

      if (response.ok) {
        setCategories(result.data || []);
      }
    } catch (error) {
      console.log(error);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  // ==========================
  // ADD PRODUCT
  // ==========================

  const openAdd = () => {
    setAddForm(EMPTY_PRODUCT_FORM);

    setAddErrors({});

    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);

    setAddForm(EMPTY_PRODUCT_FORM);

    setAddErrors({});
  };

  const handleAddChange = (field, value) => {
    setAddForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handleAddSubmit = async () => {
    let errors = {};

    if (!addForm.name) errors.name = "Product name is required";

    if (!addForm.sku) errors.sku = "SKU is required";

    if (!addForm.category) errors.category = "Category is required";

    if (!addForm.price) errors.price = "Price is required";

    if (!addForm.stock) errors.stock = "Stock is required";

    if (!addForm.status) errors.status = "Status is required";

    if (Object.keys(errors).length) {
      setAddErrors(errors);

      return;
    }

    try {
      setAddLoading(true);

      const formData = new FormData();

      formData.append("name", addForm.name);

      formData.append("sku", addForm.sku);

      formData.append("category", addForm.category);

      formData.append("price", addForm.price);

      formData.append("stock", addForm.stock);

      formData.append("status", addForm.status);

      formData.append("description", addForm.description);

      if (addForm.image) {
        formData.append("image", addForm.image);
      }

      const response = await fetch(`${BaseUrl}/api/products`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        await fetchProducts();
        success("Product added successfully!");
        closeAdd();
      } else {
        error(result.message || "Failed to add product");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };

  // ==========================
  // EDIT PRODUCT
  // ==========================

  const openEdit = (product) => {
    setEditingProduct(product);

    setEditForm({
      name: product.name || "",

      sku: product.sku || "",

      category: product.category?._id || "",

      image: product.image || "",

      price: String(product.price || ""),

      stock: String(product.stock || ""),

      status: product.status || "",

      description: product.description || "",
    });

    setEditErrors({});
  };

  const closeEdit = () => {
    setEditingProduct(null);

    setEditForm(EMPTY_PRODUCT_FORM);

    setEditErrors({});
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({
      ...prev,

      [field]: value,
    }));
  };

  const handleEditSubmit = async () => {
    let errors = {};

    if (!editForm.name) errors.name = "Product name is required";

    if (!editForm.sku) errors.sku = "SKU is required";

    if (!editForm.category) errors.category = "Category is required";

    if (!editForm.price) errors.price = "Price is required";

    if (!editForm.stock) errors.stock = "Stock is required";

    if (!editForm.status) errors.status = "Status is required";

    if (Object.keys(errors).length) {
      setEditErrors(errors);

      return;
    }

    try {
      setEditLoading(true);

      const formData = new FormData();

      formData.append("name", editForm.name);

      formData.append("sku", editForm.sku);

      formData.append("category", editForm.category);

      formData.append("price", editForm.price);

      formData.append("stock", editForm.stock);

      formData.append("status", editForm.status);

      formData.append("description", editForm.description);

      if (editForm.image) {
        formData.append("image", editForm.image);
      }

      const response = await fetch(`${BaseUrl}/api/products/${editingProduct._id}`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        await fetchProducts();
        success("Product updated successfully!");
        closeEdit();
      } else {
        error(result.message || "Failed to update product");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEditLoading(false);
    }
  };

  // ==========================
  // DELETE PRODUCT
  // ==========================

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/products/${deletingProduct._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchProducts();
        success("Product deleted successfully!");
      } else {
        error("Failed to delete product");
      }
    } catch (error) {
      console.log(error);
    }

    setDeletingProduct(null);
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Products"]}
          title="Products"
          subtitle="Manage store products"
          buttonLabel="Add Product"
          onButtonClick={openAdd}
        />
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <ProductsCreateDialogue
              isOpen={isAddOpen}
              onClose={closeAdd}
              formData={addForm}
              onChange={handleAddChange}
              errors={addErrors}
              loading={addLoading}
              onSubmit={handleAddSubmit}
              categories={categories}
            />
          </div>
        </div>
      )}

      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <ProductsEditDialogue
              isOpen={true}
              onClose={closeEdit}
              formData={editForm}
              onChange={handleEditChange}
              errors={editErrors}
              loading={editLoading}
              onSubmit={handleEditSubmit}
              categories={categories}
            />
          </div>
        </div>
      )}

      <UiDelete
        open={!!deletingProduct}
        onClose={() => setDeletingProduct(null)}
        onConfirm={handleDeleteConfirm}
        title="Delete Product"
        itemType="product"
        itemName={deletingProduct?.name}
      />

      <ProductsTableResp products={products} onEdit={openEdit} onDelete={setDeletingProduct} />
    </div>
  );
};

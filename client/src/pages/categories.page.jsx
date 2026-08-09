import { useState, useEffect, useCallback } from "react";
import { PageHeader } from "../common";
import { CategoriesTableResp, CategoriesCreateDialogue, CategoriesEditDialogue } from "../components/modules/categories";
import { UiDelete } from "../common/ui.delete";
import { useToast } from "../common";

const BaseUrl = import.meta.env.VITE_API_URL;

const EMPTY_CATEGORY_FORM = {
  name: "",
  description: "",
  status: "",
};

export const CategoriesPage = () => {
  const { success, error } = useToast();
  const [categories, setCategories] = useState([]);

  // ADD STATES
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addForm, setAddForm] = useState(EMPTY_CATEGORY_FORM);
  const [addErrors, setAddErrors] = useState({});
  const [addLoading, setAddLoading] = useState(false);

  // EDIT STATES
  const [editingCategory, setEditingCategory] = useState(null);
  const [editForm, setEditForm] = useState(EMPTY_CATEGORY_FORM);
  const [editErrors, setEditErrors] = useState({});
  const [editLoading, setEditLoading] = useState(false);

  // DELETE STATE
  const [deletingCategory, setDeletingCategory] = useState(null);

  // ==========================
  // GET ALL CATEGORIES
  // ==========================

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
    fetchCategories();
  }, [fetchCategories]);

  // ==========================
  // ADD CATEGORY
  // ==========================

  const openAdd = () => {
    setAddForm(EMPTY_CATEGORY_FORM);
    setAddErrors({});
    setIsAddOpen(true);
  };

  const closeAdd = () => {
    setIsAddOpen(false);
    setAddForm(EMPTY_CATEGORY_FORM);
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

    if (!addForm.name) errors.name = "Category name is required";
    if (!addForm.status) errors.status = "Status is required";

    if (Object.keys(errors).length) {
      setAddErrors(errors);
      return;
    }

    try {
      setAddLoading(true);

      const response = await fetch(`${BaseUrl}/api/categories`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(addForm),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchCategories();
        success("Category added successfully!");
        closeAdd();
      } else {
        error(result.message || "Failed to add category");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setAddLoading(false);
    }
  };

  // ==========================
  // EDIT CATEGORY
  // ==========================

  const openEdit = (category) => {
    setEditingCategory(category);
    setEditForm({
      name: category.name || "",
      description: category.description || "",
      status: category.status || "",
    });
    setEditErrors({});
  };

  const closeEdit = () => {
    setEditingCategory(null);
    setEditForm(EMPTY_CATEGORY_FORM);
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

    if (!editForm.name) errors.name = "Category name is required";
    if (!editForm.status) errors.status = "Status is required";

    if (Object.keys(errors).length) {
      setEditErrors(errors);
      return;
    }

    try {
      setEditLoading(true);

      const response = await fetch(`${BaseUrl}/api/categories/${editingCategory._id}`, {
        method: "PATCH",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      const result = await response.json();

      if (response.ok) {
        await fetchCategories();
        success("Category updated successfully!");
        closeEdit();
      } else {
        error(result.message || "Failed to update category");
      }
    } catch (error) {
      console.log(error);
    } finally {
      setEditLoading(false);
    }
  };

  // ==========================
  // DELETE CATEGORY
  // ==========================

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`${BaseUrl}/api/categories/${deletingCategory._id}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        await fetchCategories();
        success("Category deleted successfully!");
      } else {
        error("Failed to delete category");
      }
    } catch (error) {
      console.log(error);
    }

    setDeletingCategory(null);
  };

  return (
    <div>
      <div className="ml-3 mr-3">
        <PageHeader
          breadcrumbs={["Dashboard", "Categories"]}
          title="Categories"
          subtitle="Manage product categories"
          buttonLabel="Add Category"
          onButtonClick={openAdd}
        />
      </div>

      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <CategoriesCreateDialogue
              isOpen={isAddOpen}
              onClose={closeAdd}
              formData={addForm}
              onChange={handleAddChange}
              errors={addErrors}
              loading={addLoading}
              onSubmit={handleAddSubmit}
            />
          </div>
        </div>
      )}

      {editingCategory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl">
            <CategoriesEditDialogue
              isOpen={!!editingCategory}
              onClose={closeEdit}
              formData={editForm}
              onChange={handleEditChange}
              errors={editErrors}
              loading={editLoading}
              onSubmit={handleEditSubmit}
            />
          </div>
        </div>
      )}

      {deletingCategory && (
        <UiDelete
          open={!!deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onConfirm={handleDeleteConfirm}
          title="Delete Category"
          itemType="category"
          itemName={deletingCategory.name}
        />
      )}

      <div className="ml-3 mr-3">
        <CategoriesTableResp
          categories={categories}
          onEdit={openEdit}
          onDelete={setDeletingCategory}
        />
      </div>
    </div>
  );
};
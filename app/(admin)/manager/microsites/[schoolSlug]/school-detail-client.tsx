"use client";

import React, { useMemo, useState, useCallback } from "react";
import { type ColumnDef } from "@tanstack/react-table";
import { DataTable } from "@/components/dataTable";
import { useStudents } from "@/hooks/useStudents";
import { type StudentRow } from "@/lib/services/student.services";
import { toast } from "react-hot-toast";
import { IconArrowLeft, IconPencil, IconTrash, IconX } from "@tabler/icons-react";
import Link from "next/link";

interface SchoolDetailClientProps {
  schoolSlug: string;
}

const SCHOOL_DISPLAY_NAME: Record<string, string> = {
  nguyenbinhkhiem: "Nguyen Binh Khiem",
  newton: "Newton",
  banmai: "Ban Mai",
};

export default function SchoolDetailClient({ schoolSlug }: SchoolDetailClientProps) {
  const schoolDbName = SCHOOL_DISPLAY_NAME[schoolSlug] || schoolSlug;
  const { students, loading, error, createStudent, updateStudent, deleteStudent } = useStudents(schoolDbName);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentRow | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [formBirthday, setFormBirthday] = useState("");
  const [formMessage, setFormMessage] = useState("");
  const [formIsActive, setFormIsActive] = useState(true);
  const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string }>({});

  // Reset form helper
  const resetForm = () => {
    setFormName("");
    setFormSlug("");
    setFormBirthday("");
    setFormMessage("");
    setFormIsActive(true);
    setFormErrors({});
    setEditingStudent(null);
  };

  // Trigger edit mode
  const handleEdit = useCallback((student: StudentRow) => {
    setEditingStudent(student);
    setFormName(student.name);
    setFormSlug(student.slug);
    setFormBirthday(student.birthday || "");
    setFormMessage(student.message || "");
    setFormIsActive(student.isActive);
    setIsDialogOpen(true);
  }, []);

  // Form validation
  const validateForm = (): boolean => {
    const errors: { name?: string; slug?: string } = {};
    if (!formName.trim()) errors.name = "Tên học sinh không được để trống";
    if (!formSlug.trim()) {
      errors.slug = "Mã ký ức (slug) không được để trống";
    } else if (!/^[a-z0-9-]+$/.test(formSlug.trim())) {
      errors.slug = "Mã slug chỉ được chứa chữ cái viết thường, số và dấu gạch ngang";
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Submit create or edit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setSubmitting(true);

    try {
      if (editingStudent) {
        // Edit student
        await updateStudent(editingStudent.id, {
          name: formName.trim(),
          slug: formSlug.trim(),
          birthday: formBirthday.trim() || null,
          message: formMessage.trim() || null,
          school: schoolDbName,
          isActive: formIsActive,
        });
        toast.success("Cập nhật thông tin học sinh thành công!");
      } else {
        // Create student
        await createStudent({
          name: formName.trim(),
          slug: formSlug.trim(),
          birthday: formBirthday.trim() || null,
          message: formMessage.trim() || null,
          school: schoolDbName,
          isActive: formIsActive,
        });
        toast.success("Thêm mới học sinh thành công!");
      }
      setIsDialogOpen(false);
      resetForm();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Đã xảy ra lỗi, vui lòng thử lại!";
      toast.error(message);
    } finally {
      setSubmitting(false);
    }
  };

  // Delete student handler
  const handleDelete = useCallback(async (id: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa học sinh "${name}" khỏi không gian kỷ niệm này?`)) {
      return;
    }
    try {
      await deleteStudent(id);
      toast.success("Xóa học sinh thành công!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Xóa thất bại!";
      toast.error(message);
    }
  }, [deleteStudent]);

  // Sync slug helper while typing name
  const handleNameChange = (val: string) => {
    setFormName(val);
    if (!editingStudent) {
      // Auto slugify name: 'Nguyễn Văn A' -> 'nguyenvana'
      const slugified = val
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/đ/g, "d")
        .replace(/\s+/g, "")
        .replace(/[^a-z0-9]/g, "");
      setFormSlug(slugified);
    }
  };

  const columns: ColumnDef<StudentRow>[] = useMemo(
    () => [
      {
        accessorKey: "name",
        header: "Họ và tên",
        cell: ({ row }) => (
          <span className="font-semibold text-zinc-900">{row.original.name}</span>
        ),
      },
      {
        accessorKey: "slug",
        header: "Mã ký ức (slug)",
        cell: ({ row }) => (
          <span className="font-mono text-xs text-zinc-700 bg-zinc-100 px-2 py-0.5 rounded">
            {row.original.slug}
          </span>
        ),
      },
      {
        accessorKey: "birthday",
        header: "Ngày sinh",
        cell: ({ row }) => <span>{row.original.birthday || "—"}</span>,
      },
      {
        accessorKey: "message",
        header: "Lời chúc riêng",
        cell: ({ row }) => {
          const msg = row.original.message || "";
          return (
            <span className="text-zinc-500 max-w-[240px] truncate block" title={msg}>
              {msg || "—"}
            </span>
          );
        },
      },
      {
        accessorKey: "isActive",
        header: "Trạng thái",
        cell: ({ row }) => (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              row.original.isActive
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {row.original.isActive ? "Hoạt động" : "Tạm khóa"}
          </span>
        ),
      },
      {
        id: "actions",
        header: "Thao tác",
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEdit(row.original)}
              className="p-1.5 hover:bg-zinc-100 rounded-lg text-zinc-600 hover:text-primary transition-colors cursor-pointer"
              title="Chỉnh sửa"
            >
              <IconPencil size={16} />
            </button>
            <button
              onClick={() => handleDelete(row.original.id, row.original.name)}
              className="p-1.5 hover:bg-red-50 rounded-lg text-zinc-600 hover:text-red-600 transition-colors cursor-pointer"
              title="Xóa"
            >
              <IconTrash size={16} />
            </button>
          </div>
        ),
      },
    ],
    [handleEdit, handleDelete]
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between mt-2">
        <Link
          href="/manager/microsites"
          className="inline-flex items-center gap-1.5 text-sm text-zinc-600 hover:text-zinc-900 transition-colors no-underline font-semibold"
        >
          <IconArrowLeft size={16} />
          Quay lại danh sách trường
        </Link>
      </div>

      {error && (
        <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive shadow-sm">
          {error}
        </div>
      )}

      {/* Main Table view */}
      <DataTable
        data={students.map((std) => ({ ...std, id: std.id }))}
        columns={columns}
        filterKey="name"
        filterPlaceholder="Tìm kiếm học sinh theo tên..."
        showAddButton={true}
        onAdd={() => {
          resetForm();
          setIsDialogOpen(true);
        }}
        addLabel="Thêm học sinh"
        showColumnCustomizer={true}
        showSearch={true}
        showPagination={true}
        selectable={false}
        draggable={false}
        meta={{}}
      />

      {loading && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          Đang tải danh sách học sinh...
        </p>
      )}

      {/* CRUD Dialog overlay */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-2xl border border-zinc-200 shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="px-6 py-4 border-b border-zinc-100 flex justify-between items-center bg-zinc-50/50">
              <h3 className="font-bold text-lg text-zinc-900">
                {editingStudent ? "Cập nhật học sinh" : "Thêm học sinh mới"}
              </h3>
              <button
                onClick={() => setIsDialogOpen(false)}
                className="p-1 hover:bg-zinc-200 rounded-lg text-zinc-400 hover:text-zinc-600 transition-colors cursor-pointer"
              >
                <IconX size={20} />
              </button>
            </div>

            {/* Form body */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700">Tên học sinh</label>
                <input
                  type="text"
                  value={formName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className={`h-10 border rounded-xl px-3 outline-none text-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 ${
                    formErrors.name ? "border-red-500" : "border-zinc-300"
                  }`}
                  placeholder="Ví dụ: Trần Quang Huy"
                  required
                />
                {formErrors.name && (
                  <span className="text-xs text-red-500 font-medium">{formErrors.name}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700">Mã ký ức (slug)</label>
                <input
                  type="text"
                  value={formSlug}
                  onChange={(e) => setFormSlug(e.target.value)}
                  className={`h-10 border rounded-xl px-3 outline-none font-mono text-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 ${
                    formErrors.slug ? "border-red-500" : "border-zinc-300"
                  }`}
                  placeholder="Ví dụ: tranquanghuy"
                  required
                />
                {formErrors.slug && (
                  <span className="text-xs text-red-500 font-medium">{formErrors.slug}</span>
                )}
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700">Ngày sinh (Tùy chọn)</label>
                <input
                  type="text"
                  value={formBirthday}
                  onChange={(e) => setFormBirthday(e.target.value)}
                  className="h-10 border border-zinc-300 rounded-xl px-3 outline-none text-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5"
                  placeholder="Ví dụ: 12/05/2005"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-zinc-700">Lời nhắn / Lời chúc riêng</label>
                <textarea
                  value={formMessage}
                  onChange={(e) => setFormMessage(e.target.value)}
                  rows={3}
                  className="border border-zinc-300 rounded-xl p-3 outline-none text-sm transition-all focus:border-primary/50 focus:ring-4 focus:ring-primary/5 resize-none"
                  placeholder="Nhập lời chúc riêng cá nhân hóa dành riêng cho học sinh này..."
                />
              </div>

              <div className="flex items-center gap-2.5 py-2">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4.5 h-4.5 rounded accent-primary border-zinc-300 cursor-pointer"
                />
                <label htmlFor="formIsActive" className="text-sm font-semibold text-zinc-700 select-none cursor-pointer">
                  Kích hoạt tài khoản học sinh
                </label>
              </div>

              {/* Action buttons */}
              <div className="mt-4 pt-4 border-t border-zinc-100 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                  className="h-10 px-4 rounded-xl border border-zinc-200 hover:bg-zinc-50 text-sm font-bold text-zinc-700 transition-colors cursor-pointer"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="h-10 px-5 rounded-xl bg-primary hover:bg-primary-dark text-white text-sm font-bold shadow-md hover:shadow-lg disabled:opacity-50 transition-all cursor-pointer"
                >
                  {submitting ? "Đang xử lý..." : editingStudent ? "Cập nhật" : "Lưu lại"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

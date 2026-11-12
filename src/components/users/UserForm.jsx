import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Swal from "sweetalert2";
import FormInput from "../ui/FormInput";

const userSchema = z.object({
    name: z.string().trim().min(3, 'Nama minimal 3 karakter'),
    email: z.string().trim().email('Format email tidak valid'),
    phone: z.string().trim().min(9, 'Nomor telepon minimal 9 degit')
    .regex(/^[0-9+\-\s]+$/, 'Hanya angka, +, -, dan spasi'),
    role: z.enum(['admin', 'staff', 'viewer']),
});

const defaultValues = {
    name: '',
    email: '',
    phone: '',
    role: 'staff',
};

export default function UserForm({editingUser, onSubmit, onCancel, submitting}) {
    const {register, handleSubmit, reset, formState: { errors },
    } = useForm({
        resolver: zodResolver(userSchema),
        defaultValues,
    })

    useEffect(() => {
        if (editingUser) {
            reset({
                name: editingUser.name ?? '',
                email: editingUser.data?.email ?? '',
                phone: editingUser.data?.phone ?? '',
                role: editingUser.data?.role ?? 'staff',
            })
        } else {
            reset(defaultValues)
        }
    }, [editingUser, reset])

    const submitForm = handleSubmit(
        async (values) => {
            const saved = await onSubmit(values);
            if (saved) {
                reset(defaultValues)
            }
        },
        () => {
            Swal.fire({
                icon: 'error',
                title: 'Form belum valid',
                text: 'Periksa kembali field',
                confirmButtonColor: '#4f46e5',
            })
        }
    )

    return (
        <form onSubmit={submitForm} noValidate className="space-y-4">
            <FormInput 
                id="name"
                label='Nama Lengkap'
                placeholder='Contoh: Budi Sukejang'
                register={register}
                error={errors.name?.message}
            />
            <FormInput 
                id="email"
                label="Alamat Email"
                placeholder="budi@example.com"
                register={register}
                error={errors.email?.message}
            />
            <FormInput 
                id="phone"
                label="Nomor telepon"
                placeholder="081265348192"
                register={register}
                error={errors.phone?.message}
            />
            <div className="space-y-1.5">
                <label htmlFor="role" className="block text-sm font-medium text-slate-700">
                    Role
                </label>
                <select id="role" {...register('role')}
                className="w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
                    <option value="staff">Staff</option>
                    <option value="admin">Admin</option>
                    <option value="viewer">Viewer</option>
                </select>

                {errors.role && (
                    <p className="text-xs text-red-600">{errors.role.message}</p>
                )}
            </div>

            <div className="flex gap-2 pt-2">
                <button type="submit" disabled={submitting}
                className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50">
                    {submitting ? 'Menyimpan...' : editingUser ? 'Simpan Perubahan' : 'Tambah User'}
                </button>
                {editingUser && (
                    <button type="button" onClick={onCancel}
                    className="rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100">
                        Batal
                    </button>
                )}
            </div>
        </form>
    )
};

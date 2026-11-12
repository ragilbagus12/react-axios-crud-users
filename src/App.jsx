import { useCallback, useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import UserForm from "./components/users/UserForm";
import RoleBadge from "./components/users/RoleBadge";
import LoadingState from "./components/states/LoadingState";
import ErrorState from "./components/states/ErrorState";
import EmptyState from "./components/states/EmptyState";
import NoResultState from "./components/states/NoResultState";
import showToast from "./utils/toast";
import { createUser, deleteUser, getUsers, patchUser, updateUser } from "./services/userService";

export default function App() {
  const [users, setUsers] = useState([]);
  const [searchKeyword, setSearchKeyword] = useState("")
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [patchingId, setPatchingId] = useState(null)
  const filteredUsers = useMemo(() => {
    const keyword = searchKeyword.trim().toLowerCase();

    if (!keyword) return users;

    return users.filter((user) => {
      const searchableKey = [
        user.id,
        user.name,
        user.data?.email,
        user.data?.phone,
        user.data?.role,
      ]
      .filter(Boolean).join(' ').toLowerCase();

      return searchableKey.includes(keyword);
    });
  }, [users, searchKeyword]);
  const syncUsers = useCallback(async ({ withLoading = true, withError = true } = {}) => {
    if (withLoading) {
      setLoading(true)
    } else {
      setError('')
    }

    try {
      const data = await getUsers()
      setUsers(data)
      setError('')
    } catch (err) {
      if (withError) {
        setError(err.message || 'Gagal memuat data')
      } else {
        showToast('error', 'Gagal menyegarkan daftar user.')
      }
    } finally {
      if (withLoading) {
        setLoading(false)
      }
    }
  }, [])

  const loadUsers = useCallback(() => syncUsers({ withLoading: true }), [syncUsers])
  const refreshUsers = useCallback(() => syncUsers({ withLoading: false, withError: false }), [syncUsers])

  useEffect(() => {
    let cancelled = false

    async function fetchInitialUsers() {
      try {
        const data = await getUsers()
        if (!cancelled) setUsers(data)
      } catch (err) {
        if (!cancelled) setError(err.message || 'Gagal memuat data')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchInitialUsers()

    return () => {
      cancelled = true
    }
  }, [])

  async function handleSave(values) {
    setSubmitting(true)
    try {
      const payload = {
        name: values.name,
        data: {
          email: values.email,
          phone: values.phone,
          role: values.role,
        },
      }

      const savedUser = editingUser
        ? await updateUser(editingUser.id, payload)
        : await createUser(payload)

      if (editingUser) {
        setUsers((prev) =>
          prev.map((user) => (user.id === savedUser.id ? savedUser : user))
        )
        showToast('success', 'User berhasil diperbarui.')
        setEditingUser(null)
      } else {
        setUsers((prev) => [savedUser, ...prev])
        showToast('success', 'User berhasil ditambahkan.')
      }

      await refreshUsers()
      return true
    } catch (err) {
      showToast('error', err.message || 'Gagal menyimpan data.')
      return false
    } finally {
      setSubmitting(false)
    }
  }
async function handleDelete(user) {
  const result = await Swal.fire({
    title: 'Hapus user?',
    text: `User "${user.name}" akan dihapus permanen.`,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ya, hapus',
    cancelButtonText: 'Batal',
    confirmButtonColor: '#dc2626',
    cancelButtonColor: '#64748b',
    reverseButtons: true,
  })

  if (!result.isConfirmed) return
  setDeletingId(user.id)
  try {
    await deleteUser(user.id)
    setUsers((prev) => prev.filter((item) => item.id !== user.id))
    if (editingUser?.id === user.id) {
      setEditingUser(null)
    }
    showToast('success', 'User berhasil dihapus.')

    await refreshUsers()
  } catch (err) {
    showToast('error', err.message || 'Gagal menghapus data')
  } finally {
    setDeletingId(null)
  }
}
async function handlePromote(user) {
  setPatchingId(user.id)
  try {
    const updatedUser = await patchUser(user.id, {
      data: {
        ...(user.data ?? {}),
        role: 'admin',
      },
    })
    setUsers((prev) =>
      prev.map((item) => (item.id === updatedUser.id ? updatedUser : item))
    )
    showToast('success', 'Role diubah menjadi admin')

    await refreshUsers()
  } catch (err) {
    showToast('error', err.message || 'Gagal memperbarui role')
  } finally {
    setPatchingId(null)
  }
}

const totalAdmin = users.filter(
  (user) => user.data?.role === 'admin'
).length

return (
  <div className="min-h-screen bg-slate-100 text-slate-900">
    <header className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-4 py-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-400">Materi 3.5 - React JS</span>
          <h1 className="mt-1 text-2xl font-bold sm:text-3xl">KejangDB - Solusi Database</h1>
          <p className="mt-1 text-sm text-slate-400">Website sederhana untuk contoh implementasi materi React Fetch API</p>
        </div>
        <button
          type="button"
          onClick={loadUsers}
          disabled={loading}
          className="w-fit rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Memuat data..." : "Muat ulang"}
        </button>
      </div>
    </header>

    <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 lg:grid-cols-[380px_1fr]">
      <section className="h-fit rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:sticky lg:top-6">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">{editingUser ? "Edit User" : "Tambah User"}</h2>
          <p className="mt-1 text-sm text-slate-500">{editingUser ? "Form ini untuk mengedit semua data." : "Form ini untuk menambah data."}</p>
        </div>
        <UserForm editingUser={editingUser} onSubmit={handleSave} onCancel={() => setEditingUser(null)} submitting={submitting} />
      </section>
      <section className="rounded-2xl border border-slate-200 bg-white shadow-lg">
        <div className="flex flex-col gap-2 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Daftar User</h2>
            <p className="text-sm text-slate-500">
              {searchKeyword.trim()
                ? `${filteredUsers.length} dari ${users.length} user`
                : `${users.length} user`}{''} - {totalAdmin} - admin
            </p>
          </div>
          <span className="w-fit rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">GET /collections/users/objects</span>
        </div>
        <div className="border-b border-slate-200 p-4">
          <div className="relative">
            <svg
              aria-hidden="true"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            <input type="search" value={searchKeyword} onChange={(event) => setSearchKeyword(event.target.value)} placeholder="Cari data siswa..."
            aria-label="Cari User" className="rounded-lg border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-300 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"/>
          </div>
        </div>
        {loading && <LoadingState />}
        {!loading && error && <ErrorState message={error} onRetry={loadUsers} />}
        {!loading && !error && users.length === 0 && <EmptyState />}
        {!loading && !error && users.length > 0 && filteredUsers.length === 0 && (
          <NoResultState 
            query={searchKeyword}
            onClear={() => setSearchKeyword('')} 
          />
        )}
        {!loading && !error && users.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-600">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama</th>
                  <th className="px-5 py-3 font-semibold">Email</th>
                  <th className="px-5 py-3 font-semibold">Telepon</th>
                  <th className="px-5 py-3 font-semibold">Role</th>
                  <th className="px-5 py-3 font-semibold text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={editingUser?.id === user.id ? "bg-indigo-50/60" : "hover:bg-slate-50/70"}>
                    <td className="px-5 py-3">
                      <p className="font-medium text-slate-800">{user.name}</p>
                      <p className="text-xs text-slate-400">ID: {user.id}</p>
                    </td>
                    <td className="px-5 py-3 text-slate-600">{user.data?.email || "-"}</td>
                    <td className="px-5 py-3 text-slate-600">{user.data?.phone || "-"}</td>
                    <td className="px-5 py-3">
                      <RoleBadge role={user.data?.role} />
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex justify-end gap-2">
                        {user.data?.role !== "admin" && (
                          <button
                            type="button"
                            onClick={() => handlePromote(user)}
                            disabled={patchingId === user.id}
                            className="rounded-lg border border-indigo-200 bg-indigo-100 px-2.5 py-1.5 text-xs font-medium text-indigo-700 transition hover:bg-indigo-200 disabled:opacity-60"
                          >
                            {patchingId === user.id ? "..." : "Promosikan"}
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setEditingUser(user)}
                          className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-blue-100"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={deletingId === user.id}
                          className="rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-xs font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-60"
                        >
                          {deletingId === user.id ? "..." : "Hapus"}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </main>
  </div>
);
}
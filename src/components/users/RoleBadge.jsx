export default function RoleBadge({ role }) {
    const palette = {
    admin: 'bg-indigo-100 text-indigo-700',
    staff: 'bg-blue-100 text-blue-700',
    viewer: 'bg-yellow-100 text-yellow-700',
    }

    return (
        <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${palette[role] ?? 'bg-amber-100 text-amber-700'}`}>
            {role || 'Guest'}
        </span>
    )
}
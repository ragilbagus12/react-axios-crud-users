export default function NoResultState({ query, onClear }) {
    return (
        <div className="p-10 text-center">
            <p className="text-lg font-semibold text-slate-800">User tidak ditemukan.</p>
            <p className="mt-1 text-sm text-slate-400">Tidak ada hasil untuk "{query}".</p>
            <button
                type="button"
                onClick={onClear}
                className="mt-4 rounded-lg bg-white text-sm border border-slate-200 font-semibold text-slate-800 transition hover:bg-blue-100"
            >
                Reset Pencarian
            </button>
        </div>
    );
}

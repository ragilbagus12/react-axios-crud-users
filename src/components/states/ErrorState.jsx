export default function ErrorState({ message, onRetry }) {
    return (
        <div className="p-5">
            <div className="rounded-xl border border-red-200 bg-red-50 p-4">
                <p className="font-semibold text-red-700">Gagal memuat data</p>
                <p className="mt-1 text-sm text-red-700">{message}</p>
                <button
                    type="button"
                    onClick={onRetry}
                    className="mt-3 rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                    Coba Lagi
                </button>
            </div>
        </div>
    );
}

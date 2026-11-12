export default function LoadingState() {
    return (
        <div className="space-y-3 p-5">
            {[1, 2, 3].map((item) => (
                <div key={item} className="h-14 animate-pulse rounded-xl bg-slate-100" />
            ))}
        </div>
    );
}
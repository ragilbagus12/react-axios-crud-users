export default function FormInput({ 
    id, 
    label, 
    type = 'text', 
    placeholder, 
    register, 
    error, 
    ...rest 
}) {
    return (
        <div className="space-y-1.5">
            <label htmlFor={id} className="block text-sm font-medium text-slate-700">
                {label}
            </label>

            <input 
            id={id} 
            type={type} 
            placeholder={placeholder} 
            {...register(id)} 
            {...rest} 
            aria-invalid={error ? 'true' : 'false'}
            className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:ring-2
            ${error ? 'border-red-400 focus:border-red-500 focus:ring-red-300' : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-400'}`}
            />

            {error && <p className="text-xs text-red-600">{error}</p>}
        </div>
    )
}
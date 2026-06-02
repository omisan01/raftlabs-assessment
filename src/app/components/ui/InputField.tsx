import { forwardRef, InputHTMLAttributes } from 'react';
import { FieldError } from 'react-hook-form';

interface InputFieldProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: FieldError | undefined;
}

export const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
    ({ label, error, type = 'text', ...props }, ref) => {
        return (
            <div className="space-y-1">
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-1">
                    {label}
                </label>
                <input
                    ref={ref}
                    type={type}
                    {...props}
                    className={`w-full px-4 py-3 rounded-xl border bg-gray-50/50 text-sm focus:outline-none focus:ring-2 transition-all ${error
                        ? 'border-red-400 focus:ring-red-100 focus:border-red-500'
                        : 'border-gray-200 focus:ring-orange-100 focus:border-orange-500'
                        }`}
                />
                {error && (
                    <p className="text-red-500 text-xs mt-1 font-medium animate-in fade-in slide-in-from-top-1 duration-150">
                        {error.message}
                    </p>
                )}
            </div>
        );
    }
);

InputField.displayName = 'InputField';
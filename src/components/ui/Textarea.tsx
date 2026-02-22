import { TextareaHTMLAttributes } from "react";

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export function Textarea({ label, error, className = "", id, ...props }: TextareaProps) {
  const textareaId = id || label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="space-y-1">
      {label && (
        <label htmlFor={textareaId} className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <textarea
        id={textareaId}
        className={`w-full rounded-lg border px-3 py-2 text-sm outline-none transition-colors focus:border-black focus:ring-1 focus:ring-black ${
          error ? "border-red-500" : "border-gray-300"
        } ${className}`}
        rows={10}
        {...props}
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}

"use client";

import { AdminButton, AdminInput, AdminTextarea } from "@/components/ui/admin-input";

interface ArrayInputProps {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
  textarea?: boolean;
}

export function ArrayInput({ value, onChange, placeholder, textarea }: ArrayInputProps) {
  const items = value ?? [];
  return (
    <div className="space-y-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-start gap-2">
          {textarea ? (
            <AdminTextarea
              rows={2}
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const arr = [...items];
                arr[i] = e.target.value;
                onChange(arr);
              }}
              className="flex-1"
            />
          ) : (
            <AdminInput
              value={item}
              placeholder={placeholder}
              onChange={(e) => {
                const arr = [...items];
                arr[i] = e.target.value;
                onChange(arr);
              }}
              className="flex-1"
            />
          )}
          <AdminButton variant="ghost" onClick={() => onChange(items.filter((_, j) => j !== i))}>
            ×
          </AdminButton>
        </div>
      ))}
      <AdminButton variant="secondary" onClick={() => onChange([...items, ""])}>
        + Add
      </AdminButton>
    </div>
  );
}

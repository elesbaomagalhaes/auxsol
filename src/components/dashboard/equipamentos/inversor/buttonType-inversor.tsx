"use client";

import { FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Label } from "@/components/ui/label";

type Option = {
  label: string;
  value: string;
};

interface RadioCardGroupProps {
  name: string;
  control: any;
  options: Option[];
  label?: string;
}

export function ButtonTypeInversor({
  name,
  control,
  options,
  label,
}: RadioCardGroupProps) {
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && (
            <Label className="block mb-2 text-sm font-medium text-gray-700">
              {label} - {field.value || "Não selecionado"}
            </Label>
          )}
          <FormControl>
            <div className="flex gap-4">
              {options.map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    field.value === option.value
                      ? "border-stone-700 bg-white"
                      : "border-gray-200 bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  <input
                    type="radio"
                    value={option.value}
                    name={field.name}
                    checked={field.value === option.value}
                    onChange={() => field.onChange(option.value)}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center gap-2">
                    <span className="text-sm font-medium text-gray-900">
                      {option.label}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
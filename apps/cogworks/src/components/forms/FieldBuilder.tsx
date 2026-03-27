import type { CustomField } from "@/types/tickets";
import { Button, Input } from "@ninsys/ui/components";
import { ChevronDown, ChevronUp, Pencil, Plus, Trash2 } from "lucide-react";
import { useRef, useState } from "react";

let fieldKeyCounter = 0;
function nextFieldKey(): string {
  return `fld-${++fieldKeyCounter}-${Date.now()}`;
}

function ensureKey(field: CustomField): CustomField {
  if (field._key) return field;
  return { ...field, _key: nextFieldKey() };
}

interface FieldBuilderProps {
  fields: CustomField[];
  onChange: (fields: CustomField[]) => void;
  maxFields?: number;
  disabled?: boolean;
}

export function FieldBuilder({
  fields,
  onChange,
  maxFields = 5,
  disabled,
}: FieldBuilderProps) {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  // Ensure all fields have stable keys on first render
  const hasInitialized = useRef(false);
  if (!hasInitialized.current && fields.length > 0) {
    const needsKeys = fields.some((f) => !f._key);
    if (needsKeys) {
      hasInitialized.current = true;
      const keyed = fields.map(ensureKey);
      queueMicrotask(() => onChange(keyed));
    } else {
      hasInitialized.current = true;
    }
  }

  const addField = () => {
    if (fields.length >= maxFields) return;
    const newField: CustomField = {
      _key: nextFieldKey(),
      label: `Field ${fields.length + 1}`,
      placeholder: "",
      style: "short",
      required: false,
      minLength: null,
      maxLength: null,
    };
    onChange([...fields, newField]);
    setExpandedIndex(fields.length);
  };

  const updateField = (index: number, update: Partial<CustomField>) => {
    const updated = [...fields];
    const existing = updated[index];
    if (existing) {
      updated[index] = { ...existing, ...update };
      onChange(updated);
    }
  };

  const removeField = (index: number) => {
    onChange(fields.filter((_, i) => i !== index));
    setExpandedIndex(null);
  };

  const moveField = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= fields.length) return;
    const updated = [...fields];
    const temp = updated[index];
    const other = updated[target];
    if (temp && other) {
      updated[index] = other;
      updated[target] = temp;
      onChange(updated);
      // Track expanded field across moves
      if (expandedIndex === index) {
        setExpandedIndex(target);
      } else if (expandedIndex === target) {
        setExpandedIndex(index);
      }
    }
  };

  if (fields.length === 0) {
    return (
      <div className="text-center py-8 border border-dashed border-border rounded-lg">
        <p className="text-sm text-muted-foreground mb-3">
          No fields yet. Add a field to get started.
        </p>
        <Button variant="outline" onClick={addField} disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Add Field
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {fields.map((field, i) => (
        <div
          key={field._key ?? `field-${i}`}
          className="rounded-lg border border-border overflow-visible"
        >
          {/* Header */}
          <div className="flex items-center gap-2 px-3 py-2 bg-muted/30">
            <div className="flex flex-col gap-0.5 flex-shrink-0">
              <button
                type="button"
                onClick={() => moveField(i, -1)}
                disabled={i === 0 || disabled}
                className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                aria-label="Move up"
              >
                <ChevronUp className="h-3 w-3" />
              </button>
              <button
                type="button"
                onClick={() => moveField(i, 1)}
                disabled={i === fields.length - 1 || disabled}
                className="p-0.5 rounded hover:bg-muted disabled:opacity-30"
                aria-label="Move down"
              >
                <ChevronDown className="h-3 w-3" />
              </button>
            </div>
            <span className="text-sm font-medium flex-1 truncate">
              {field.label}
            </span>
            <span className="text-xs text-muted-foreground">
              {field.style === "short" ? "Short" : "Paragraph"}
            </span>
            {field.required && (
              <span className="text-xs text-destructive">Required</span>
            )}
            <button
              type="button"
              onClick={() => setExpandedIndex(expandedIndex === i ? null : i)}
              className="p-1 rounded hover:bg-muted text-muted-foreground"
              aria-label={expandedIndex === i ? "Close editor" : "Edit field"}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => removeField(i)}
              disabled={disabled}
              className="p-1 rounded hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
              aria-label="Delete field"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>

          {/* Expanded editor */}
          {expandedIndex === i && (
            <div className="p-3 space-y-3 border-t border-border">
              <div>
                <label className="text-xs font-medium">Label</label>
                <Input
                  value={field.label}
                  onChange={(e) => updateField(i, { label: e.target.value })}
                  disabled={disabled}
                  className="mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-medium">Placeholder</label>
                <Input
                  value={field.placeholder ?? ""}
                  onChange={(e) =>
                    updateField(i, { placeholder: e.target.value })
                  }
                  disabled={disabled}
                  className="mt-1"
                />
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={field.style === "short"}
                    onChange={() => updateField(i, { style: "short" })}
                    disabled={disabled}
                  />
                  Short text
                </label>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={field.style === "paragraph"}
                    onChange={() => updateField(i, { style: "paragraph" })}
                    disabled={disabled}
                  />
                  Paragraph
                </label>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={field.required}
                  onChange={(e) =>
                    updateField(i, { required: e.target.checked })
                  }
                  disabled={disabled}
                />
                Required
              </label>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-xs font-medium">Min Length</label>
                  <Input
                    type="number"
                    value={field.minLength ?? ""}
                    onChange={(e) =>
                      updateField(i, {
                        minLength:
                          e.target.value !== "" ? Number(e.target.value) : null,
                      })
                    }
                    disabled={disabled}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-medium">Max Length</label>
                  <Input
                    type="number"
                    value={field.maxLength ?? ""}
                    onChange={(e) =>
                      updateField(i, {
                        maxLength:
                          e.target.value !== "" ? Number(e.target.value) : null,
                      })
                    }
                    disabled={disabled}
                    className="mt-1"
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <Button
        variant="outline"
        onClick={addField}
        disabled={disabled || fields.length >= maxFields}
        className="w-full"
      >
        <Plus className="h-4 w-4 mr-2" />
        Add Field ({fields.length}/{maxFields})
      </Button>
    </div>
  );
}

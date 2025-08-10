import { ChangeEvent } from "react";
import { Box, Checkbox, FormControl, FormControlLabel, FormHelperText, FormLabel, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material";
import { FormField } from "@/types/form";

export interface FieldRendererProps {
  field: FormField;
  value: any;
  onChange: (val: any) => void;
  error?: string;
  disabled?: boolean;
}

export function validateFieldValue(field: FormField, value: any): string | undefined {
  const v = field.validations || {};
  const str = value ?? "";

  if (v.required) {
    const empty = field.type === "checkbox" ? value !== true && value !== false && !value : String(str).trim().length === 0;
    if (empty) return `${field.label} is required`;
  }

  if (v.minLength !== undefined && typeof str === "string" && str.length < v.minLength) {
    return `${field.label} must be at least ${v.minLength} characters`;
  }
  if (v.maxLength !== undefined && typeof str === "string" && str.length > v.maxLength) {
    return `${field.label} must be at most ${v.maxLength} characters`;
  }
  if (v.email && typeof str === "string") {
    const re = /[^\s@]+@[^\s@]+\.[^\s@]+/;
    if (str && !re.test(str)) return `Enter a valid email`;
  }
  if (v.passwordStrength && typeof str === "string") {
    const hasLen = str.length >= 8;
    const hasNum = /\d/.test(str);
    if (str && !(hasLen && hasNum)) return `Password must be >= 8 chars and include a number`;
  }
  return undefined;
}

export default function FieldRenderer({ field, value, onChange, error, disabled }: FieldRendererProps) {
  const commonProps = {
    disabled,
    error: Boolean(error),
    helperText: error,
    fullWidth: true,
  } as const;

  switch (field.type) {
    case "text":
      return <TextField label={field.label} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...commonProps} />;
    case "number":
      return <TextField type="number" label={field.label} value={value ?? ""} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} {...commonProps} />;
    case "textarea":
      return <TextField label={field.label} value={value ?? ""} onChange={(e) => onChange(e.target.value)} multiline minRows={3} {...commonProps} />;
    case "select":
      return (
        <FormControl fullWidth error={Boolean(error)} disabled={disabled}>
          <FormLabel>{field.label}</FormLabel>
          <Select value={value ?? ""} onChange={(e) => onChange(e.target.value)} displayEmpty>
            <MenuItem value=""><em>Select...</em></MenuItem>
            {"options" in field && field.options?.map(opt => (
              <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
            ))}
          </Select>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      );
    case "radio":
      return (
        <FormControl error={Boolean(error)} disabled={disabled}>
          <FormLabel>{field.label}</FormLabel>
          <RadioGroup value={value ?? ""} onChange={(e: ChangeEvent<HTMLInputElement>) => onChange(e.target.value)}>
            {"options" in field && field.options?.map(opt => (
              <FormControlLabel key={opt.value} value={opt.value} control={<Radio />} label={opt.label} />
            ))}
          </RadioGroup>
          {error && <FormHelperText>{error}</FormHelperText>}
        </FormControl>
      );
    case "checkbox":
      return (
        <Box>
          <FormControlLabel control={<Checkbox disabled={disabled} checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} />} label={field.label} />
          {error && <FormHelperText error>{error}</FormHelperText>}
        </Box>
      );
    case "date":
      return <TextField type="date" label={field.label} value={value ?? ""} onChange={(e) => onChange(e.target.value)} {...commonProps} InputLabelProps={{ shrink: true }} />;
    default:
      return null;
  }
}

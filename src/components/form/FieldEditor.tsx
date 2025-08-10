import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, InputLabel, MenuItem, Select, Stack, Switch, TextField, Typography, Chip } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store";
import { updateField } from "@/store/builderSlice";
import { FormField, FieldType } from "@/types/form";

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
];

export default function FieldEditor({ field }: { field: FormField }) {
  const dispatch = useAppDispatch();
  const fields = useAppSelector((s) => s.builder.schema.fields);

  const update = (changes: Partial<FormField>) =>
    dispatch(updateField({ id: field.id, changes }));

  const isOptionsType = field.type === "select" || field.type === "radio";

  return (
    <Box>
      <Typography variant="h6" gutterBottom>Field Settings</Typography>
      <Stack spacing={2}>
        <FormControl fullWidth>
          <InputLabel id="type-label">Type</InputLabel>
          <Select labelId="type-label" label="Type" value={field.type} disabled>
            {fieldTypes.map((t) => (
              <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField label="Label" value={field.label} onChange={(e) => update({ label: e.target.value })} fullWidth />
        <TextField label="Key (used in formulas)" value={field.key} onChange={(e) => update({ key: e.target.value })} fullWidth />

        {field.type === "checkbox" ? (
          <FormControlLabel control={<Switch checked={Boolean(field.defaultValue)} onChange={(e) => update({ defaultValue: e.target.checked })} />} label="Default Checked" />
        ) : (
          <TextField label="Default Value" value={field.defaultValue ?? ""} onChange={(e) => update({ defaultValue: e.target.value })} fullWidth />
        )}

        {isOptionsType && (
          <TextField
            label="Options (comma separated)"
            value={("options" in field && field.options?.map(o => o.label).join(", ")) || ""}
            onChange={(e) => {
              const parts = e.target.value.split(",").map(s => s.trim()).filter(Boolean);
              update({ ...(field as any), options: parts.map((p, i) => ({ label: p, value: p.toLowerCase().replace(/\s+/g, "_") + "_" + i })) });
            }}
            fullWidth
          />
        )}

        <Typography variant="subtitle1">Validations</Typography>
        <FormGroup>
          <FormControlLabel control={<Checkbox checked={!!field.validations?.required} onChange={(e) => update({ validations: { ...field.validations, required: e.target.checked } })} />} label="Required" />
          <Stack direction="row" spacing={2}>
            <TextField type="number" label="Min Length" value={field.validations?.minLength ?? ""} onChange={(e) => update({ validations: { ...field.validations, minLength: e.target.value ? Number(e.target.value) : undefined } })} />
            <TextField type="number" label="Max Length" value={field.validations?.maxLength ?? ""} onChange={(e) => update({ validations: { ...field.validations, maxLength: e.target.value ? Number(e.target.value) : undefined } })} />
          </Stack>
          <FormControlLabel control={<Checkbox checked={!!field.validations?.email} onChange={(e) => update({ validations: { ...field.validations, email: e.target.checked } })} />} label="Email format" />
          <FormControlLabel control={<Checkbox checked={!!field.validations?.passwordStrength} onChange={(e) => update({ validations: { ...field.validations, passwordStrength: e.target.checked } })} />} label="Password rule (>=8 chars & number)" />
        </FormGroup>

        <Typography variant="subtitle1">Derived Field</Typography>
        <FormGroup>
          <FormControlLabel control={<Switch checked={!!field.derived?.enabled} onChange={(e) => update({ derived: { enabled: e.target.checked, parentKeys: field.derived?.parentKeys ?? [], formula: field.derived?.formula ?? "" } })} />} label="Enable derived value" />
          {field.derived?.enabled && (
            <>
              <FormControl fullWidth>
                <InputLabel id="parents-label">Parent Fields</InputLabel>
                <Select
                  labelId="parents-label"
                  multiple
                  value={field.derived.parentKeys}
                  label="Parent Fields"
                  onChange={(e) => update({ derived: { ...field.derived!, parentKeys: e.target.value as string[] } })}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {(selected as string[]).map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
                >
                  {fields.filter(f => f.id !== field.id).map((f) => (
                    <MenuItem key={f.id} value={f.key}>{f.label} ({f.key})</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField label="Formula" value={field.derived.formula} onChange={(e) => update({ derived: { ...field.derived!, formula: e.target.value } })} fullWidth helperText="Use keys in expression. Helpers: today(), toDate(s), yearsBetween(a,b), concat(a,b), len(s)" />
            </>
          )}
        </FormGroup>
      </Stack>
    </Box>
  );
}

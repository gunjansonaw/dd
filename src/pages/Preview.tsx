import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Button, Container, Stack, Typography } from "@mui/material";
import { useAppSelector } from "@/store";
import FieldRenderer, { validateFieldValue } from "@/components/form/FieldRenderer";
import { FormField } from "@/types/form";
import { Parser } from "expr-eval";

function toDate(input: any): Date | null { try { return input ? new Date(input) : null; } catch { return null; } }
function yearsBetween(a: any, b: any) { const d1 = toDate(a)?.getTime(); const d2 = toDate(b)?.getTime(); if (!d1 || !d2) return 0; return Math.floor((Math.abs(d1 - d2)) / (1000 * 60 * 60 * 24 * 365.25)); }
function today() { return new Date(); }

const parser = new Parser({ operators: { logical: true, comparison: true, concatenate: true } });

function computeDerived(fields: FormField[], values: Record<string, any>): Record<string, any> {
  const ctxBase: Record<string, any> = { ...values, today, toDate: (s: any) => toDate(s), yearsBetween, concat: (a: any, b: any) => `${a ?? ''}${b ?? ''}`, len: (s: any) => String(s ?? '').length };
  const result = { ...values };
  // Evaluate in sequence; for more complex graphs we could topologically sort by parentKeys
  for (const f of fields) {
    if (f.derived?.enabled && f.derived.formula) {
      try {
        const expr = parser.parse(f.derived.formula);
        const val = expr.evaluate(ctxBase);
        result[f.key] = val;
      } catch (e) {
        // ignore evaluation errors in preview
      }
    }
  }
  return result;
}

export default function Preview() {
  const schema = useAppSelector((s) => s.builder.schema);
  const [values, setValues] = useState<Record<string, any>>({});
  const [errors, setErrors] = useState<Record<string, string | undefined>>({});

  const fields = schema.fields;

  useEffect(() => {
    // Initialize values from defaults
    const init: Record<string, any> = {};
    for (const f of fields) init[f.key] = f.defaultValue ?? (f.type === 'checkbox' ? false : '');
    setValues((prev) => ({ ...init, ...prev }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.map(f => f.id).join(',')]);

  const derivedValues = useMemo(() => computeDerived(fields, values), [fields, values]);

  useEffect(() => { setValues(derivedValues); }, [derivedValues]);

  const onFieldChange = (key: string, val: any, field: FormField) => {
    const copy = { ...values, [key]: val };
    setValues(copy);
    const err = validateFieldValue(field, val);
    setErrors((e) => ({ ...e, [key]: err }));
  };

  const validateAll = () => {
    const nextErrors: Record<string, string | undefined> = {};
    for (const f of fields) {
      nextErrors[f.key] = validateFieldValue(f, values[f.key]);
    }
    setErrors(nextErrors);
  };

  return (
    <>
      <Helmet>
        <title>Preview Form | Dynamic Form Builder</title>
        <meta name="description" content="Preview and interact with your dynamic form including validations and derived fields." />
        <link rel="canonical" href="/preview" />
      </Helmet>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Stack spacing={3}>
          <Typography variant="h5">Form Preview</Typography>
          {fields.length === 0 ? (
            <Typography color="text.secondary">No fields to preview. Create a form first.</Typography>
          ) : (
            <Stack spacing={2}>
              {fields.map((f) => (
                <Box key={f.id}>
                  <FieldRenderer
                    field={f}
                    value={values[f.key]}
                    onChange={(v) => onFieldChange(f.key, v, f)}
                    error={errors[f.key]}
                    disabled={!!f.derived?.enabled}
                  />
                </Box>
              ))}
              <Stack direction="row" justifyContent="flex-end" sx={{ pt: 2 }}>
                <Button variant="contained" onClick={validateAll}>Validate All</Button>
              </Stack>
            </Stack>
          )}
        </Stack>
      </Container>
    </>
  );
}

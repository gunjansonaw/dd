import { useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Box, Button, Container, Dialog, DialogActions, DialogContent, DialogTitle, Divider, IconButton, List, ListItem, ListItemButton, ListItemText, Menu, MenuItem, Stack, TextField, Typography } from "@mui/material";
import Grid from "@mui/material/Grid2";
import { Add, ArrowDownward, ArrowUpward, Delete } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "@/store";
import { addField, deleteField, moveField, selectField } from "@/store/builderSlice";
import FieldEditor from "@/components/form/FieldEditor";
import type { FieldType, FormSchema } from "@/types/form";
import { saveForm } from "@/store/formsSlice";
import { toast } from "sonner";

const fieldTypes: { value: FieldType; label: string }[] = [
  { value: "text", label: "Text" },
  { value: "number", label: "Number" },
  { value: "textarea", label: "Textarea" },
  { value: "select", label: "Select" },
  { value: "radio", label: "Radio" },
  { value: "checkbox", label: "Checkbox" },
  { value: "date", label: "Date" },
];

const genId = () => Math.random().toString(36).slice(2, 9);

export default function CreateForm() {
  const dispatch = useAppDispatch();
  const schema = useAppSelector((s) => s.builder.schema);
  const selectedId = useAppSelector((s) => s.builder.selectedFieldId);
  const selected = useMemo(() => schema.fields.find((f) => f.id === selectedId), [schema.fields, selectedId]);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [saveOpen, setSaveOpen] = useState(false);
  const [formName, setFormName] = useState("");

  const openMenu = (e: React.MouseEvent<HTMLButtonElement>) => setAnchorEl(e.currentTarget);
  const closeMenu = () => setAnchorEl(null);

  const onAdd = (type: FieldType) => {
    dispatch(addField(type));
    closeMenu();
  };

  const onSave = () => {
    if (schema.fields.length === 0) {
      toast.error("Add at least one field before saving");
      return;
    }
    setSaveOpen(true);
  };

  const confirmSave = () => {
    const toSave: FormSchema = {
      id: genId(),
      name: formName || "Untitled Form",
      createdAt: new Date().toISOString(),
      fields: schema.fields,
    };
    dispatch(saveForm(toSave));
    setSaveOpen(false);
    setFormName("");
    toast.success("Form saved to My Forms");
  };

  return (
    <>
      <Helmet>
        <title>Create Form | Dynamic Form Builder</title>
        <meta name="description" content="Create dynamic forms with fields, validations, and derived logic." />
        <link rel="canonical" href="/create" />
      </Helmet>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
          <Typography variant="h5">Form Builder</Typography>
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" startIcon={<Add />} onClick={openMenu}>Add Field</Button>
            <Button variant="contained" onClick={onSave}>Save Form</Button>
          </Stack>
        </Stack>
        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={closeMenu}>
          {fieldTypes.map((t) => (
            <MenuItem key={t.value} onClick={() => onAdd(t.value)}>{t.label}</MenuItem>
          ))}
        </Menu>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Box sx={{ border: "1px solid hsl(var(--border))", borderRadius: 2, p: 2 }}>
              <Typography variant="subtitle1" gutterBottom>Fields</Typography>
              <Divider sx={{ mb: 1 }} />
              <List>
                {schema.fields.map((f, idx) => (
                  <ListItem key={f.id} disableGutters secondaryAction={
                    <>
                      <IconButton size="small" onClick={() => dispatch(moveField({ id: f.id, direction: "up" }))} disabled={idx === 0}><ArrowUpward fontSize="small" /></IconButton>
                      <IconButton size="small" onClick={() => dispatch(moveField({ id: f.id, direction: "down" }))} disabled={idx === schema.fields.length - 1}><ArrowDownward fontSize="small" /></IconButton>
                      <IconButton edge="end" onClick={() => dispatch(deleteField(f.id))}><Delete /></IconButton>
                    </>
                  }>
                    <ListItemButton selected={selectedId === f.id} onClick={() => dispatch(selectField(f.id))}>
                      <ListItemText primary={`${f.label}`} secondary={`${f.type} • ${f.key}`} />
                    </ListItemButton>
                  </ListItem>
                ))}
                {schema.fields.length === 0 && (
                  <Typography color="text.secondary" sx={{ px: 2, py: 1 }}>No fields yet. Click "Add Field" to get started.</Typography>
                )}
              </List>
            </Box>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <Box sx={{ border: "1px solid hsl(var(--border))", borderRadius: 2, p: 2, minHeight: 320 }}>
              {selected ? (
                <FieldEditor field={selected} />
              ) : (
                <Typography color="text.secondary">Select a field to edit its settings.</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={saveOpen} onClose={() => setSaveOpen(false)}>
        <DialogTitle>Save Form</DialogTitle>
        <DialogContent>
          <TextField autoFocus margin="dense" label="Form Name" fullWidth value={formName} onChange={(e) => setFormName(e.target.value)} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSaveOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={confirmSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

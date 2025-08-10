import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormField, FormSchema, FieldType } from "@/types/form";

export interface BuilderState {
  schema: FormSchema;
  selectedFieldId?: string;
}

const genId = () => Math.random().toString(36).slice(2, 9);

const emptySchema = (): FormSchema => ({ id: "current", createdAt: new Date().toISOString(), fields: [] });

const createField = (type: FieldType): FormField => {
  const id = genId();
  const base = {
    id,
    key: `field_${id}`,
    type,
    label: `${type[0].toUpperCase() + type.slice(1)} Field`,
    validations: { required: false },
    derived: { enabled: false, parentKeys: [], formula: "" },
  } as any;
  if (["select", "radio"].includes(type)) base.options = [
    { label: "Option 1", value: "option1" },
    { label: "Option 2", value: "option2" },
  ];
  if (type === "checkbox") base.defaultValue = false;
  return base as FormField;
};

const initialState: BuilderState = {
  schema: emptySchema(),
  selectedFieldId: undefined,
};

const builderSlice = createSlice({
  name: "builder",
  initialState,
  reducers: {
    reset: (state) => {
      state.schema = emptySchema();
      state.selectedFieldId = undefined;
    },
    setSchema: (state, action: PayloadAction<FormSchema>) => {
      state.schema = { ...action.payload };
      state.selectedFieldId = state.schema.fields[0]?.id;
    },
    addField: (state, action: PayloadAction<FieldType>) => {
      const f = createField(action.payload);
      state.schema.fields.push(f);
      state.selectedFieldId = f.id;
    },
    updateField: (
      state,
      action: PayloadAction<{ id: string; changes: Partial<FormField> }>
    ) => {
      const idx = state.schema.fields.findIndex((f) => f.id === action.payload.id);
      if (idx >= 0) {
        state.schema.fields[idx] = {
          ...state.schema.fields[idx],
          ...action.payload.changes,
        } as FormField;
      }
    },
    deleteField: (state, action: PayloadAction<string>) => {
      const idx = state.schema.fields.findIndex((f) => f.id === action.payload);
      if (idx >= 0) {
        state.schema.fields.splice(idx, 1);
        state.selectedFieldId = state.schema.fields[idx]?.id || state.schema.fields[idx - 1]?.id;
      }
    },
    moveField: (
      state,
      action: PayloadAction<{ id: string; direction: "up" | "down" }>
    ) => {
      const { id, direction } = action.payload;
      const idx = state.schema.fields.findIndex((f) => f.id === id);
      if (idx < 0) return;
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      if (newIdx < 0 || newIdx >= state.schema.fields.length) return;
      const arr = state.schema.fields;
      const [moved] = arr.splice(idx, 1);
      arr.splice(newIdx, 0, moved);
    },
    selectField: (state, action: PayloadAction<string | undefined>) => {
      state.selectedFieldId = action.payload;
    },
  },
});

export const { reset, setSchema, addField, updateField, deleteField, moveField, selectField } = builderSlice.actions;
export default builderSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FormSchema, LOCAL_STORAGE_KEY } from "@/types/form";

export interface FormsState {
  forms: FormSchema[];
}

function loadForms(): FormSchema[] {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FormSchema[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function persist(forms: FormSchema[]) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(forms));
  } catch {}
}

const initialState: FormsState = {
  forms: loadForms(),
};

const formsSlice = createSlice({
  name: "forms",
  initialState,
  reducers: {
    saveForm: (state, action: PayloadAction<FormSchema>) => {
      const idx = state.forms.findIndex((f) => f.id === action.payload.id);
      if (idx >= 0) state.forms[idx] = action.payload;
      else state.forms.unshift(action.payload);
      persist(state.forms);
    },
    deleteForm: (state, action: PayloadAction<string>) => {
      state.forms = state.forms.filter((f) => f.id !== action.payload);
      persist(state.forms);
    },
    clearAllForms: (state) => {
      state.forms = [];
      persist(state.forms);
    },
  },
});

export const { saveForm, deleteForm, clearAllForms } = formsSlice.actions;
export default formsSlice.reducer;

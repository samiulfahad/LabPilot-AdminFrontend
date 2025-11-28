import { create } from "zustand";
import { schemaSlice } from "./schemaSlice";
import { uiSlice } from "./uiSlice";
import { formSlice } from "./formSlice";
import { selectionSlice } from "./selectionSlice";

export const useSchemaBuilderStore = create((set, get) => ({
  ...schemaSlice(set, get),
  ...uiSlice(set, get),
  ...formSlice(set, get),
  ...selectionSlice(set, get),
}));

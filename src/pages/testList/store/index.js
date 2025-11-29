import { create } from "zustand";

import loadingSlice from "../../../store/common/loadingSlice";
import modalSlice from "../../../store/common/modalSlice";
import popupSlice from "../../../store/common/popupSlice";

import labTestSlice from "./labTestSlice";

const useStore = create((set, get) => ({
  ...loadingSlice(set, get),
  ...modalSlice(set, get),
  ...popupSlice(set, get),

  ...labTestSlice(set, get),

  clearState: () =>
    set({
      loading: false,
      popup: { type: null, action: null, message: null, data: null },
      modal: { view: null, data: null },
    }),
}));

export default useStore;

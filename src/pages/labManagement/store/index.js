import { create } from "zustand";
import labSlice from "./labSlice";
import adminSlice from "./adminSlice";
import staffSlice from "./staffSlice";
import loadingSlice from "../../../store/common/loadingSlice";
import modalSlice from "../../../store/common/modalSlice";
import popupSlice from "../../../store/common/popupSlice";
import billingSlice from "./billingSlice";

const useLabManagementStore = create((set, get) => ({
  ...loadingSlice(set, get),
  ...modalSlice(set, get),
  ...popupSlice(set, get),

  // domain data after UI slices
  ...labSlice(set, get),
  ...billingSlice(set, get),
  ...adminSlice(set, get),
  ...staffSlice(set, get),

  clearState: () =>
    set({
      loading: false,
      popup: { type: null, action: null, message: null, data: null },
      modal: { view: null, data: null },
      labs: [],
    }),
}));

export default useLabManagementStore;

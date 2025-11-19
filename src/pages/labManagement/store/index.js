import { create } from "zustand";
import adminSlice from "./adminSlice";
import staffSlice from "./staffSlice";
import modalSlice from "../../../store/common/modalSlice";
import loadingSlice from "../../../store/common/loadingSlice";
import popupSlice from "../../../store/common/popupSlice";
import labSlice from "./labSlice";

const useLabManagementStore = create((set, get) => ({
  ...adminSlice(set, get),
  ...staffSlice(set, get),
  ...loadingSlice(set, get),
  ...modalSlice(set, get),
  ...popupSlice(set, get),
  ...labSlice(set, get),

  clearState: () =>
    set({
      loading: false,
      popup: null,
      popupMessage: null,
      popupData: null,
      activeModal: null,
      modalData: null,
      labs: [],
      staffForm: {},
      adminForm: {},
    }),
}));

export default useLabManagementStore;

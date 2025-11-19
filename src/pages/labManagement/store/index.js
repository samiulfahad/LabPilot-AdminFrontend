import { create } from "zustand";
import labSlice from "./labSlice";
import adminSlice from "./adminSlice";
import staffSlice from "./staffSlice";
import loadingSlice from "../../../store/common/loadingSlice";
import modalSlice from "../../../store/common/modalSlice";
import popupSlice from "../../../store/common/popupSlice";

const useLabManagementStore = create((set, get) => ({
  ...labSlice(set, get),
  ...adminSlice(set, get),
  ...staffSlice(set, get),
  ...loadingSlice(set, get),
  ...modalSlice(set, get),
  ...popupSlice(set, get),

  clearState: () =>
    set({
      loading: false,
      popup: null,
      popupMessage: null,
      popupData: null,
      activeModal: null,
      modalData: null,
      labs: [],
      adminForm: {},
      staffForm: {},
    }),
}));

export default useLabManagementStore;

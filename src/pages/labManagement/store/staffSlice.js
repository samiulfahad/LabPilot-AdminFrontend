import labAdminService from "../../../services/adminService";
import staffService from "../../../services/staffService";

const staffSlice = (set, get) => ({
  // State
  staffForm: {},

  // Actions
  updateStaffForm: (field, value) =>
    set((state) => ({
      staffForm: {
        ...state.staffForm,
        [field]: value,
      },
    })),

  addStaff: async () => {
    try {
      get().startLoading();

      // 1. Add admin via API
      const response = await staffService.addStaff({
        _id: get().modalData._id,
        ...get().staffForm,
      });
      const newStaff = response.data;

      // 2. Update local state - add to staffs array
      set((state) => ({
        labs: state.labs.map((lab) => {
          if (lab._id === state.modalData?._id) {
            return {
              ...lab,
              staffs: [...(lab.staffs || []), newStaff],
            };
          }
          return lab;
        }),
        staffForm: {},
        popup: "success",
        popupMessage: "Staff added successfully",
        activeModal: null,
        modalData: null,
      }));
    } catch (e) {
      let message = "Could not add staff. Please retry";
      if (e.response.data.duplicate) {
        message = e.response.data.message;
      }
      set({
        popup: "error",
        popupMessage: message,
      });
    } finally {
      get().stopLoading();
    }
  },

  deleteStaff: async () => {
    try {
      get().startLoading();

      const { labId, staffId } = get().popupData;
      const response = await staffService.deleteStaff(labId, staffId);

      // Update local state by removing the deleted staff
      set((state) => ({
        labs: state.labs.map((lab) => {
          if (lab._id === labId) {
            return {
              ...lab,
              staffs: lab.staffs.filter((staff) => staff._id !== staffId),
            };
          }
          return lab;
        }),
        popup: "success",
        popupMessage: "Staff deleted successfully",
        popupData: null,
      }));

      // console.log(response);
    } catch (e) {
      set({
        popup: "error",
        popupMessage: "Could not delete staff. Please retry",
      });
    } finally {
      get().stopLoading();
    }
  },

  clearStaffForm: () =>
    set({
      staffForm: {},
    }),
});

export default staffSlice;

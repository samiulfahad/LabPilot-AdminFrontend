import staffService from "../../../services/staffService";

const staffSlice = (set, get) => ({
  // State
  staffForm: { isActive: false },

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
      const labId = get().modal.data._id;
      // console.log(labId);
      const response = await staffService.addStaff({ _id: labId, ...get().staffForm });
      const newStaff = response.data;

      // 2. Update local state - add to staffs array
      set((state) => ({
        labs: state.labs.map((lab) => {
          if (lab._id === labId) {
            return {
              ...lab,
              staffs: [...(lab.staffs || []), newStaff],
            };
          }
          return lab;
        }),
        staffForm: { isActive: false },
        popup: { type: "success", message: "New Staff added successfully", action: null, data: null },
        modal: { view: null, data: null },
      }));
    } catch (e) {
      let message = "Could not add new staff. Please retry";
      if (e.response.data.duplicate) {
        message = e.response.data.message;
      }
      set({ popup: { type: "error", message: message, data: null, action: null } });
    } finally {
      get().stopLoading();
    }
  },

  deleteStaff: async () => {
    try {
      get().startLoading();

      const { labId, staffId } = get().popup.data;
      await staffService.deleteStaff(labId, staffId);
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
        popup: { type: "success", message: "Staff deleted successfully", action: null, data: null },
      }));
    } catch (e) {
      set({ popup: { type: "error", message: "Could not delete staff", action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  clearStaffForm: () =>
    set({
      staffForm: { isActive: false },
    }),
});

export default staffSlice;

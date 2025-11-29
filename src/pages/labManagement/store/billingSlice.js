import billingService from "../../../services/billingService";

const billingSlice = (set, get) => ({
  // State
  billingForm: {
    invoicePrice: 0,
    commission: 0,
    monthlyFee: 0,
  },

  // Actions
  updateBillingForm: (field, value) =>
    set((state) => ({
      billingForm: {
        ...state.billingForm,
        [field]: value,
      },
    })),

  updateLabBilling: async () => {
    try {
      get().startLoading();

      const labId = get().modal.data._id;
      const billingData = get().billingForm;
      //   console.log(billingData);
      await billingService.updateBilling(labId, billingData);

      // 2. Update local state - update lab's billing information
      set((state) => ({
        labs: state.labs.map((lab) => {
          if (lab._id === labId) {
            return {
              ...lab,
              invoicePrice: billingData.invoicePrice,
              commission: billingData.commission,
              monthlyFee: billingData.monthlyFee,
            };
          }
          return lab;
        }),
        // Clear form after success
        billingForm: {
          invoicePrice: 0,
          commission: 0,
          monthlyFee: 0,
        },
        modal: { view: null, data: null },
        popup: { type: "success", message: "Billing information updated successfully", action: null, data: null },
      }));
    } catch (e) {
      let message = "Could not update billing information. Please retry";
      if (e.response?.data?.message) {
        message = e.response.data.message;
      }
      set({ popup: { type: "error", message: message, action: null, data: null } });
    } finally {
      get().stopLoading();
    }
  },

  clearBillingForm: () =>
    set({
      billingForm: {
        invoicePrice: 0,
        commission: 0,
        monthlyFee: 0,
      },
    }),
});

export default billingSlice;

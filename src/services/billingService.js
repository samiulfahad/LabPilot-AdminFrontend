import api from "./api";

const billingService = {
  updateBilling: (labId, billingData) => api.patch("/lab/billing/update", { _id: labId, ...billingData }),
};

export default billingService;

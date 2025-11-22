import { useEffect } from "react";
import useLabManagementStore from "./store";
import InputField from "../../components/html/InputField";

const BillingForm = () => {
  const { billingForm, updateBillingForm, updateLabBilling, modal, closeModal } = useLabManagementStore();

  const current = modal.data || {};
  const currentProfit = (current.invoicePrice || 0) - (current.labCommission || 0);
  const newProfit =
    (billingForm.invoicePrice ?? current.invoicePrice ?? 0) - (billingForm.labCommission ?? current.labCommission ?? 0);

  useEffect(() => {
    if (modal.data) {
      updateBillingForm("invoicePrice", current.invoicePrice || 0);
      updateBillingForm("labCommission", current.labCommission || 0);
      updateBillingForm("monthlyFee", current.monthlyFee || 0);
    }
  }, [modal.data]);

  const handleSubmit = (e) => {
    e.preventDefault();
    updateLabBilling();
  };

  const handleFieldChange = (e) => {
    const { name, value } = e.target;
    const numericValue = parseFloat(value) || 0;
    updateBillingForm(name, numericValue);
  };

  const closeForm = () => {
    closeModal();
  };

  return (
    <div className="space-y-1 p-2">
      {/* Heading */}
      <div className="text-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Update Billing</h2>
        {modal.data && <p className="text-sm text-gray-600 mt-1">for {modal.data.labName}</p>}
      </div>

      {/* Input Fields */}
      <InputField
        label="Invoice Price"
        name="invoicePrice"
        type="number"
        value={billingForm.invoicePrice ?? current.invoicePrice ?? ""}
        onChange={handleFieldChange}
      />

      <InputField
        label="Commission"
        name="labCommission"
        type="number"
        value={billingForm.labCommission ?? current.labCommission ?? ""}
        onChange={handleFieldChange}
      />

      <InputField
        label="Monthly Fee"
        name="monthlyFee"
        type="number"
        value={billingForm.monthlyFee ?? current.monthlyFee ?? ""}
        onChange={handleFieldChange}
      />

      {/* Profit Comparison */}
      <div className="border border-gray-300 rounded-lg p-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Profit Comparison</label>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Current Profit:</span>
            <span className="font-semibold">৳{currentProfit}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">New Profit:</span>
            <span
              className={`font-semibold ${
                newProfit > currentProfit
                  ? "text-green-600"
                  : newProfit < currentProfit
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              ৳{newProfit}
            </span>
          </div>
          <div className="flex justify-between text-sm border-t pt-2">
            <span className="font-medium text-gray-700">Difference:</span>
            <span
              className={`font-bold ${
                newProfit > currentProfit
                  ? "text-green-600"
                  : newProfit < currentProfit
                  ? "text-red-600"
                  : "text-gray-600"
              }`}
            >
              {newProfit > currentProfit ? "+" : ""}৳{newProfit - currentProfit}
            </span>
          </div>
        </div>
        <p className="text-xs text-gray-500 mt-2">Profit = Invoice Price - Lab Commission</p>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleSubmit}
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-blue-600 hover:bg-blue-700 text-white"
        >
          Update Billing
        </button>
        <button
          onClick={closeForm}
          className="flex-1 py-3 px-4 rounded-lg font-semibold transition-colors text-sm bg-gray-500 hover:bg-gray-600 text-white"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default BillingForm;

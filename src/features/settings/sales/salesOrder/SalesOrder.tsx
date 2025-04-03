import toast  from "react-hot-toast";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import Banner from "../../banner/Banner";
import { useContext, useEffect, useState } from "react";
import { settingsdataResponseContext } from "../../../../context/ContextShare";

type Props = {};

function SalesOrder({}: Props) {
  const { request: AddSalesOrderSettings } = useApi("put",7007);
  // Define the state with default values
  const {settingsResponse, getSettingsData } = useContext(settingsdataResponseContext)!;
  const [salesOrderState, setSalesOrderState] = useState({
    salesOrderAddress: false,
    salesOrderCustomerNote: false,
    salesOrderTermsCondition: false,
    salesOrderClose: "invoice",
    restrictSalesOrderClose: false,
    termCondition: "",
    customerNote: "",
  });

  // Generic function to handle input changes
  const handleInputChange = (field: string, value: any) => {
    setSalesOrderState((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  };


  const handleSalesOrderSettings = async (e: any) => {
    e.preventDefault();
    try {
      const url = `${endponits.ADD_SALES_SETTINGS}`;
      const apiResponse = await AddSalesOrderSettings(url,salesOrderState)
      const { response, error } = apiResponse;
      if (!error && response) {
        toast.success(response.data);
        // console.log(response.data,"res")
      } else {
        console.log(error,"res")

        toast.error(error.response.data);
      }
    } catch (error) {
      toast.error(`Error during API call: ${error}`);
    }
  };

  
  useEffect(() => {
    getSettingsData();
  }, []); 
  
  useEffect(() => {
    if (settingsResponse) {
      setSalesOrderState((prevData) => ({
        ...prevData,
        ...settingsResponse?.data?.salesOrderSettings,
      }));
    }
  }, [settingsResponse]);
  console.log(settingsResponse?.data);
  

  return (
    <div className="p-5">
      <Banner />
      <p className="text-textColor font-bold text-xl mt-4">Sales Order</p>
      <form onSubmit={(e) => handleSalesOrderSettings(e)}>
        {/* Checkbox Group for Updating Fields */}
        <div className="mt-4 p-6 rounded-lg bg-white">
          <p className="font-semibold text-dropdownText text-sm mb-3">
            Which of the following fields of Sales Orders do you want to update in
            the respective Invoices?
          </p>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customCheckbox"
                checked={salesOrderState.salesOrderAddress}
                onChange={(e) =>
                  handleInputChange("salesOrderAddress", e.target.checked)
                }
              />
              <label htmlFor="addressCheckbox" className="text-textColor text-sm">
                Address
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customCheckbox"
                checked={salesOrderState.salesOrderCustomerNote}
                onChange={(e) =>
                  handleInputChange("salesOrderCustomerNote", e.target.checked)
                }
              />
              <label htmlFor="customerNotesCheckbox" className="text-textColor text-sm">
                Customer Notes
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="customCheckbox"
                checked={salesOrderState.salesOrderTermsCondition}
                onChange={(e) =>
                  handleInputChange("salesOrderTermsCondition", e.target.checked)
                }
              />
              <label htmlFor="termsConditionsCheckbox" className="text-textColor text-sm">
                Terms & Conditions
              </label>
            </div>
          </div>
        </div>

        {/* Radio Buttons for Sales Order Closure */}
        <div className="mt-4 p-6 rounded-lg bg-white">
          <p className="font-semibold text-dropdownText text-sm mb-3">
            When do you want your Sales Orders to be closed?
          </p>
          <div className="flex flex-col space-y-3">
            <div className="flex items-center">
              <div
                onClick={() => handleInputChange("salesOrderClose", "invoice")}
                className="grid place-items-center cursor-pointer"
              >
                <input
                  id="invoice"
                  type="radio"
                  name="salesOrderClose"
                  value="invoice"
                  className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border  ${
                    salesOrderState.salesOrderClose === "invoice"
                      ? "border-8 border-neutral-400"
                      : "border-1 border-neutral-400"
                  }`}
                  checked={salesOrderState.salesOrderClose === "invoice"}
                  readOnly
                />
                <div
                  className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                    salesOrderState.salesOrderClose === "invoice"
                      ? "bg-neutral-100"
                      : "bg-transparent"
                  }`}
                />
              </div>
              <label htmlFor="invoice" className="text-textColor text-sm ml-2">
                When invoice is created
              </label>
            </div>

            <div className="flex items-center">
              <div
                onClick={() => handleInputChange("salesOrderClose", "shipment")}
                className="grid place-items-center cursor-pointer"
              >
                <input
                  id="shipment"
                  type="radio"
                  name="salesOrderClose"
                  value="shipment"
                  className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border  ${
                    salesOrderState.salesOrderClose === "shipment"
                      ? "border-8 border-neutral-400"
                      : "border-1 border-neutral-400"
                  }`}
                  checked={salesOrderState.salesOrderClose === "shipment"}
                  readOnly
                />
                <div
                  className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                    salesOrderState.salesOrderClose === "shipment"
                      ? "bg-neutral-100"
                      : "bg-transparent"
                  }`}
                />
              </div>
              <label htmlFor="shipment" className="text-textColor text-sm ml-2">
                When shipment is fulfilled
              </label>
            </div>

            <div className="flex items-center">
              <div
                onClick={() =>
                  handleInputChange("salesOrderClose", "shipmentInvoice")
                }
                className="grid place-items-center cursor-pointer"
              >
                <input
                  id="shipmentAndInvoice"
                  type="radio"
                  name="salesOrderClose"
                  value="shipmentAndInvoice"
                  className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border  ${
                    salesOrderState.salesOrderClose === "shipmentInvoice"
                      ? "border-8 border-neutral-400"
                      : "border-1 border-neutral-400"
                  }`}
                  checked={salesOrderState.salesOrderClose === "shipmentInvoice"}
                  readOnly
                />
                <div
                  className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${
                    salesOrderState.salesOrderClose === "shipmentInvoice"
                      ? "bg-neutral-100"
                      : "bg-transparent"
                  }`}
                />
              </div>
              <label htmlFor="shipmentInvoice" className="text-textColor text-sm ml-2">
                When shipment is fulfilled and invoice is created
              </label>
            </div>

            <div className="flex items-center mb-2 cursor-pointer">
              <input
                id="customCheckbox"
                type="checkbox"
                name="closureOption"
                value="restrict"
                className="accent-[#97998E] bg-white h-5 w-5 mr-2"
                checked={salesOrderState.restrictSalesOrderClose}
                onChange={(e) =>
                  handleInputChange(
                    "restrictSalesOrderClose",
                    e.target.checked
                  )
                }
              />
              <label htmlFor="restrict" className="text-textColor text-sm">
                Restrict closed sales orders from being edited
              </label>
            </div>
          </div>
        </div>

        <div className="mt-4 p-6 rounded-lg bg-white">
          <p className="font-bold text-textColor text-sm mb-3">Terms & Conditions</p>
          <textarea
            className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
            value={salesOrderState.termCondition}
            onChange={(e) =>
              handleInputChange("termCondition", e.target.value)
            }
          />
        </div>

        <div className="mt-4 p-6 rounded-lg bg-white">
          <p className="font-bold text-textColor text-sm mb-3">Customer Notes</p>
          <textarea
            className="w-full h-32 p-3 border border-inputBorder rounded-lg resize-none focus:outline-none focus:ring-1 focus:ring-[#7E0D0B]"
            value={salesOrderState.customerNote}
            onChange={(e) =>
              handleInputChange("customerNote", e.target.value)
            }
          />
        </div>

        {/* Save Button */}
        <div className="mt-4 flex justify-end">
          <Button type="submit" size="sm" className="text-sm  pl-10 pr-10">
            Save
          </Button>
        </div>
      </form>
    </div>
  );
}

export default SalesOrder;

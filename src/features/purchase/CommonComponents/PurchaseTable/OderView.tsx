import { useEffect, useState } from "react";
import PrinterIcon from "../../../../assets/icons/PrinterIcon";
import Button from "../../../../Components/Button";
import useApi from "../../../../Hooks/useApi";
import { endponits } from "../../../../Services/apiEndpoints";
import SendPurchaseOrder from "../../purchaseOrder/viewPurchaseOrder/SendPurchaseOrder";
import CheveronDownIcon from "../../../../assets/icons/CheveronDownIcon";
import CheveronUp from "../../../../assets/icons/CheveronUp";
import CehvronDown from "../../../../assets/icons/CehvronDown";
import Jornal from "../../bills/ViewBill/Jornal";

type Props = {
  data?: any;
  page?: string;
  organization?: any;
};

function OrderView({ data, page, organization }: Props) {
  const [supplier, setSupplier] = useState<any>({});
  const { request: getSupplier } = useApi("get", 7009);
  const [isExpanded, setIsExpanded] = useState<string | null>(null);

  const toggleDropdown = (key: string | null) => {
    setIsExpanded(key === isExpanded ? null : key);
  };
  console.log(isExpanded);

  const getSupplierAddress = async () => {
    if (!data?.supplierId) return;

    try {
      const url = `${endponits.GET_ONE_SUPPLIER}/${data.supplierId}`;
      const { response, error } = await getSupplier(url);
      if (response && !error) {
        setSupplier(response.data);
      } else {
        console.error("Error fetching supplier:", error);
      }
    } catch (error) {
      console.error("Error fetching supplier:", error);
    }
  };

  useEffect(() => {
    getSupplierAddress();
  }, [data]);

  const renderItemTable = () => {
    const items = data?.itemTable || data?.items;

    if (!items || items.length === 0) {
      return <p>No items available</p>;
    }

    const currency = organization?.baseCurrency || "";

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {items.map(
          (item: {
            itemId: string;
            itemName: string;
            itemImage?: string;
            itemQuantity?: number;
            itemCostPrice?: number;
            itemDiscount?: number;
            discountType?: string;
            itemAmount?: number;
          }) => (
            <div key={item.itemId}>
              {" "}
              {/* Corrected div */}
              <div
                className={`mt-6 p-4 flex flex-col bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] ${
                  isExpanded === item.itemId ? "rounded-t-lg" : "rounded-lg"
                }`}
              >
                {/* Header Section */}
                <div
                  className="w-full flex items-center justify-between cursor-pointer "
                  onClick={() => toggleDropdown(item.itemId)}
                >
                  <div className="flex-row sm:flex items-center">
                    <img
                      src={item.itemImage || ""}
                      alt="Item"
                      className="h-16 w-20"
                    />
                    <div className="text-textColor ml-4">
                      <p className="text-sm text-blk">Item</p>
                      <p className="font-semibold text-base text-blk">
                        {item.itemName}
                      </p>
                    </div>
                  </div>
                  <p className="text-sm font-medium text-dropdownText">
                    {isExpanded === item.itemId ? (
                      <CheveronUp color="currentColor" />
                    ) : (
                      <CheveronDownIcon color="currentColor" />
                    )}
                  </p>
                </div>
              </div>
              {/* Expandable Section */}
              {isExpanded === item.itemId && (
                <div className=" w-full grid  grid-cols-1 sm:grid-cols-5 text-center rounded-b-lg border-borderRight py-3 bg-gradient-to-r from-[#E3E6D5] to-[#F7E7CE] ">
                  {/* Ordered */}
                  <div className="flex items-center border-r border-borderRight p-4">
                    <div>
                      <p className="text-dropdownText text-sm">Ordered</p>
                      <p className="font-semibold text-sm text-textColor">
                        {item.itemQuantity || 0} PCS
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="items-center border-r border-borderRight p-4">
                    <div>
                      <p className="text-dropdownText text-sm">Status</p>
                      <p className="font-bold text-sm text-textColor">
                        0 Invoiced
                      </p>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="items-center border-r border-borderRight p-4">
                    <div>
                      <p className="text-dropdownText text-sm">Rate</p>
                      <p className="font-bold text-sm text-textColor">
                        {currency} {item.itemCostPrice || 0}
                      </p>
                    </div>
                  </div>

                  {/* Discount */}
                  <div className="items-center border-r border-borderRight p-4">
                    <div>
                      <p className="text-dropdownText text-sm">Discount</p>
                      <p className="font-bold text-sm text-textColor">
                        {item.discountType === "percentage"
                          ? ((item.itemCostPrice || 0) *
                              (item.itemDiscount || 0)) /
                            100
                          : item.itemDiscount || 0}
                      </p>
                    </div>
                  </div>

                  {/* Amount */}
                  <div className="items-center p-4">
                    <div>
                      <p className="text-dropdownText text-sm">Amount</p>
                      <p className="font-bold text-sm text-textColor">
                        {currency} {item.itemAmount || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        )}
      </div>
    );
  };

  return (
    <div className="mt-4">
      <div className="sm:flex items-center justify-start mb-4">
        <p className="text-textColor border-r-[1px] border-borderRight pr-4 text-sm font-normal">
          Order Date:{" "}
          <span className="ms-3 text-dropdownText text-sm font-semibold">
            {page === "PurchaseOrder"
              ? data?.purchaseOrderDate
              : data?.billDate}
          </span>
        </p>
        {page !== "DebitNote" && (
          <p className="text-textColor border-r-[1px] border-borderRight px-4 text-sm font-normal">
            Expected Shipment:{" "}
            <span className="ms-3 text-dropdownText text-sm font-semibold">
              {page === "PurchaseOrder"
                ? data?.expectedShipmentDate
                : data?.dueDate}
            </span>
          </p>
        )}
        {page == "Bills" && (
          <p className="text-textColor pl-4 text-sm font-normal">
            Payment Terms:{" "}
            <span className="ms-3 text-dropdownText text-sm font-semibold">
              {data?.paymentTerms}
            </span>
          </p>
        )}
        {page === "DebitNote" && (
          <p className="text-textColor pl-4 text-sm font-normal">
            Supplier Debit Date:{" "}
            <span className="ms-3 text-dropdownText text-sm font-semibold">
              {data?.supplierDebitDate}
            </span>
          </p>
        )}
      </div>
      {page === "PurchaseOrder" && <SendPurchaseOrder data={data} />}
      
      {renderItemTable()}
      {page === "Bills"  && <Jornal page={page} />}
      {page === "DebitNote"  && <Jornal page={page} />}


      <hr className="mt-6 border-t border-inputBorder" />
      <div className="flex-row sm:flex justify-between gap-6 mt-4 ">
        <div className="p-6 rounded-lg border border-billingBorder w-full sm:w-[50%] h-fit">
          <p className="text-base font-bold text-textColor">Billing Address</p>
          <div className="text-base text-dropdownText mt-2 space-y-2">
            {supplier?.supplierDisplayName && (
              <p>{supplier.supplierDisplayName}</p>
            )}
            {supplier?.companyName && <p>{supplier.companyName}</p>}
            {(supplier?.billingAddressStreet1 ||
              supplier?.billingAddressStreet2) && (
              <p>
                {supplier.billingAddressStreet1 || ""}{" "}
                {supplier.billingAddressStreet2 && ", "}
                {supplier.billingAddressStreet2 || ""}
              </p>
            )}
            {supplier?.billingCity && <p>{supplier.billingCity}</p>}
            {(supplier?.billingCountry || supplier?.billingPinCode) && (
              <p>
                {supplier.billingCountry || ""}{" "}
                {supplier.billingPinCode ? `- ${supplier.billingPinCode}` : ""}
              </p>
            )}
            {supplier?.billingPhone && <p>{supplier.billingPhone}</p>}
          </div>
        </div>





        <div className="p-6 rounded-lg border border-billingBorder w-full sm:w-[50%]">
          {page !== "PurchaseOrder" && page!=="DebitNote" ? (
            <>
              <p className="text-base font-bold text-textColor">
                Order Summary
              </p>
              <div className="mt-4">
                <div className="flex justify-between">
                  <p>Untaxed Amount</p>
                  <p>
                    {organization?.baseCurrency}{" "}
                    {(data?.grandTotal || 0) - (data?.totalTaxAmount || 0)}
                  </p>
                </div>
                {data?.cgst > 0 && data?.sgst > 0 ? (
                  <>
                    <div className="flex justify-between mt-4">
                      <p>SGST</p>
                      <p>
                        {organization?.baseCurrency} {data?.sgst}
                      </p>
                    </div>
                    <div className="flex justify-between mt-4">
                      <p>CGST</p>
                      <p>
                        {organization?.baseCurrency} {data?.cgst}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between mt-4">
                    <p>IGST</p>
                    <p>
                      {organization?.baseCurrency} {data?.igst}
                    </p>
                  </div>
                )}
                <div className="flex justify-between mt-4">
                  <p>Total</p>
                  <p>
                    {organization?.baseCurrency} {data?.grandTotal}
                  </p>
                </div>
                <hr className="mt-4 border-t border-[#CCCCCC]" />
                <div className="flex justify-end gap-2 mt-6">
                  <Button variant="secondary" size="sm" className="px-4">
                    Cancel
                  </Button>
                  <Button variant="secondary" size="sm" className="px-2">
                    <PrinterIcon color="#565148" height={16} width={16} />
                    Print
                  </Button>
                  <Button variant="primary" size="sm" className="px-3">
                    Save & Send
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-base font-bold text-textColor">
                Order Summary
              </p>
              <div className="mt-4 text-sm space-y-2 text-textColor">
              { page==="PurchaseOrder" && 
                <>
                  <div className="flex justify-between">
                    <p>Other Expense</p>
                    <p>
                      {organization?.baseCurrency} {data?.otherExpense || 0}
                    </p>
                  </div>
                <div className="flex justify-between">
                    <p>Freight</p>
                    <p>
                      {organization?.baseCurrency} {data?.freight || 0}
                    </p>
                  </div>
                </>
                }
                <div className="flex justify-between">
                  <p>Sub Total</p>
                  <p>
                    {organization?.baseCurrency} {data?.subTotal || 0}
                  </p>
                </div>
                <div className="flex justify-between">
                  <p>Total Item</p>
                  <p>{data?.totalItem || 0}</p>
                </div>
                { page==="PurchaseOrder" && <div className="flex justify-between">
                  <p>Discount</p>

                  <div className="flex items-center gap-2">
                    <div className=" ">
                      <div className="border border-inputBorder rounded-lg flex items-center justify-center p-1 gap-1">
                        <input
                          value={data?.transactionDiscount}
                          name="transactionDiscount"
                          type="text"
                          placeholder="0"
                          className="w-[30px]  focus:outline-none text-center"
                        />
                        <select
                          disabled
                          className="text-xs   text-zinc-400 bg-white relative"
                          value={data.transactionDiscountType}
                          name="transactionDiscountType"
                        >
                          <option value="percentage">%</option>
                          <option value="currency">
                            {organization?.baseCurrency}
                          </option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center  text-gray-700 ms-1">
                          <CehvronDown color="gray" height={15} width={15} />
                        </div>
                      </div>
                    </div>
                    <p>
                      {organization?.baseCurrency}{" "}
                      {data?.transactionDiscountAmount || 0.00}
                    </p>
                  </div>
                </div>}
                {data?.cgst > 0 && data?.sgst > 0 ? (
                  <>
                    <div className="flex justify-between ">
                      <p>SGST</p>
                      <p>
                        {organization?.baseCurrency} {data?.sgst | 0.00}
                      </p>
                    </div>
                    <div className="flex justify-between ">
                      <p>CGST</p>
                      <p>
                        {organization?.baseCurrency} {data?.cgst | 0.00}
                      </p>
                    </div>
                  </>
                ) : (
                  <div className="flex justify-between ">
                    <p>IGST</p>
                    <p>
                      {organization?.baseCurrency} {data?.igst |0.00}
                    </p>
                  </div>
                )}
                  <div className="flex justify-between ">
                    <p>Total Tax Amount</p>
                    <p>
                      {organization?.baseCurrency} {data?.totalTaxAmount | 0.00}
                    </p>
                  </div>
                  {  page==="PurchaseOrder" &&  
                  <>
                     <div className="flex justify-between ">
                    <p>Total</p>
                    <p>
                      {organization?.baseCurrency} {data?.grandTotal -data?.roundOff |0.00}
                    </p>
                  </div>
                  <div className="flex justify-between mt-4">
                    <p>Round Off</p>
                    <p>
                      {organization?.baseCurrency} {data?.roundOff |0.00}
                    </p>
                  </div>
               <div className="flex justify-between mt-4">
                    <p>Round Off</p>
                    <p>
                      {organization?.baseCurrency} {data?.roundOff |0.00}
                    </p>
                  </div>
                  </>
                }

                <hr className="mt-4 border-t border-[#CCCCCC]" />
                <div className="flex justify-between mt-4 font-bold">
                  <p>Total</p>
                  <p>
                    {organization?.baseCurrency} {data?.grandTotal |0.00}
                  </p>
                </div>



              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default OrderView;

import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Button from "../../../Components/Button";
import SearchBar from "../../../Components/SearchBar";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
// import PrinterIcon from "../../../assets/icons/PrinterIcon";
import NewCustomerModal from "../../Customer/CustomerHome/NewCustomerModal";
// import ManageSalesPerson from "../SalesPerson/ManageSalesPerson";
import Upload from "../../../assets/icons/Upload";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import { SalesOrder } from "../../../Types/SalesOrder";
import toast from "react-hot-toast";
import NewSalesQuoteTable from "../quote/NewSalesQuoteTable";
import ViewMoreOrder from "./ViewMoreOrder";
import CustomerModal from "./CustomerModal";

type Props = { page?: string };

interface Customer {
  taxType: string;
}

const initialSalesQuoteState: SalesOrder = {
  customerId: "",
  customerName: "",
  placeOfSupply: "",
  reference: "",
  salesOrderDate: new Date().toISOString().split("T")[0],
  expiryDate: "",
  subject: "",

  salesOrder: "",

  paymentMode: "",
  paymentTerms: "",
  deliveryMethod: "",
  expectedShipmentDate: new Date().toISOString().split("T")[0],

  taxPreference: "Taxable",

  items: [
    {
      itemId: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      taxPreference: "",
      taxGroup: "",
      cgst: "",
      sgst: "",
      igst: "",
      cgstAmount: "",
      sgstAmount: "",
      igstAmount: "",
      vatAmount: "",
      itemTotalTax: "",
      discountType: "",
      discountAmount: "",
      amount: "",
      itemAmount: "",
      salesAccountId: "",
    },
  ],

  totalItemDiscount: "",
  subtotalTotal: "",
  note: "",
  tc: "",

  otherExpenseAmount: "",
  otherExpenseReason: "",
  vehiclestring: "",
  freightAmount: "",
  roundOffAmount: "",

  totalDiscount: "",
  discountTransactionType: "Percentage",
  discountTransactionAmount: "",
  transactionDiscount: "",
  subTotal: "",
  totalItem: "",

  cgst: "",
  sgst: "",
  igst: "",
  vat: "",
  totalTax: "",
  totalAmount: "",
};

const NewSalesOrder = ({ page }: Props) => {
  const [isIntraState, setIsIntraState] = useState<boolean>(false);
  const [searchValue, setSearchValue] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const [customerData, setCustomerData] = useState<[]>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [selectedCustomer, setSelecetdCustomer] = useState<any>("");
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | any>([]);
  const [paymentTerms, setPaymentTerms] = useState<[]>([]);
  const [isPlaceOfSupplyVisible, setIsPlaceOfSupplyVisible] =
    useState<boolean>(true);
  const [prefix, setPrifix] = useState("");

  const [salesOrderState, setSalesOrderState] = useState<SalesOrder>(
    initialSalesQuoteState
  );

  const { request: AllCustomer } = useApi("get", 5002);
  const { request: getOneOrganization } = useApi("get", 5004);
  const { request: getCountries } = useApi("get", 5004);
  const { request: getPrfix } = useApi("get", 5007);
  const { request: allPyamentTerms } = useApi("get", 5004);

  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate(-1);
    setSalesOrderState(initialSalesQuoteState);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const totalTax = parseFloat(salesOrderState?.totalTax);
    let discountValue =
      parseFloat(salesOrderState.discountTransactionAmount) || 0; // Use `discountTransactionAmount`
    const totalAmount =
      parseFloat(salesOrderState.subtotalTotal + totalTax) || 0;

    if (name === "transactionDiscountType") {
      setSalesOrderState((prevState: any) => ({
        ...prevState,
        discountTransactionType: value,
      }));

      if (value === "Percentage") {
        const PercentageDiscount = (discountValue / totalAmount) * 100;
        if (PercentageDiscount > 100) {
          toast.error("Discount cannot exceed 100%");
        }

        setSalesOrderState((prevState: any) => ({
          ...prevState,
          discountTransactionAmount: PercentageDiscount
            ? PercentageDiscount.toFixed(2)
            : "0", // Set `discountTransactionAmount`
        }));
      } else {
        const currencyDiscount = (discountValue / 100) * totalAmount;
        setSalesOrderState((prevState: any) => ({
          ...prevState,
          discountTransactionAmount: currencyDiscount
            ? currencyDiscount.toFixed(2)
            : "0", // Set `discountTransactionAmount`
        }));
      }
    }

    if (name === "discountTransactionAmount") {
      // Previously `transactionDiscount`
      discountValue = parseFloat(value) || 0;

      if (salesOrderState.discountTransactionType === "Percentage") {
        if (discountValue > 100) {
          discountValue = 0;
          toast.error("Discount cannot exceed 100%");
        }
        const discountAmount = (discountValue / 100) * totalAmount;

        setSalesOrderState((prevState: any) => ({
          ...prevState,
          discountTransactionAmount: discountValue
            ? discountValue.toString()
            : "0", // Set `discountTransactionAmount`
          transactionDiscount: discountAmount ? discountAmount.toFixed(2) : "0", // Set `transactionDiscount`
        }));
      } else {
        if (discountValue > totalAmount) {
          discountValue = totalAmount;
          toast.error("Discount cannot exceed the subtotal amount");
        }

        setSalesOrderState((prevState: any) => ({
          ...prevState,
          discountTransactionAmount: discountValue
            ? discountValue.toString()
            : "0", // Set `discountTransactionAmount`
          transactionDiscount: discountValue ? discountValue.toFixed(2) : "0", // Set `transactionDiscount`
        }));
      }
    }

    if (
      name !== "discountTransactionAmount" &&
      name !== "transactionDiscountType"
    ) {
      setSalesOrderState((prevState: any) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const calculateTotal = () => {
    const {
      totalItemDiscount,
      subtotalTotal,
      totalTax,
      roundOffAmount,
      otherExpenseAmount,
      freightAmount,
    } = salesOrderState;

    // Calculate total with all components
    const totalAmount =
      Number(subtotalTotal) +
      Number(otherExpenseAmount) +
      Number(totalTax) +
      Number(freightAmount) -
      (Number(totalItemDiscount) + Number(roundOffAmount));

    return totalAmount.toFixed(2);
  };

  useEffect(() => {
    const newGrandTotal = calculateTotal();
    const {
      discountTransactionType,
      discountTransactionAmount = "0",
      transactionDiscount = "0",
    } = salesOrderState;

    const transactionDiscountValueAMT =
      discountTransactionType === "Percentage"
        ? (Number(discountTransactionAmount) / 100) * Number(newGrandTotal)
        : Number(discountTransactionAmount);

    const roundedDiscountValue =
      Math.round(transactionDiscountValueAMT * 100) / 100;
    const updatedGrandTotal =
      Math.round((Number(newGrandTotal) - roundedDiscountValue) * 100) / 100;

    if (
      Number(transactionDiscount) !== roundedDiscountValue ||
      Number(salesOrderState.totalAmount) !== updatedGrandTotal
    ) {
      setSalesOrderState((prevState) => ({
        ...prevState,
        transactionDiscount: roundedDiscountValue.toFixed(2),
        totalAmount: updatedGrandTotal.toFixed(2),
      }));
    }
  }, [
    salesOrderState.discountTransactionAmount,
    salesOrderState.discountTransactionType,
    salesOrderState.subtotalTotal,
    salesOrderState.totalTax,
    salesOrderState.totalItemDiscount,
    salesOrderState.roundOffAmount,
    salesOrderState.otherExpenseAmount,
    salesOrderState.freightAmount,
  ]);

  useEffect(() => {
    setSalesOrderState((prevState: any) => ({
      ...prevState,
      totalDiscount: (
        (parseFloat(prevState.totalItemDiscount) || 0) +
        (parseFloat(prevState.transactionDiscount) || 0)
      ).toFixed(2),
    }));
  }, [salesOrderState.transactionDiscount, salesOrderState.totalItemDiscount]);

  const checkTaxType = (customer: Customer) => {
    if (customer.taxType === "GST") {
      setIsPlaceOfSupplyVisible(true);
    } else {
      setIsPlaceOfSupplyVisible(false);
    }
  };
  const fetchCountries = async () => {
    try {
      const url = `${endponits.GET_COUNTRY_DATA}`;
      const { response, error } = await getCountries(url);
      if (!error && response) {
        setcountryData(response.data[0].countries);
      }
    } catch (error) {
      console.log("Error in fetching Country", error);
    }
  };
  const getSalesQuotePrefix = async () => {
    try {
      const prefixUrl = `${endponits.GET_LAST_SALES_ORDER_PREFIX}`;
      const { response, error } = await getPrfix(prefixUrl);

      if (!error && response) {
        setPrifix(response.data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.log("Error in fetching Purchase Order Prefix", error);
    }
  };

  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );
      if (oneOrganization) {
        if (!salesOrderState.placeOfSupply) {
          setSalesOrderState((preData) => ({
            ...preData,
            placeOfSupply: selectedCustomer.billingState,
          }));
        }
      }
      if (country) {
        const states = country.states;
        setPlaceOfSupplyList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
    }
  };

  useEffect(() => {
    if (salesOrderState?.placeOfSupply !== oneOrganization.state) {
      setIsIntraState(true);
    } else {
      setIsIntraState(false);
    }
  }, [salesOrderState?.placeOfSupply, oneOrganization.state]);

  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    fetchFunction: (url: string) => Promise<any>
  ) => {
    try {
      const { response, error } = await fetchFunction(url);

      if (!error && response) {
        if (url.includes(endponits.GET_ONE_SALES_ORDER)) {
          const totalAmount = parseFloat(response.data.totalAmount) || 0;
          const discountTransactionAmount =
            parseFloat(response.data.discountTransactionAmount) || 0;

          setSalesOrderState((prevData) => ({
            ...prevData,
            ...response.data,
            totalAmount: totalAmount.toFixed(2),
            discountTransactionAmount: discountTransactionAmount.toFixed(2),
          }));
        } else {
          let filteredData = response.data;
          if (url.includes(endponits.GET_ALL_CUSTOMER)) {
            filteredData = response.data.filter(
              (customer: { status: string }) => customer.status !== "Inactive"
            );
          }

          setData(filteredData);
        }
      } else {
        console.error("Error in response or no data received:", error);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  console.log(salesOrderState, "salesOrderState")

  useEffect(() => {
    const organizationUrl = `${endponits.GET_ONE_ORGANIZATION}`;
    const paymentTermsUrl = `${endponits.GET_PAYMENT_TERMS}`;
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;

    fetchData(customerUrl, setCustomerData, AllCustomer);
    fetchData(paymentTermsUrl, setPaymentTerms, allPyamentTerms);
    fetchData(organizationUrl, setOneOrganization, getOneOrganization);
    handleplaceofSupply();
    fetchCountries();
    getSalesQuotePrefix();
    if (selectedCustomer) {
      checkTaxType(selectedCustomer);
    }
  }, [selectedCustomer]);

  const filterByDisplayName = (
    data: any[],
    displayNameKey: string,
    searchValue: string
  ) => {
    return data.filter((item: any) =>
      item[displayNameKey]?.toLowerCase().includes(searchValue.toLowerCase())
    );
  };
  const filteredCustomer = filterByDisplayName(
    customerData,
    "customerDisplayName",
    searchValue
  );

  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;

    fetchData(customerUrl, setCustomerData, AllCustomer);
  };

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
    }
  };

  useEffect(() => {
    if (openDropdownIndex !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownIndex]);

  const { id } = useParams();
  const { request: getOneSalesOrder } = useApi("get", 5007);

  useEffect(() => {
    const fetchInitialData = async () => {
      const customerUrl = `${endponits.GET_ALL_CUSTOMER}`;
      const onePO = `${endponits.GET_ONE_SALES_ORDER}/${id}`;

      await fetchData(customerUrl, setCustomerData, AllCustomer);

      if (page === "edit") {
        await fetchData(onePO, setSalesOrderState, getOneSalesOrder);
      }
    };

    fetchInitialData();
  }, [page, id]);

  useEffect(() => {
    if (salesOrderState.customerId && customerData) {
      const customer = customerData.find(
        (customer: any) => customer._id === salesOrderState.customerId
      );
      if (customer) {
        setSelecetdCustomer(customer);
      }
    }
  }, [salesOrderState]);

  const { request: newSalesOrderApi } = useApi("post", 5007);
  const { request: editSalesOrderApi } = useApi("put", 5007);

  const handleSave = async () => {
    try {
      const url =
        page === "edit"
          ? `${endponits.EDIT_SALES_ORDER}/${id}`
          : `${endponits.ADD_SALES_ORDER}`;
      const apiRequest = page === "edit" ? editSalesOrderApi : newSalesOrderApi;
      const { response, error } = await apiRequest(url, salesOrderState);
      if (!error && response) {
        toast.success(response.data.message);
        handleGoBack();
      } else {
        toast.error(error?.response?.data?.message || "An error occurred");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again later.");
      console.error("Error in handleSave:", error);
    }
  };


  // useEffect(() => {
  //   if (salesOrderState.discountTransactionAmount) {
  //     setSalesOrderState((prevState: any) => ({
  //       ...prevState,
  //       totalDiscount: (prevState.discountTransactionAmount).toString() || 0,
  //       totalAmount: ((prevState.totalAmount).toString() || 0) ,
  //     }));
  //   }
  // }, [salesOrderState.discountTransactionAmount, salesOrderState.totalAmount]);


  return (
    <div className="px-8">
      <div className="flex gap-5">
        <Link to={"/sales/salesorder"}>
          <div className="flex justify-center items-center h-11 w-11 bg-[#FFFFFF] rounded-full">
            <CheveronLeftIcon />
          </div>
        </Link>
        <div className="flex justify-center items-center">
          <h4 className="font-bold text-xl text-textColor ">
            {page === "edit" ? "Edit" : "Create"} Sales Order
          </h4>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-4 py-5 rounded-lg">
        <div className="col-span-8">
          <div className="bg-[#FFFFFF] p-5 min-h-max rounded-xl relative ">
            <p className="text-textColor text-xl font-bold">
              Enter Customer details
            </p>

            <div className="mt-5 space-y-4">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="text-sm mb-1 text-labelColor">
                    Select Customer <span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("customer")}
                  >
                    <div
                      className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border
                         border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
                    >
                      <p>
                        {(selectedCustomer as { customerDisplayName?: string })
                          ?.customerDisplayName ?? "Select Customer"}
                      </p>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  {openDropdownIndex === "customer" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white  shadow  rounded-md mt-1 p-2   space-y-1 max-w-80 max-h-80 overflow-y-scroll"
                      style={{ width: "80%" }}
                    >
                      <SearchBar
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        placeholder="Serach customer"
                      />
                      {filteredCustomer ? (
                        filteredCustomer.map((customer: any) => (
                          <div
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer
                                border border-slate-400 rounded-lg bg-lightPink"
                            onClick={() => {
                              setSalesOrderState((prevState) => ({
                                ...prevState,
                                customerId: customer._id,
                                customerName: customer.customerDisplayName,
                              }));
                              setOpenDropdownIndex(null);
                              setSelecetdCustomer(customer);
                            }}
                          >
                            <div className="col-span-2 flex items-center justify-center">
                              <img
                                src="https://i.postimg.cc/MHdYrGVP/Ellipse-43.png"
                                alt=""
                              />
                            </div>
                            <div className="col-span-10 flex">
                              <div>
                                <p className="font-bold text-sm">
                                  {customer.customerDisplayName}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Phone: {customer.mobile}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <></>
                      )}
                      <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4">
                        <NewCustomerModal page="purchase" />
                      </div>
                    </div>
                  )}
                  {
                    selectedCustomer &&
                    <CustomerModal selectedCustomer={selectedCustomer} />}
                </div>

                {isPlaceOfSupplyVisible && (
                  <div className="col-span-7">
                    <label className="block text-sm mb-1 text-labelColor">
                      Place Of Supply <span className="text-[#bd2e2e] ">*</span>
                    </label>
                    <div className="relative w-full">
                      <select
                        name="placeOfSupply"
                        value={salesOrderState.placeOfSupply || ""}
                        onChange={handleChange}
                        className="block appearance-none w-full h-9 text-zinc-400 bg-white border
        border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight
        focus:outline-none focus:bg-white focus:border-gray-500"
                      >
                        <option value="" disabled hidden>
                          Select place Of Supply
                        </option>
                        {placeOfSupplyList &&
                          placeOfSupplyList.map((item: any, index: number) => (
                            <option key={index} value={item} className="text-gray">
                              {item}
                            </option>
                          ))}
                      </select>

                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                        <CehvronDown color="gray" />
                      </div>
                    </div>
                  </div>
                )}

                <div
                  className={`col-span-${isPlaceOfSupplyVisible ? "5" : "7"
                    } relative`}
                >
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Order#
                  </label>
                  <input
                    readOnly
                    value={salesOrderState.salesOrder ? salesOrderState.salesOrder : prefix}
                    // value={page === "edit" ? salesOrderState?.Prefix || prefix : prefix}
                    type="text"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>

                <div
                  className={`col-span-${isPlaceOfSupplyVisible ? "7" : "5"
                    } relative`}
                >
                  <label className="block text-sm mb-1 text-labelColor">
                    Reference#
                  </label>
                  <input
                    placeholder="reference"
                    type="text"
                    onChange={handleChange}
                    value={salesOrderState?.reference}
                    name="reference"
                    className="border-inputBorder w-full text-sm border rounded p-1.5 pl-2 h-9"
                  />
                </div>
              </div>
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Order Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      onChange={handleChange}
                      name="salesOrderDate"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                      value={salesOrderState.salesOrderDate}
                    />
                  </div>
                </div>
                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Expected Shipment Date
                  </label>
                  <div className="relative w-full">
                    <input
                      type="date"
                      onChange={handleChange}
                      name="expectedShipmentDate"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500 px-2"
                      value={salesOrderState?.expectedShipmentDate}
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                {/* <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Mode
                  </label>
                  <div className="relative w-full">
                    <select
                    value={salesOrderState?.paymentMode}
                    onChange={handleChange}
                    name="paymentMode"
                    className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <option value="" disabled hidden selected className="text-gray">
                        Select Payment Mode
                      </option>
                      <option value="Cash" className="text-gray">
                        Cash
                      </option>
                      <option value="Credit" className="text-gray">
                        Credit
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>

                </div> */}
                {/* <div className="col-span-5 relative">
                  <label className="block text-sm mb-1 text-labelColor">
                    Sales Person
                  </label>
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown("salesperson")}
                  >
                    <div className="items-center flex appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                      <p>Select Salesperson</p>
                    </div>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  {openDropdownIndex === "salesperson" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                    >
                      <ManageSalesPerson />
                    </div>
                  )}
                </div> */}
                <div className="col-span-5">
                  <label className="block text-sm mb-1 text-labelColor">
                    Delivery Method
                  </label>
                  <div className="relative w-full">
                    <select
                      value={salesOrderState.deliveryMethod}
                      name="deliveryMethod"
                      onChange={handleChange}
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option
                        value=""
                        disabled
                        hidden
                        selected
                        className="text-gray"
                      >
                        Select Shipment Preference
                      </option>
                      <option value="Road">Road</option>
                      <option value="Rail">Rail</option>
                      <option value="Air">Air</option>
                      <option value="Sea">Sea</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>

                <div className="col-span-7">
                  <label className="block text-sm mb-1 text-labelColor">
                    Payment Terms
                  </label>
                  <div className="relative w-full">
                    <select
                      value={salesOrderState.paymentTerms}
                      onChange={handleChange}
                      name="paymentTerms"
                      className="block appearance-none w-full h-9 text-zinc-400 bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                    >
                      <option
                        value=""
                        disabled
                        selected
                        hidden
                        className="text-gray"
                      >
                        Select Payment Terms
                      </option>
                      {paymentTerms.length > 0 &&
                        paymentTerms.map((item: any) => (
                          <option value={item.name} className="text-gray">
                            {item.name}
                          </option>
                        ))}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-9">
                <p className="font-bold text-base">Add Item</p>
                <NewSalesQuoteTable
                  salesQuoteState={salesOrderState}
                  setSalesQuoteState={setSalesOrderState}
                  oneOrganization={oneOrganization}
                  isIntraState={isIntraState}
                  isPlaceOfSupplyVisible={isPlaceOfSupplyVisible}
                />
              </div>

              <ViewMoreOrder
                salesOrderState={salesOrderState}
                setSalesOrderState={setSalesOrderState}
              />
            </div>
          </div>
        </div>

        <div className="col-span-4">
          <div className="bg-secondary_main p-5 text-sm rounded-xl space-y-4 text-textColor">
            <div className="text-sm">
              <label htmlFor="" className="">
                Add Note
                <input
                  onChange={handleChange}
                  value={salesOrderState?.note}
                  name="note"
                  id=""
                  placeholder="Note"
                  className="border-inputBorder w-full text-sm border rounded  p-2 h-[57px] mt-2 "
                />
              </label>
            </div>
            <div className="mt-4">
              <label htmlFor="tc" className="">
                Terms & Conditions
                <input
                  name="tc"
                  id="tc"
                  value={salesOrderState.tc}
                  onChange={handleChange}
                  placeholder="Add Terms & Conditions of your business"
                  className="border-inputBorder w-full text-sm border rounded p-2 h-[57px] mt-2"
                />
              </label>
            </div>
            <div className="mt-4 hidden">
              <label className="block mb-1">
                Attach files to Sales Order
                <div className="border-dashed border border-neutral-300 p-2 rounded  gap-2 text-center h-[68px] mt-3">
                  <div className="flex gap-1 justify-center items-center">
                    <Upload />
                    <span>Upload File</span>
                  </div>
                  <p className="text-xs mt-1 text-gray-600">
                    Maximum File Size : 1MB
                  </p>
                </div>
                {/* <input type="file" className="hidden" name="documents" /> */}
              </label>
            </div>

            <div className=" pb-4  text-dropdownText border-b-2 border-slate-200 space-y-2">
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Sub Total</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    Rs{" "}
                    {salesOrderState.subtotalTotal
                      ? salesOrderState.subtotalTotal
                      : "0.00"}{" "}
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p> Total Quantity</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {salesOrderState.totalItem
                      ? salesOrderState.totalItem
                      : "0"}
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  <p> Total Item Discount</p>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {salesOrderState.totalDiscount
                      ? salesOrderState.totalDiscount
                      : "0.00"}
                  </p>
                </div>
              </div>

              {isIntraState ? (
                <div className="flex ">
                  <div className="w-[75%]">
                    {" "}
                    <p> IGST</p>
                  </div>
                  <div className="w-full text-end">
                    {" "}
                    <p className="text-end">
                      {oneOrganization.baseCurrency}{" "}
                      {salesOrderState.igst ? salesOrderState.igst : "0.00"}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex ">
                    <div className="w-[75%]">
                      {" "}
                      <p> SGST</p>
                    </div>
                    <div className="w-full text-end">
                      {" "}
                      <p className="text-end">
                        {oneOrganization.baseCurrency}{" "}
                        {salesOrderState.sgst ? salesOrderState.sgst : "0.00"}
                      </p>
                    </div>
                  </div>

                  <div className="flex mt-2">
                    <div className="w-[75%]">
                      {" "}
                      <p> CGST</p>
                    </div>
                    <div className="w-full text-end">
                      {" "}
                      <p className="text-end">
                        {oneOrganization.baseCurrency}{" "}
                        {salesOrderState.cgst ? salesOrderState.cgst : "0.00"}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* {!isIntraState && ( */}
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p> Total Tax</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {" "}
                    {oneOrganization.baseCurrency} {salesOrderState?.totalTax}
                  </p>
                </div>
              </div>
              {/* )} */}

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Other Expense</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {oneOrganization?.baseCurrency}{" "}
                    {salesOrderState.otherExpenseAmount
                      ? salesOrderState.otherExpenseAmount
                      : "0.00"}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Freight</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {oneOrganization?.baseCurrency}{" "}
                    {salesOrderState.freightAmount
                      ? salesOrderState.freightAmount
                      : "0.00"}
                  </p>
                </div>
              </div>

              <div className="flex ">
                <div className="w-[75%]">
                  {" "}
                  <p>Rount Off Amount</p>
                </div>
                <div className="w-full text-end">
                  {" "}
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {salesOrderState.roundOffAmount
                      ? salesOrderState.roundOffAmount
                      : "0.00"}
                  </p>
                </div>
              </div>
              <div className="flex ">
                <div className="w-[150%]">
                  {" "}
                  <p>Bill Discount</p>
                  <div className=""></div>
                </div>

                <div className=" ">
                  <div className="border border-inputBorder rounded-lg flex items-center justify-center p-1 gap-1">
                    <input
                      onChange={handleChange}
                      value={salesOrderState?.discountTransactionAmount}
                      name="discountTransactionAmount"
                      type="number"
                      step="0.01"
                      placeholder="0"
                      className="w-[60px] focus:outline-none text-center"
                    />
                    <select
                      className="text-xs text-zinc-400 bg-white relative"
                      onChange={handleChange}
                      value={salesOrderState?.discountTransactionType}
                      name="transactionDiscountType"
                    >
                      <option value="Percentage">%</option>
                      <option value="Currency">
                        {oneOrganization.baseCurrency}
                      </option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center text-gray-700 ms-1">
                      <CehvronDown color="gray" height={15} width={15} />
                    </div>
                  </div>
                </div>
                <div className="w-full text-end">
                  <p className="text-end">
                    {oneOrganization.baseCurrency}{" "}
                    {salesOrderState.transactionDiscount // Previously `discountTransactionAmount`
                      ? salesOrderState.transactionDiscount
                      : "0.00"}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex text-black my-4">
              <div className="w-[75%] font-bold">
                {" "}
                <p>Total</p>
              </div>
              <div className="w-full text-end font-bold text-base">
                {" "}
                <p className="text-end">
                  {salesOrderState?.totalAmount &&
                    `${oneOrganization.baseCurrency} ${salesOrderState.totalAmount}`}
                </p>
              </div>
            </div>

            <div className="flex gap-4 m-5 justify-end">
              {" "}
              <Button variant="secondary" size="sm" onClick={handleGoBack}>
                Cancel
              </Button>
              {/* <Button variant="secondary" size="sm">
                <PrinterIcon height={18} width={18} color="currentColor" />
                Print
              </Button> */}
              <Button variant="primary" size="sm" onClick={handleSave}>
                Save & send
              </Button>{" "}
            </div>
          </div>
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default NewSalesOrder;

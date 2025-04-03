import { ChangeEvent, useContext, useEffect, useRef, useState } from "react";
import Button from "../../../Components/Button";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Upload from "../../../assets/icons/Upload";
import Modal from "../../../Components/model/Modal";
import PlusCircle from "../../../assets/icons/PlusCircle";
import Globe from "../../../assets/icons/Globe";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import PhoneInput from "react-phone-input-2";
import Pen from "../../../assets/icons/Pen";
import { CustomerEditResponseContext } from "../../../context/ContextShare";
import { CustomerData } from "../../../Types/Customet";
import Plus from "../../../assets/icons/Plus";
import PencilEdit from "../../../assets/icons/PencilEdit";


type Props = { customerDataPorps?: any; addressEdit?: string, page?: string };


const EditCustomerModal = ({ customerDataPorps, addressEdit, page }: Props) => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [currencyData, setcurrencyData] = useState<any | []>([]);
  const [countryData, setcountryData] = useState<any | []>([]);
  const [stateList, setStateList] = useState<any | []>([]);
  const [shippingstateList, setshippingStateList] = useState<any | []>([]);
  const [openingType, setOpeningtype] = useState<any | null>("Debit");
  const shippingAddressRef = useRef<HTMLDivElement | null>(null);
  const BillingAddressRef = useRef<HTMLDivElement | null>(null);
  const [activeTab, setActiveTab] = useState<string>("otherDetails");
  const [paymentTerms, setPaymentTerms] = useState<any | []>([]);
  const [gstOrVat, setgstOrVat] = useState<any | []>([]);
  const [oneOrganization, setOneOrganization] = useState<any | []>([]);
  const [placeOfSupplyList, setPlaceOfSupplyList] = useState<any | []>([]);
  const { request: editCustomerDetails } = useApi("put", 7002);
  const { request: getCountryData } = useApi("get", 7004);
  const { request: getCurrencyData } = useApi("get", 7004);
  const { request: getPaymentTerms } = useApi("get", 7004);
  const { request: getOrganization } = useApi("get", 7004);
  const { request: getTax } = useApi("get", 7002);


  const { setcustomereditResponse } = useContext(CustomerEditResponseContext)!;
  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    companyName: false,
    customerDisplayName: false,
    customerEmail: false,
    pan: false,
    creditDays: false,
    creditLimits: false,
    websiteURL: false,
    gstin_uin: false,
    businessLegalName: false,
    businessTradeName: false,
    billingAttention: false,
    billingAddressLine1: false,
    billingAddressLine2: false,
    billingCity: false,
    shippingAttention: false,
    shippingAddress1: false,
    shippingAddress2: false,
    shippingCity: false,
    shippingFaxNumber: false,
  });
  const [customerdata, setCustomerData] = useState<CustomerData>({
    customerProfile: "",
    _id: "",
    customerType: "Individual",
    salutation: "Mr.",
    firstName: "",
    lastName: "",
    companyName: "",
    customerDisplayName: "",
    customerEmail: "",
    workPhone: "",
    mobile: "",
    dob: new Date().toISOString().slice(0, 10),
    cardNumber: "",
    pan: "",
    currency: "",
    creditOpeningBalance: "",
    debitOpeningBalance: "",
    paymentTerms: "",
    enablePortal: false,
    creditDays: "",
    creditLimits: "",
    interestPercentage: "",
    documents: "",
    department: "",
    designation: "",
    websiteURL: "",
    taxType: "",
    taxReason: "",
    taxPreference: "",
    gstTreatment: "",
    gstin_uin: "",
    placeOfSupply: "",
    businessLegalName: "",
    businessTradeName: "",
    vatNumber: "",
    billingAttention: "",
    billingCountry: "",
    billingAddressLine1: "",
    billingAddressLine2: "",
    billingCity: "",
    billingState: "",
    billingPinCode: "",
    billingPhone: "",
    billingFaxNumber: "",
    shippingAttention: "",
    shippingCountry: "",
    shippingAddress1: "",
    shippingAddress2: "",
    shippingCity: "",
    shippingState: "",
    shippingPinCode: "",
    shippingPhone: "",
    shippingFaxNumber: "",
    contactPerson: [
      {
        salutation: "Mr.",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
      },
    ],
    remark: "",
  });
  const [rows, setRows] = useState([
    {
      salutation: "",
      firstName: "",
      lastName: "",
      email: "",
      mobile: "",
      firstNameError: "",
      lastNameError: "",
      emailError: "",
      mobileError: "",
    },
  ]);

  const addRow = () => {
    setRows((prevRows) => [
      ...prevRows,
      {
        salutation: "",
        firstName: "",
        lastName: "",
        email: "",
        mobile: "",
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: "",
      },
    ]);
  };

  // console.log(customerdata,"data");
  // console.log(customerDataPorps,"props");

  const closeModal = () => {
    setModalOpen(false);
  };

  const getTabClassName = (tabName: string) => {
    return activeTab === tabName
      ? "cursor-pointer font-bold text-darkRed"
      : "cursor-pointer font-bold";
  };

  const getBorderClassName = (tabName: string) => {
    return activeTab === tabName ? "border-darkRed" : "border-neutral-300";
  };

  const addressscroll = () => {
    if (addressEdit === "shippingAddressEdit" && shippingAddressRef.current) {
      shippingAddressRef.current.scrollIntoView({ behavior: 'smooth' });
    }
    if (addressEdit === "billingAddressEdit" && BillingAddressRef.current) {
      BillingAddressRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }

  // data from checkboxes
  const handleRadioChange = (type: string, field: "customerType") => {
    setCustomerData((prevFormData) => ({
      ...prevFormData,
      [field]: type,
    }));

    if (field === "customerType") {
      setSelected(type);
    }
  };

  //data from table
  const handleRowChange = (
    index: number,
    field: keyof (typeof rows)[number],
    value: string
  ) => {
    const updatedRows = [...rows];

    updatedRows[index][field] = value;

    if (field === "firstName") {
      updatedRows[index].firstNameError = value.trim() === ""
        ? ""
        : /^[A-Za-z]+$/.test(value)
          ? ""
          : "Only letters.";
    } else if (field === "lastName") {
      updatedRows[index].lastNameError = value.trim() === ""
        ? ""
        : /^[A-Za-z]+$/.test(value)
          ? ""
          : "Only letters.";
    } else if (field === "email") {
      updatedRows[index].emailError = value.trim() === ""
        ? ""
        : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
          ? ""
          : "Invalid email.";
    } else if (field === "mobile") {
      updatedRows[index].mobileError = value.trim() === ""
        ? ""
        : /^[0-9]+$/.test(value)
          ? ""
          : "Only numbers.";
    }

    setRows(updatedRows);

    const updatedContactPerson = updatedRows.map((row) => ({
      salutation: row.salutation,
      firstName: row.firstName,
      lastName: row.lastName,
      email: row.email,
      mobile: row.mobile,
      firstNameError: row.firstNameError || "",
      lastNameError: row.lastNameError || "",
      emailError: row.emailError || "",
      mobileError: row.mobileError || ""
    }));

    setCustomerData((prevFormData) => ({
      ...prevFormData,
      contactPerson: updatedContactPerson
    }));
  };



  const handlePhoneChange = (phoneType: string, value: string) => {
    setCustomerData((prevData) => ({
      ...prevData,
      [phoneType]: value,
    }));
  };
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/png"];
      if (!validTypes.includes(file.type)) {
        toast.error("Only JPG and PNG images are supported.");
        return;
      }

      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setCustomerData((prevDetails: any) => ({
          ...prevDetails,
          customerProfile: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, type, value } = e.target;

    if (customerdata.customerType === "Business" && name === "companyName") {
      setCustomerData({ ...customerdata, customerDisplayName: value });
    }

    if (
      customerdata.customerType === "Individual" &&
      (name === "firstName" || name === "lastName")
    ) {
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: value,
        customerDisplayName: `${name === "firstName" ? value : prevData.firstName || ""} ${name === "lastName" ? value : prevData.lastName || ""
          }`.trim(),
      }));
    }

    if (type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setCustomerData((prevData) => ({
        ...prevData,
        [name]: checked,
      }));
    } else {
      if (name !== "openingBalance") {
        setCustomerData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      }
    }

    if (name === "openingType") {
      setOpeningtype(value);

      if (value === "Debit") {
        setCustomerData((prevData) => {
          const updatedData = {
            ...prevData,
            debitOpeningBalance: prevData.creditOpeningBalance,
          };
          delete updatedData.creditOpeningBalance;
          return updatedData;
        });
      } else if (value === "Credit") {
        setCustomerData((prevData) => {
          const updatedData = {
            ...prevData,
            creditOpeningBalance: prevData.debitOpeningBalance,
          };
          delete updatedData.debitOpeningBalance;
          return updatedData;
        });
      }
    }

    if (name === "openingBalance") {
      if (openingType === "Credit") {
        setCustomerData((prevData) => {
          const updatedData = {
            ...prevData,
            creditOpeningBalance: value,
          };
          delete updatedData.debitOpeningBalance;
          return updatedData;
        });
      } else if (openingType === "Debit") {
        setCustomerData((prevData) => {
          const updatedData = {
            ...prevData,
            debitOpeningBalance: value,
          };
          delete updatedData.creditOpeningBalance;
          return updatedData;
        });
      }
    }
  };




  const getAdditionalData = async () => {
    try {
      // Fetching currency data
      const Currencyurl = `${endponits.GET_CURRENCY_LIST}`;
      const { response, error } = await getCurrencyData(Currencyurl);

      if (!error && response) {
        setcurrencyData(response?.data);
        // console.log(response.data, "currencyData");
      }

      const paymentTermsUrl = `${endponits.GET_PAYMENT_TERMS}`;
      const { response: paymentTermResponse, error: paymentTermError } =
        await getPaymentTerms(paymentTermsUrl);

      if (!paymentTermError && paymentTermResponse) {
        setPaymentTerms(paymentTermResponse.data);
        // console.log(paymentTermResponse.data);
      }

      const taxUrl = `${endponits.GET_TAX}`;
      const { response: taxResponse, error: taxError } = await getTax(taxUrl);

      if (!taxError && taxResponse) {
        if (taxResponse) {
          // console.log(taxResponse.data.taxType, "tax");

          setgstOrVat(taxResponse.data);
        }
      } else {
        console.log(taxError.response.data, "tax");
      }

      const CountryUrl = `${endponits.GET_COUNTRY_DATA}`;
      const { response: countryResponse, error: countryError } =
        await getCountryData(CountryUrl);
      if (!countryError && countryResponse) {
        // console.log(countryResponse.data[0].countries, "country");
        setcountryData(countryResponse?.data[0].countries);
      } else {
        console.log(countryError, "country");
      }
    } catch (error) {
      console.log("Error in fetching currency data or payment terms", error);
    }
  };

  const handleCopyAddress = (e: any) => {
    e.preventDefault();
    setCustomerData((prevData) => ({
      ...prevData,
      shippingAttention: customerdata.billingAttention,
      shippingCountry: customerdata.billingCountry,
      shippingAddress1: customerdata.billingAddressLine1,
      shippingAddress2: customerdata.billingAddressLine2,
      shippingCity: customerdata.billingCity,
      shippingState: customerdata.billingState,
      shippingPinCode: customerdata.billingPinCode,
      shippingPhone: customerdata.billingPhone,
      shippingFaxNumber: customerdata.billingFaxNumber,
    }));
  };

  useEffect(() => {
    addressscroll()
  }, [addressscroll])

  useEffect(() => {
    if (customerdata.billingCountry) {
      const country = countryData.find(
        (c: any) => c.name === customerdata.billingCountry
      );
      if (country) {
        setStateList(country.states || []);
      }
    }

    if (customerdata.shippingCountry) {
      const country = countryData.find(
        (c: any) => c.name === customerdata.shippingCountry
      );
      if (country) {
        setshippingStateList(country.states || []);
      }
    }
  }, [customerdata.shippingCountry, customerdata.billingCountry, countryData]);



  const handleEdit = async () => {
    const newErrors = { ...errors };

    if (customerdata.customerDisplayName === "") {
      newErrors.customerDisplayName = true;
    }
    if (Object.values(newErrors).some((error) => error)) {
      setErrors(newErrors);
      return;
    }
    const url = `${endponits.EDIT_CUSTOMER}/${customerdata._id}`;
    try {
      const apiResponse = await editCustomerDetails(url, customerdata);
      // console.log(apiResponse);
      const { response, error } = apiResponse;
      if (!error && response) {
        setModalOpen(false);
        toast.success(response.data.message);
        setcustomereditResponse((prevCustomerResponse: any) => ({
          ...prevCustomerResponse,
          customerdata,
        }));
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleplaceofSupply = () => {
    if (oneOrganization.organizationCountry) {
      const country = countryData.find(
        (c: any) =>
          c.name.toLowerCase() ===
          oneOrganization.organizationCountry.toLowerCase()
      );

      if (country) {
        const states = country.states;
        // console.log("States:", states);

        setPlaceOfSupplyList(states);
      } else {
        console.log("Country not found");
      }
    } else {
      console.log("No country selected");
    }
  };

  const getOneOrganization = async () => {
    try {
      const url = `${endponits.GET_ONE_ORGANIZATION}`;
      const apiResponse = await getOrganization(url);

      const { response, error } = apiResponse;

      if (!error && response?.data) {
        setOneOrganization(response.data);
        // console.log(response.data,"org");
      }
    } catch (error) {
      console.error("Error fetching organization:", error);
    }
  };

  useEffect(() => {
    getOneOrganization();
    if (addressEdit) {
      setActiveTab("address");
    }
  }, []);

  useEffect(() => {
    handleplaceofSupply();
  }, [getOneOrganization]);

  useEffect(() => {
    getAdditionalData();
    if (customerDataPorps) {
      setCustomerData(customerDataPorps);
      const mappedContactPerson = (customerDataPorps.contactPerson || []).map((person: any) => ({
        ...person,
        firstNameError: "",
        lastNameError: "",
        emailError: "",
        mobileError: ""
      }));
      setRows(mappedContactPerson);
      setSelected(customerDataPorps.customerType);
    }
  }, [customerDataPorps]);



  useEffect(() => {
    addressscroll();
  }, [addressEdit, addressscroll]);

  return (
    <div>
      {addressEdit ? (
        <button onClick={() => setModalOpen(true)}>
          <Pen color={"#303F58"} />
        </button>
      ) : page === "editCustomer" ? (
        <div onClick={() => setModalOpen(true)} className="cursor-pointer">
          <PencilEdit color={"#0B9C56"} />
        </div>) : (
        <Button
          onClick={() => setModalOpen(true)}
          variant="secondary"
          size="sm"
          className="text-[10px] h-6 px-5"
        >
          <Pen color={"#303F58"} />
          Edit
        </Button>
      )}


      <Modal
        open={isModalOpen}
        onClose={() => setModalOpen(false)}
        className="w-[95%] sm:w-[80%]"
      >
        <>
          <div className="text-start p-5 mt-3">
            <div className="mb-5 flex p-2 rounded-xl bg-CreamBg relative overflow-hidden items-center">
              <div className="relative ">
                <h3 className="text-lg font-bold text-textColor">
                  Edit Customer
                </h3>
              </div>
              <div
                className="ms-auto text-3xl cursor-pointer relative z-10"
                onClick={() => setModalOpen(false)}
              >
                &times;
              </div>
            </div>
            <form
              className="text-slate-600 text-sm overflow-scroll hide-scrollbar space-y-2 p-2"
              style={{ height: "480px" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4">
                <div className="col-span-12 sm:col-span-2  border border-inputBorder border-dashed rounded-lg items-center justify-center flex text-center py-3 ">
                  <label htmlFor="image">
                    <div
                      className="bg-lightPink flex items-center justify-center h-16 w-36 rounded-lg "

                    >
                      {customerdata.customerProfile ? (
                        <img src={customerdata.customerProfile} alt="Item" className="max-h-16 max-w-36" />
                      ) : (<div className="gap-4 flex items-center ">
                        <div className="bg-darkRed rounded-full flex items-center w-6 h-6 justify-center">
                          <Plus color={"white"} classname="h-5" />
                        </div>
                        <p>Add Image</p>
                      </div>
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-textColor mt-1">
                        Upload Photo
                      </p>
                      <p className="text-xs text-[#818894] mt-1">Support: JPG, PNG</p>
                    </div>
                    <input
                      type="file"
                      id="image"
                      onChange={handleFileChange}
                      className="hidden"
                      name="itemImage"
                      accept="image/*"
                    />
                  </label>
                </div>
                <div className="col-span-10">
                  <div className="mt-3">
                    <label
                      className="block text-sm mb-1 text-labelColor"
                      htmlFor=""
                    >
                      Customer Type
                    </label>
                    <div className="flex items-center space-x-4 text-textColor text-sm">
                      <div className="flex gap-2 justify-center items-center">
                        <div className="grid place-items-center mt-1">
                          <input
                            id="Business"
                            type="radio"
                            name="customerType"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${selected === "Business"
                              ? "border-8 border-neutral-400"
                              : "border-1 border-neutral-400"
                              }`}
                            checked={selected === "Business"}
                            onChange={() =>
                              handleRadioChange("Business", "customerType")
                            }
                          />
                          <div
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${selected === "Business"
                              ? "bg-neutral-100"
                              : "bg-transparent"
                              }`}
                          />
                        </div>
                        <label
                          htmlFor="Business"
                          className="text-start font-medium"
                        >
                          Business
                        </label>
                      </div>
                      <div className="flex gap-2 justify-center items-center">
                        <div className="grid place-items-center mt-1">
                          <input
                            id="Individual"
                            type="radio"
                            name="customerType"
                            className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${selected === "Individual"
                              ? "border-8 border-neutral-400"
                              : "border-1 border-neutral-400"
                              }`}
                            checked={selected === "Individual"}
                            onChange={() =>
                              handleRadioChange("Individual", "customerType")
                            }
                          />
                          <div
                            className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${selected === "Individual"
                              ? "bg-neutral-100"
                              : "bg-transparent"
                              }`}
                          />
                        </div>
                        <label
                          htmlFor="Individual"
                          className="text-start font-medium"
                        >
                          Individual
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-12 gap-x-4 mt-2">
                    <div className="col-span-2">
                      <label htmlFor="salutation">Salutation</label>
                      <div className="relative w-full">
                        <select
                          name="salutation"
                          className="block appearance-none w-full h-9 mt-0.5 text-[#818894] bg-white border border-inputBorder text-sm  pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                          value={customerdata.salutation}
                          onChange={handleChange}
                        >
                          <option defaultChecked value="Mr.">
                            Mr.
                          </option>
                          <option value="Mrs.">Mrs.</option>
                          <option value="Ms.">Ms.</option>
                          <option value="Dr.">Dr.</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 left-5 sm:left-24 flex items-center px-2 text-gray-700">
                          <CehvronDown color="gray" />
                        </div>
                      </div>
                    </div>
                    <div className="ms-8 sm:ms-0 grid grid-cols-1 sm:grid-cols-2 col-span-10 gap-4 ">
                      <div>
                        <label htmlFor="firstName" className="text-slate-600">
                          First Name
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          className="pl-2 text-sm w-[100%]  mt-0.5 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                          placeholder="Enter First Name"
                          value={customerdata.firstName}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleChange(e);
                            setErrors((prevErrors) => ({
                              ...prevErrors,
                              firstName:
                                value && !/^[A-Za-z\s]+$/.test(value)
                                  ? true
                                  : false,
                            }));
                          }}
                        />
                        {errors.firstName && customerdata.firstName.length > 0 && (
                          <div className="text-red-800 text-xs ms-2 mt-1">
                            Please enter a valid first name (letters only).
                          </div>
                        )}
                      </div>

                      <div>
                        <label htmlFor="lastName" className="text-slate-600">
                          Last Name
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          className="pl-2 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                          placeholder="Enter Last Name"
                          value={customerdata.lastName}
                          onChange={(e) => {
                            const value = e.target.value;
                            handleChange(e);
                            if (value && !/^[A-Za-z\s]+$/.test(value)) {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                lastName: true,
                              }));
                            } else {
                              setErrors((prevErrors) => ({
                                ...prevErrors,
                                lastName: false,
                              }));
                            }
                          }}
                        />

                        {errors.lastName && customerdata.lastName.length > 0 && (
                          <div className="text-red-800 text-xs ms-2 mt-1">
                            Please enter a valid first name (letters only).
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-4 gap-y-2 mt-2 ">
                {customerdata.customerType === "Business" && <div>
                  <label htmlFor="companyName">Company Name </label>
                  <input
                    type="text"
                    name="companyName"
                    className="pl-2 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                    placeholder="Enter Company Name"
                    value={customerdata.companyName}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);
                      if (!value || !/^[A-Za-z0-9\s\W]+$/.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          companyName: true,
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          companyName: false,
                        }));
                      }
                    }}
                  />

                  {errors.companyName &&
                    customerdata.companyName.length > 0 && (
                      <div className="text-red-800 text-xs ms-2 mt-1">
                        Please enter a valid Company Name (letters only).
                      </div>
                    )}
                </div>}
                <div>
                  <label htmlFor="companyName">Customer Display Name </label>
                  <input
                    required
                    type="text"
                    name="customerDisplayName"
                    className="pl-2 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                    placeholder="Enter Display Name"
                    value={customerdata.customerDisplayName}
                    onChange={(e) => {
                      const value = e.target.value;
                      handleChange(e);

                      if (!value || !/^[A-Za-z0-9\s\W]+$/.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerDisplayName: true,
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerDisplayName: false,
                        }));
                      }
                    }}
                  />

                  {errors.customerDisplayName && (
                    <div className="text-red-800 text-xs ms-2 mt-1">
                      Please enter a Customer Display Name.
                    </div>
                  )}
                </div>

                <div>
                  <label htmlFor="customerEmail">Customer Email</label>
                  <input
                    type="email"
                    name="customerEmail"
                    className="pl-2 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                    placeholder="Enter Email"
                    value={customerdata.customerEmail}
                    onChange={handleChange}
                    onBlur={(e) => {
                      const value = e.target.value;

                      // Email validation regex
                      const emailRegex =
                        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                      // Only validate if the field is not empty
                      if (value && !emailRegex.test(value)) {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerEmail: true,
                        }));
                      } else {
                        setErrors((prevErrors) => ({
                          ...prevErrors,
                          customerEmail: false,
                        }));
                      }
                    }}
                  />

                  {errors.customerEmail && (
                    <div className="text-red-800 text-xs ms-2 mt-1">
                      Please enter a valid email address.
                    </div>
                  )}
                </div>
                {/* <div className="hidden">
                  <label htmlFor="cardNumber">Membership Card Number</label>
                  <input
                    type="tel"
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                    placeholder="Enter Card Number"
                    name="cardNumber"
                    value={customerdata.cardNumber}
                    onChange={handleChange}
                  />
                </div> */}

                {customerdata.customerType === "Individual" && <div>
                  <label htmlFor="">Work Phone</label>
                  <PhoneInput
                    inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    inputStyle={{ height: "38px", width: "100%" }}
                    containerStyle={{ width: "100%" }}
                    country={"in"}
                    value={customerdata.workPhone}
                    onChange={(e) => handlePhoneChange("workPhone", e)}
                  />
                </div>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 mt-2 gap-x-4">
                {customerdata.customerType === "Business" && <div>
                  <label htmlFor="">Work Phone</label>
                  <PhoneInput
                    inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    inputStyle={{ height: "38px", width: "100%" }}
                    containerStyle={{ width: "100%" }}
                    country={"in"}
                    value={customerdata.workPhone}
                    onChange={(e) => handlePhoneChange("workPhone", e)}
                  />
                </div>}
                <div>
                  <label htmlFor="">Mobile</label>
                  <PhoneInput
                    inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    inputStyle={{ height: "38px", width: "100%" }}
                    containerStyle={{ width: "100%" }}
                    country={"in"}
                    value={customerdata.mobile}
                    onChange={(e) => handlePhoneChange("mobile", e)}
                  />
                </div>
                <div>
                  <label htmlFor="dob">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    className="pl-2 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                    placeholder="Value"
                    value={customerdata.dob}
                    onChange={handleChange}
                    max={new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              <div className=" flex-row sm:flex mt-5 px-0 sm:px-5">
                <div className="w-full sm:w-[20%] bg-gray-100 p-4">
                  <ul className="h-full flex sm:block space-x-2 sm:space-x-0 space-y-0 border-gray-300 text-slate-700 overflow-auto">
                    <li
                      className={`${getTabClassName("otherDetails")} 
                   sm:border-r-4 ${getBorderClassName("otherDetails")} 
                  p-2`}
                      onClick={() => setActiveTab("otherDetails")}
                    >
                      Other Details
                    </li>
                    <li
                      className={`${getTabClassName("taxes")} 
                   sm:border-r-4 ${getBorderClassName("taxes")} 
                  p-2`}
                      onClick={() => setActiveTab("taxes")}
                    >
                      Taxes
                    </li>
                    <li
                      className={`${getTabClassName("address")} 
                   sm:border-r-4 ${getBorderClassName("address")} 
                  p-2`}
                      onClick={() => setActiveTab("address")}
                    >
                      Address
                    </li>
                    <li
                      className={`${getTabClassName("contactPersons")} 
                   sm:border-r-4 ${getBorderClassName("contactPersons")} 
                  p-2`}
                      onClick={() => setActiveTab("contactPersons")}
                    >
                      Contact Persons
                    </li>
                    <li
                      className={`${getTabClassName("remarks")} 
                   sm:border-r-4 ${getBorderClassName("remarks")} 
                  p-2`}
                      onClick={() => setActiveTab("remarks")}
                    >
                      Remarks
                    </li>
                  </ul>
                </div>

                <div className=" w-full  sm:ps-16">
                  {activeTab === "otherDetails" && (
                    <div className="space-y-2  p-4 ">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2">
                        <div>
                          <label className="block mb-0.5">Opening Balance</label>
                          <div className="flex">
                            <div className="relative w-20 ">
                              <select
                                className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                   text-sm pl-2 pr-2 rounded-l-md leading-tight 
                                   focus:outline-none focus:bg-white focus:border-gray-500"
                                name="openingType"
                                value={customerdata.creditOpeningBalance ? "Credit" : "Debit"}
                                onChange={handleChange}
                              >
                                <option value="Debit">Dr</option>

                                <option value="Credit">Cr</option>
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                            <input
                              type="text"
                              value={customerdata.creditOpeningBalance ? customerdata.creditOpeningBalance : customerdata.debitOpeningBalance}
                              className="text-sm w-[100%] rounded-r-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                              placeholder={`Enter ${openingType} Opening Balance`}
                              onChange={(e) => {
                                const value = e.target.value;

                                if (/^\d*$/.test(value)) {
                                  handleChange(e);

                                  if (openingType === "Debit") {
                                    setCustomerData((prevData) => ({
                                      ...prevData,
                                      debitOpeningBalance: value,
                                    }));
                                  } else {
                                    setCustomerData((prevData) => ({
                                      ...prevData,
                                      creditOpeningBalance: value,
                                    }));
                                  }
                                }
                              }}
                              name="openingBalance"

                            />
                          </div>
                        </div>
                        <div>
                          <label className="block mb-0.5">PAN</label>
                          <div>
                            <input
                              type="text"
                              className="text-sm w-[100%] rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                              placeholder="Enter PAN Number"
                              name="pan"
                              value={customerdata.pan}
                              onChange={(e) => {
                                const value = e.target.value;

                                if (
                                  value === "" ||
                                  /^[a-zA-Z0-9]*$/.test(value)
                                ) {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    pan: false,
                                  }));
                                } else {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    pan: true,
                                  }));
                                }
                              }}
                            />

                            {errors.pan && (
                              <div className="text-red-800 text-xs mt-1">
                                Only alphanumeric characters are allowed for
                                PAN.
                              </div>
                            )}
                          </div>
                        </div>

                        <div>
                          <div className="">
                            <label htmlFor="" className="block mb-0.5">
                              Currency
                            </label>
                            <div className="relative w-full">
                              <select
                                className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                 text-sm pl-2 pr-8 rounded-md leading-tight 
                                 focus:outline-none focus:bg-white focus:border-gray-500"
                                name="currency"
                                value={customerdata.currency}
                                onChange={handleChange}
                              >
                                <option value="">Select Currency</option>

                                {currencyData.map(
                                  (item: any, index: number) => (
                                    <option
                                      key={index}
                                      value={item.currencyCode}
                                    >
                                      {item.currencyName} ({item.currencySymbol}
                                      )
                                    </option>
                                  )
                                )}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="relative w-full">
                          <label htmlFor="" className="block mb-0.5">
                            Payment Terms
                          </label>
                          <select
                            className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                 text-sm pl-2 pr-8 rounded-md leading-tight 
                                 focus:outline-none focus:bg-white focus:border-gray-500"
                            name="paymentTerms"
                            value={customerdata.paymentTerms}
                            onChange={handleChange}
                          >
                            <option value="" className="text-gray">
                              Select Payment Terms
                            </option>
                            {paymentTerms &&
                              paymentTerms.map((item: any) => (
                                <option
                                  key={item._id}
                                  value={item.name}
                                  className="text-gray"
                                >
                                  {item.name}
                                </option>
                              ))}
                          </select>
                          <div className="pointer-events-none absolute inset-y-0  mt-6 right-0 flex items-center px-2 text-gray-700">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
                          <label className="block mb-0.5">Credit Days</label>
                          <input
                            type="text"
                            className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-p p-2 text-[#818894]"
                            placeholder="Enter Credit Days"
                            name="creditDays"
                            value={customerdata.creditDays}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "" || /^[0-9]+$/.test(value)) {
                                handleChange(e);
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  creditDays: false,
                                }));
                              } else {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  creditDays: true,
                                }));
                              }
                            }}
                          />
                          {errors.creditDays &&
                            customerdata.creditDays !== "" && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid number for Credit Days.
                              </div>
                            )}
                        </div>

                        <div>
                          <label className="block mb-0.5">Credit Limit</label>
                          <input
                            type="text"
                            className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-p p-2 text-[#818894]"
                            placeholder="Enter Credit Limit"
                            name="creditLimits"
                            value={customerdata.creditLimits}
                            onChange={(e) => {
                              const value = e.target.value;

                              if (value === "" || /^[0-9]+$/.test(value)) {
                                handleChange(e);
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  creditLimits: false,
                                }));
                              } else {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  creditLimits: true,
                                }));
                              }
                            }}
                          />
                          {errors.creditLimits &&
                            customerdata.creditLimits !== "" && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid number for Credit Limit.
                              </div>
                            )}
                        </div>

                        <div>
                          <label className="block mb-0.5">
                            Interest Percentage
                          </label>
                          <input
                            type="text"
                            inputMode="decimal"
                            pattern="[0-9]*"
                            className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-p p-2 text-[#818894]"
                            placeholder="%"
                            name="interestPercentage"
                            value={customerdata.interestPercentage}
                            onChange={handleChange}
                            onKeyPress={(e) => {
                              if (
                                !/[0-9.]/.test(e.key) ||
                                (e.key === "." &&
                                  e.currentTarget.value.includes("."))
                              ) {
                                e.preventDefault();
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="bg-lightPink p-5 rounded-lg space-y-5">
                        <p className="font-bold text-">Enable Portal?</p>
                        <div className="flex items-center mt-4 gap-1 text-textColor">
                          <input
                            name="enablePortal"
                            checked={customerdata.enablePortal}
                            onClick={(e: any) => handleChange(e)}
                            type="checkbox"
                            className=" h-6 w-5 mx-1 customCheckbox"
                            id=""
                          />
                          <label htmlFor="" className="text-textColor text-sm ">
                            Allow portal access to this customer
                          </label>
                        </div>
                        <div className="relative w-full sm:w-[349px]">
                          <label htmlFor="" className="block mb-0.5 ">
                            Select Language
                          </label>
                          <select
                            className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder 
                                 text-sm pl-2 pr-8 rounded-md leading-tight 
                                 focus:outline-none focus:bg-white focus:border-gray-500"
                            name="currency"
                            // value={customerdata.}
                            onChange={handleChange}
                          >
                            <option
                              value="Payment On Due"
                              className="text-gray"
                            >
                              English
                            </option>
                          </select>
                          <div className="pointer-events-none absolute inset-y-0  mt-6 right-0 flex items-center px-2 text-gray-700">
                            <CehvronDown color="gray" />
                          </div>
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block mb-1">
                          Documents
                          <div className="border-dashed border border-neutral-300 p-2 rounded flex gap-2">
                            <Upload />
                            <span>Upload File</span>
                          </div>
                          <p className="text-xs mt-1 text-gray-600">
                            You Can Upload a Maximum of 10 Files, 10 MB each
                          </p>
                          <input
                            type="file"
                            className="hidden"
                            value={customerdata.documents}
                            name="documents"
                          // onChange={(e)=>handleFileChange(e)}
                          />
                        </label>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block mb-0.5">Derpartment</label>
                          <input
                            type="text"
                            className=" text-sm w-full rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                            placeholder="Enter Department"
                            name="department"
                            value={customerdata.department}
                            onChange={handleChange}
                          />
                        </div>

                        <div>
                          <label className="block mb-0.5">Designation</label>

                          <input
                            type="text"
                            className=" text-sm w-full rounded-md text-start bg-white border border-slate-300  h-9 p-2 text-[#818894]"
                            placeholder="Enter Designation"
                            name="designation"
                            value={customerdata.designation}
                            onChange={handleChange}
                          />
                        </div>
                      </div>

                      <div className="">
                        <label htmlFor="" className="block mb-0.5">
                          Website URL
                        </label>
                        <div className="relative w-full">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-2 text-gray-700">
                            <Globe />
                          </div>
                          <input
                            type="text"
                            className="text-sm w-full ps-9 rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                            placeholder="Enter website URL"
                            name="websiteURL"
                            value={customerdata.websiteURL}
                            onChange={(e) => {
                              const value = e.target.value;
                              const urlPattern =
                                /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;

                              setCustomerData((prevData) => ({
                                ...prevData,
                                websiteURL: value,
                              }));

                              if (value === "" || urlPattern.test(value)) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  websiteURL: false,
                                }));
                              } else if (
                                value &&
                                !urlPattern.test(value) &&
                                value.length > 4
                              ) {
                                setErrors((prevErrors) => ({
                                  ...prevErrors,
                                  websiteURL: true,
                                }));
                              }
                            }}
                          />
                        </div>{" "}
                        {errors.websiteURL &&
                          customerdata.websiteURL !== "" && (
                            <div className="text-red-800 text-xs mt-1">
                              Please enter a valid website URL (e.g.,
                              https://example.com).
                            </div>
                          )}
                      </div>
                    </div>
                  )}

                  {activeTab === "taxes" && (
                    <>



                      <>
                        {gstOrVat.taxType === "GST" && (
                          <div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                              <div className="relative w-full">
                                <label
                                  htmlFor="gstTreatment"
                                  className="block mb-0.5"
                                >
                                  GST Treatment
                                </label>
                                <select
                                  className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="gstTreatment"
                                  value={customerdata.gstTreatment}
                                  onChange={handleChange}
                                >
                                  <option value="" className="text-gray">
                                    Select GST Treatment
                                  </option>
                                  {gstOrVat?.gstTreatment?.map(
                                    (item: any, index: number) => (
                                      <option value={item} key={index}>
                                        {item}
                                      </option>
                                    )
                                  )}
                                </select>

                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                                  <CehvronDown color="gray" />
                                </div>
                              </div>

                              <div>
                                <label
                                  htmlFor="gstin_uin"
                                  className="block mb-0.5"
                                >
                                  GSTIN/UIN
                                </label>
                                <input
                                  type="text"
                                  name="gstin_uin"
                                  className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                  placeholder="GSTIN/UIN"
                                  value={customerdata.gstin_uin}
                                  onChange={(e) => {
                                    handleChange(e);
                                    const value = e.target.value;

                                    setCustomerData((prevData) => ({
                                      ...prevData,
                                      gstin_uin: value,
                                    }));
                                  }}
                                  onBlur={() => {
                                    const value = customerdata.gstin_uin;
                                    const gstinPattern =
                                      /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[A-Z0-9]{1}[Z]{1}[A-Z0-9]{1}$/;

                                    setErrors((prevErrors) => ({
                                      ...prevErrors,
                                      gstin_uin:
                                        value !== "" &&
                                        !gstinPattern.test(value),
                                    }));
                                  }}
                                />
                                {errors.gstin_uin &&
                                  customerdata.gstin_uin !== "" && (
                                    <div className="text-red-800 text-xs mt-1">
                                      Please enter a valid GSTIN/UIN (e.g.,
                                      22AAAAA0000A1Z5).
                                    </div>
                                  )}
                              </div>

                              <div>
                                <label
                                  htmlFor="businessLegalName"
                                  className="block mb-0.5"
                                >
                                  Business Legal Name
                                </label>

                                <input
                                  type="text"
                                  name="businessLegalName"
                                  className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                  placeholder="Enter Business Legal Name"
                                  value={customerdata.businessLegalName}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    const alphanumericPattern =
                                      /^[a-zA-Z0-9\s]*$/;

                                    if (
                                      alphanumericPattern.test(value) ||
                                      value === " "
                                    ) {
                                      handleChange(e);
                                      setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        businessLegalName: false,
                                      }));
                                    } else {
                                      setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        businessLegalName: true,
                                      }));
                                    }
                                  }}
                                />
                                {errors.businessLegalName &&
                                  customerdata.businessLegalName !== "" && (
                                    <div className="text-red-800 text-xs mt-1">
                                      Please enter a valid business legal name
                                      (letters and numbers only).
                                    </div>
                                  )}
                              </div>
                              <div>
                                <label
                                  htmlFor="businessTradeName"
                                  className="block mb-0.5"
                                >
                                  Business Trade Name
                                </label>
                                <input
                                  type="text"
                                  name="businessTradeName"
                                  className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                  placeholder="Enter Business Trade Name"
                                  value={customerdata.businessTradeName}
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    const alphanumericPattern =
                                      /^[a-zA-Z0-9\s]*$/;

                                    if (
                                      alphanumericPattern.test(value) ||
                                      value === ""
                                    ) {
                                      handleChange(e);
                                      setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        businessTradeName: false,
                                      }));
                                    } else {
                                      setErrors((prevErrors) => ({
                                        ...prevErrors,
                                        businessTradeName: true,
                                      }));
                                    }
                                  }}
                                />
                                {errors.businessTradeName &&
                                  customerdata.businessTradeName !== "" && (
                                    <div className="text-red-800 text-xs mt-1">
                                      Please enter a valid business trade name
                                      (letters and numbers only).
                                    </div>
                                  )}
                              </div>
                              <div className="relative w-full">
                                <label
                                  htmlFor="placeOfSupply"
                                  className="block mb-0.5"
                                >
                                  Place of Supply
                                </label>
                                <select
                                  className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                                  name="placeOfSupply"
                                  value={customerdata.placeOfSupply}
                                  onChange={handleChange}
                                >
                                  {placeOfSupplyList &&
                                    placeOfSupplyList.map(
                                      (item: any, index: number) => (
                                        <option
                                          key={index}
                                          value={item}
                                          className="text-gray"
                                        >
                                          {item}
                                        </option>
                                      )
                                    )}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 mt-6 text-gray-700">
                                  <CehvronDown color="gray" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                        {gstOrVat.taxType === "VAT" && (
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label
                                htmlFor="vatNumber"
                                className="block mb-0.5"
                              >
                                VAT Number
                              </label>
                              <input
                                type="text"
                                name="vatNumber"
                                className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                placeholder="Enter VAT Number"
                                value={customerdata.vatNumber}
                                onChange={handleChange}
                              />
                            </div>
                            <div>
                              <label
                                htmlFor="businessTradeName"
                                className="block mb-0.5"
                              >
                                Business Trade Name
                              </label>
                              <input
                                type="text"
                                name="businessTradeName"
                                className="text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                                placeholder="Enter Business Trade Name"
                                value={customerdata.businessTradeName}
                                onChange={handleChange}
                              />
                            </div>
                          </div>
                        )}
                      </>

                      {/* {taxPreference === "Tax Exempt" && (
                        <div>
                          <label className="block mb-0.5">Exemption Reason</label>
                          <input
                            type="text"
                            className="pl-2 text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                            placeholder="Value"
                            name="taxReason"
                            value={customerdata.taxReason}
                            onChange={handleChange}
                          />
                        </div>
                      )} */}
                    </>
                  )}

                  {activeTab === "address" && (
                    <>
                      {/* Billing Address */}
                      <div className="space-y-2 p-5 text-sm" ref={BillingAddressRef}>
                        <p>
                          <b>Billing Address</b>
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block mb-0.5">Attention</label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                              placeholder="Enter Attention"
                              name="billingAttention"
                              value={customerdata.billingAttention}
                              onChange={(e) => {
                                const value = e.target.value;

                                const attentionPattern = /^[a-zA-Z\s]*$/;

                                if (
                                  attentionPattern.test(value) ||
                                  value === ""
                                ) {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingAttention: false,
                                  }));
                                } else {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingAttention: true,
                                  }));
                                }
                              }}
                            />
                            {errors.billingAttention &&
                              customerdata.billingAttention !== "" && (
                                <div className="text-red-800 text-xs mt-1">
                                  Please enter a valid attention name (letters
                                  only).
                                </div>
                              )}
                          </div>

                          {/* Country */}
                          <div className="relative w-full">
                            <label
                              htmlFor="billingCountry"
                              className="mb-0.5 block"
                            >
                              Country/Region
                            </label>
                            <select
                              className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              name="billingCountry"
                              value={customerdata.billingCountry}
                              onChange={handleChange}
                            >
                              <option value="">Select a country</option>
                              {countryData && countryData.length > 0 ? (
                                countryData.map((item: any, index: number) => (
                                  <option key={index} value={item.name}>
                                    {item.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled>No countries available</option>
                              )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 mt-6 flex items-center px-2 text-gray-700">
                              <CehvronDown color="gray" />
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="">
                          <label
                            className="text-slate-600"
                            htmlFor="organizationAddress"
                          >
                            Address
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 ">



                          <div className="">
                            <input
                              className="pl-3 -mt-1.5 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 1"
                              name="billingAddressLine1"
                              value={customerdata.billingAddressLine1}
                              onChange={(e) => {
                                const value = e.target.value;

                                const addressPattern = /^[a-zA-Z0-9\s,]*$/;

                                if (addressPattern.test(value) || value === '') {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingAddressLine1: false,
                                  }));
                                } else {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingAddressLine1: true,
                                  }));
                                }
                              }}
                            />
                            {errors.billingAddressLine1 && customerdata.billingAddressLine1 !== "" && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid address (letter and numbers only).
                              </div>
                            )}
                          </div>

                          <div>
                            <input
                              className="pl-3 text-sm w-full -mt-1.5 text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 2"
                              name="billingAddressLine2"
                              value={customerdata.billingAddressLine2}
                              onChange={(e) => {
                                const value = e.target.value;

                                const addressPattern = /^[a-zA-Z0-9\s,]*$/;

                                if (addressPattern.test(value) || value === '') {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingAddressLine2: false,
                                  }));
                                } else {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingAddressLine2: true,
                                  }));
                                }
                              }}
                            />
                            {errors.billingAddressLine2 && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid address (letters, numbers, spaces, and commas only).
                              </div>
                            )}
                          </div>



                          <div>
                            <label className="text-slate-600 " htmlFor="">
                              City
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-0.5 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Enter City"
                              name="billingCity"
                              value={customerdata.billingCity}
                              onChange={(e) => {
                                const value = e.target.value;

                                const cityPattern = /^[a-zA-Z\s]*$/;

                                if (cityPattern.test(value) || value === '') {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingCity: false,
                                  }));
                                } else {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    billingCity: true,
                                  }));
                                }
                              }}
                            />
                            {errors.billingCity && customerdata.billingCity !== "" && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid city name (letters only).
                              </div>
                            )}
                          </div>

                          <div className="relative ">
                            <label
                              className="text-slate-600"
                              htmlFor="organizationAddress"
                            >
                              State / Region / County
                            </label>
                            <div className="relative w-full mt-0.5">
                              <select
                                value={customerdata.billingState}
                                onChange={handleChange}
                                name="billingState"
                                id="billingState"
                                className="block appearance-none w-full text-[#818894] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                disabled={!customerdata.billingCountry}
                              >
                                <option value="">
                                  State / Region / County
                                </option>
                                {stateList.length > 0 ? (
                                  stateList.map((item: any, index: number) => (
                                    <option key={index} value={item}>
                                      {item}
                                    </option>
                                  ))
                                ) : (
                                  <></>
                                )}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 ">
                          <div>
                            <label
                              className="text-slate-600"
                              htmlFor="billingPinCode"
                            >
                              Pin / Zip / Post code
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-0.5 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Pin / Zip / Post code"
                              type="text"
                              name="billingPinCode"
                              value={customerdata.billingPinCode}
                              onChange={(e) => {
                                const value = e.target.value;

                                const pinCodePattern = /^[0-9]*$/;

                                if (pinCodePattern.test(value)) {
                                  handleChange(e);
                                }
                              }}
                            />
                          </div>

                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Phone
                            </label>
                            <div className="w-full border-0 mt-0.5">
                              <PhoneInput
                                inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                inputStyle={{ height: "38px", width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                country={"in"}
                                value={customerdata.billingPhone}
                                onChange={(e) =>
                                  handlePhoneChange("billingPhone", e)
                                }
                              />
                            </div>
                          </div>
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-0.5 block">
                              Fax Number
                            </label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-slate-300 h-9 p-2 "
                              placeholder="Enter Fax Number"
                              name="billingFaxNumber"
                              value={customerdata.billingFaxNumber}
                              onChange={(e) => {
                                const value = e.target.value;

                                const faxnumberPattern = /^[0-9]*$/;

                                if (faxnumberPattern.test(value)) {
                                  handleChange(e);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Shipping Address */}
                      <div className="space-y-2 p-5 text-sm" ref={shippingAddressRef} >
                        <div className="flex">
                          <p>
                            <b>Shipping Address</b>
                          </p>
                          <button
                            className="ml-auto text-gray"
                            onClick={handleCopyAddress}
                          >
                            <b>Copy Billing Address</b>
                          </button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {/* Attention */}
                          <div>
                            <label className="block mb-0.5">Attention</label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full rounded-md text-start bg-white border border-slate-300 h-9 p-2 text-[#818894]"
                              placeholder="Enter Attention"
                              name="shippingAttention"
                              value={customerdata.shippingAttention}
                              onChange={(e) => {
                                const value = e.target.value;

                                const attentionPattern = /^[a-zA-Z\s]*$/;

                                if (
                                  attentionPattern.test(value) ||
                                  value === ""
                                ) {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingAttention: false,
                                  }));
                                } else {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingAttention: true,
                                  }));
                                }
                              }}
                            />
                            {errors.shippingAttention &&
                              customerdata.shippingAttention !== "" && (
                                <div className="text-red-800 text-xs mt-1">
                                  Please enter a valid attention name (letters
                                  only).
                                </div>
                              )}
                          </div>

                          {/* Country */}
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-0.5 block">
                              Country/Region
                            </label>
                            <select
                              className="block appearance-none w-full h-9 text-[#818894] bg-white border border-inputBorder text-sm pl-2 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                              name="shippingCountry"
                              value={customerdata.shippingCountry}
                              onChange={handleChange}
                            >
                              <option value="">Select a country</option>
                              {countryData && countryData.length > 0 ? (
                                countryData.map((item: any, index: number) => (
                                  <option key={index} value={item.name}>
                                    {item.name}
                                  </option>
                                ))
                              ) : (
                                <option disabled></option>
                              )}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-0 mt-6 flex items-center px-2 text-gray-700">
                              <CehvronDown color="gray" />
                            </div>
                          </div>
                        </div>

                        {/* Address */}
                        <div className="">
                          <label
                            className="text-slate-600 "
                            htmlFor="organizationAddress"
                          >
                            Address
                          </label>
                        </div>
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                          <div>
                            <input
                              className="pl-3 text-sm w-full -mt-1.5 text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 1"
                              name="shippingAddress1"
                              value={customerdata.shippingAddress1}
                              onChange={(e) => {
                                const value = e.target.value;

                                const addressPattern = /^[a-zA-Z0-9\s,]*$/;

                                if (addressPattern.test(value) || value === '') {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingAddress1: false,
                                  }));
                                } else {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingAddress1: true,
                                  }));
                                }
                              }}
                            />
                            {errors.shippingAddress1 && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid address (letters, numbers, spaces, and commas only).
                              </div>
                            )}
                          </div>
                          <div>
                            <input
                              className="pl-3 text-sm w-full -mt-1.5 text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Street 2"
                              name="shippingAddress2"
                              value={customerdata.shippingAddress2}
                              onChange={(e) => {
                                const value = e.target.value;

                                const addressPattern = /^[a-zA-Z0-9\s,]*$/;

                                if (addressPattern.test(value) || value === '') {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingAddress2: false,
                                  }));
                                } else {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingAddress2: true,
                                  }));
                                }
                              }}
                            />
                            {errors.shippingAddress2 && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid address (letters, numbers, spaces, and commas only).
                              </div>
                            )}
                          </div>
                          <div>
                            <label className="text-slate-600 " htmlFor="">
                              City
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-0.5 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder="Enter City"
                              name="shippingCity"
                              value={customerdata.shippingCity}
                              onChange={(e) => {
                                const value = e.target.value;

                                const cityPattern = /^[a-zA-Z\s]*$/;

                                if (cityPattern.test(value) || value === '') {
                                  handleChange(e);
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingCity: false,
                                  }));
                                } else {
                                  setErrors((prevErrors) => ({
                                    ...prevErrors,
                                    shippingCity: true,
                                  }));
                                }
                              }}
                            />
                            {errors.shippingCity && customerdata.shippingCity !== "" && (
                              <div className="text-red-800 text-xs mt-1">
                                Please enter a valid city name (letters only).
                              </div>
                            )}
                          </div>

                          <div className="relative ">
                            <label
                              className="text-slate-600"
                              htmlFor="organizationAddress"
                            >
                              State / Region / County
                            </label>
                            <div className="relative w-full mt-0.5">
                              <select
                                value={customerdata.shippingState}
                                onChange={handleChange}
                                name="shippingState"
                                id="shippingState"
                                className="block appearance-none w-full text-[#818894] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                disabled={!customerdata.shippingCountry}
                              >
                                <option value="">
                                  State / Region / County
                                </option>
                                {shippingstateList.length > 0 ? (
                                  shippingstateList.map(
                                    (item: any, index: number) => (
                                      <option key={index} value={item}>
                                        {item}
                                      </option>
                                    )
                                  )
                                ) : (
                                  <></>
                                )}
                              </select>
                              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                <CehvronDown color="gray" />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Other fields */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Pin / Zip / Post code
                            </label>
                            <input
                              className="pl-3 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2 mt-0.5 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                              placeholder=" Pin / Zip / Post code"
                              type="text"
                              name="shippingPinCode"
                              value={customerdata.shippingPinCode}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (/^\d*$/.test(value)) {
                                  handleChange(e);
                                }
                              }}
                            />
                          </div>
                          <div>
                            <label
                              className="text-slate-600 "
                              htmlFor="organizationAddress"
                            >
                              Phone
                            </label>
                            <div className="w-full border-0 mt-0.5">
                              <PhoneInput
                                inputClass="appearance-none text-[#818894] bg-white border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                                inputStyle={{ height: "38px", width: "100%" }}
                                containerStyle={{ width: "100%" }}
                                country={"in"}
                                value={customerdata.shippingPhone}
                                onChange={(e) =>
                                  handlePhoneChange("shippingPhone", e)
                                }
                              />
                            </div>
                          </div>
                          <div className="relative w-full">
                            <label htmlFor="" className="mb-0.5 block">
                              Fax Number
                            </label>
                            <input
                              type="text"
                              className="pl-2 text-sm w-full text-[#818894] rounded-md text-start bg-white border border-slate-300 h-9 p-2 "
                              placeholder="Enter Fax Number"
                              name="shippingFaxNumber"
                              value={customerdata.shippingFaxNumber}
                              onChange={(e) => {
                                const value = e.target.value;

                                const pinCodePattern = /^[0-9]*$/;

                                if (pinCodePattern.test(value)) {
                                  handleChange(e);
                                }
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {activeTab === "contactPersons" && (
                    <>
                      <div className="rounded-lg border-2 border-tableBorder mt-5 overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg relative mb-4 border-dropdownText">
                          <thead className="text-[12px] text-center text-dropdownText">
                            <tr className="bg-lightPink">
                              <th className="py-2 px-5 font-medium border-b border-tableBorder relative">
                                Salutation
                              </th>
                              <th className="py-2 px-5 font-medium border-b border-tableBorder relative">
                                First Name
                              </th>
                              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                                Last Name
                              </th>
                              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                                Email Address
                              </th>
                              <th className="py-2 px-4 font-medium border-b border-tableBorder relative">
                                Mobile
                              </th>
                            </tr>
                          </thead>
                          <tbody className="text-dropdownText text-center text-[13px]">
                            {rows.map((row, index) => (
                              <tr key={index}>
                                <td className="py-2.5 flex items-center border-y border-tableBorder">
                                  <select
                                    className="block  w-full h-9  text-zinc-400 bg-white  text-sm  pl-2  rounded-md leading-tight focus:outline-none focus:bg-white focus:border-gray-500" value={row.salutation}
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "salutation",
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="">Select</option>
                                    <option value="Mr.">Mr.</option>
                                    <option value="Mrs.">Mrs.</option>
                                    <option value="Ms.">Ms.</option>
                                    <option value="Dr.">Dr.</option>
                                  </select>
                                </td>
                                <td className="py-2.5 px-4  border-y border-tableBorder">
                                  <input
                                    type="text"
                                    value={row.firstName}
                                    placeholder="Enter First Name"
                                    className="text-sm w-[100%] text-center rounded-md bg-white h-9 p-2 mx-4 text-[#818894]"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "firstName",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {row.firstNameError && (
                                    <div className="error text-[red] text-center">
                                      {row.firstNameError}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-4  border-y border-tableBorder">
                                  <input
                                    type="text"
                                    value={row.lastName}
                                    placeholder="Enter Last Name"
                                    className="text-sm w-[100%] text-center rounded-md bg-white h-9 p-2 mx-4 text-[#818894]"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "lastName",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {row.lastNameError && (
                                    <div className="error text-[red] text-center">
                                      {row.lastNameError}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-4  border-y border-tableBorder">
                                  <input
                                    type="text"
                                    value={row.email}
                                    placeholder="Enter Email"
                                    className="text-sm w-[100%] text-center rounded-md bg-white h-9 p-2 mx-4 text-[#818894]"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "email",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {row.emailError && (
                                    <div className="error text-[red] text-center">
                                      {row.emailError}
                                    </div>
                                  )}
                                </td>
                                <td className="py-2.5 px-4  border-y border-tableBorder">
                                  <input
                                    type="text"
                                    value={row.mobile}
                                    placeholder="Enter Mobile"
                                    className="text-sm w-[100%] text-center rounded-md bg-white h-9 p-2 mx-4 text-[#818894]"
                                    onChange={(e) =>
                                      handleRowChange(
                                        index,
                                        "mobile",
                                        e.target.value
                                      )
                                    }
                                  />
                                  {row.mobileError && (
                                    <div className="error text-[red] text-center">
                                      {row.mobileError}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div
                        className="flex gap-2 text-darkRed font-bold items-center my-4 cursor-pointer"
                        onClick={addRow}
                      >
                        <PlusCircle color={"darkRed"} />
                        Add Contact Person
                      </div>
                    </>
                  )}
                  {activeTab === "remarks" && (
                    <div>
                      <div>
                        <label className="block mb-1">Remarks</label>
                        <textarea
                          rows={3}
                          className="pl-2 text-sm w-[100%]  rounded-md text-start bg-white border border-slate-300   p-2 text-[#818894]"
                          placeholder="Add any additional comments or notes here"
                          name="remark"
                          value={customerdata.remark}
                          onChange={(e: any) => handleChange(e)}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </form>
          </div>

          <div className="flex justify-end gap-2 mb-3 m-5">
            
            <Button onClick={closeModal} variant="secondary" size="sm">
              Cancel
            </Button>
            <Button variant="primary" size="sm" onClick={handleEdit}>
              Save
            </Button>
          </div>
        </>
      </Modal>
    </div>
  );
};

export default EditCustomerModal;

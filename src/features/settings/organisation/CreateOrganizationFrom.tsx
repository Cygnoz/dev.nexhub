import { ChangeEvent, useEffect, useState } from "react";
import Button from "../../../Components/Button";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import toast from "react-hot-toast";
import CehvronDown from "../../../assets/icons/CehvronDown";
import Plus from "../../../assets/icons/Plus";
import Banner from "../banner/Banner";
import TrashCan from "../../../assets/icons/TrashCan";
import "react-phone-input-2/lib/style.css";
import Info from "../../../assets/icons/Info";
import Tooltip from "../../../Components/tooltip/Tooltip";
import { useOrganization } from "../../../context/OrganizationContext";
import Dropdown from "../../../Components/dropdown/Dropdown";

interface InputData {
  organizationLogo: string;
  organizationName: string;
  organizationCountry: string;
  organizationIndustry: string;
  addline1: string;
  addline2: string;
  city: string;
  pincode: string;
  state: string;
  organizationPhNum: string;
  website: string;
  baseCurrency: string;
  fiscalYear: string;
  timeZone: string;
  timeZoneExp: string;
  dateFormat: string;
  dateFormatExp: string;
  dateSplit: string;
  phoneNumberCode: string;
}

const CreateOrganizationForm = () => {
  const [additionalData, setAdditionalData] = useState<any | null>([]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<any>(null);
  const [countryData, setcountryData] = useState<any | []>([]);
  const [currencyData, setcurrencyData] = useState<any | []>([]);
  const [stateList, setStateList] = useState<any | []>([]);
  const { request: getAdditionalData } = useApi("get", 7004);
  const { request: createOrganization } = useApi("post", 7004);
  const { request: getOneOrganization } = useApi("get", 7004);
  const { request: getCurrencyData } = useApi("get", 7004);
  const { setOrganization } = useOrganization();
  const [tooltipState, setTooltipState] = useState<{ [key: string]: boolean }>({
    industry: false,
    address: false,
    baseCurrency: false,
  });

  const [inputData, setInputData] = useState<InputData>({
    organizationLogo: "",
    organizationName: "",
    organizationCountry: "",
    organizationIndustry: "",
    addline1: "",
    addline2: "",
    city: "",
    pincode: "",
    state: "",
    organizationPhNum: "",
    website: "",
    baseCurrency: "",
    fiscalYear: "",
    timeZone: "",
    timeZoneExp: "",
    dateFormat: "",
    dateFormatExp: "",
    dateSplit: "",
    phoneNumberCode: "",
  });




  const getDropdownList = async () => {
    try {
      const url = `${endponits.GET_ADDITIONAL_DATA}`;
      const { response, error } = await getAdditionalData(url);
      if (!error && response) {
        setAdditionalData(response.data[0]);
        // console.log(response.data[0], "additionalData");
      }
    } catch (error) {
      console.log("Error in fetching Additional data", error);
    }
  };

  const getCountryData = async () => {
    try {
      const url = `${endponits.GET_COUNTRY_DATA}`;
      const { response, error } = await getAdditionalData(url);
      if (!error && response) {
        setcountryData(response.data[0].countries);
        console.log(response.data[0].countries, "CountryData");
      }
    } catch (error) {
      console.log("Error in fetching country data", error);
    }
  };

  const getcurrencyData = async () => {
    try {
      const url = `${endponits.GET_CURRENCY_LIST}`;
      const { response, error } = await getCurrencyData(url);
      if (!error && response) {
        setcurrencyData(response.data);
        // console.log(response.data, "currencyData");
      }
    } catch (error) {
      console.log("Error in fetching currency data", error);
    }
  };

  const getOrganization = async () => {
    try {
      const url = `${endponits.GET_ONE_ORGANIZATION}`;
      const apiResponse = await getOneOrganization(url);
      const { response, error } = apiResponse;
      if (!error && response?.data) {
        setInputData(response.data);
        setInputData((prevData: any) => ({
          ...prevData,
          organizationName: response.data.organizationName,
        }));
        setOrganization(response.data);
        if (response.data.organizationPhNum) {
          const organizationPhNum = response.data.organizationPhNum;
          let matchingCountry = null;
          let longestCodeLength = 0;

          countryData.forEach((country: any) => {
            const countryCode = country.phoneNumberCode;

            if (organizationPhNum.startsWith(countryCode)) {
              if (countryCode.length > longestCodeLength) {
                matchingCountry = country;
                longestCodeLength = countryCode.length;
                console.log(matchingCountry, "Mcountry");
                console.log(longestCodeLength, "longestCodeLength");
              }
            }
          });

          if (matchingCountry) {
            setSelectedCountry(matchingCountry);
            setInputData((prevData: any) => ({
              ...prevData,
              organizationPhNum: organizationPhNum,
            }));
          }
        }
      } else {
        toast.error(
          error.response.data.message || "Error fetching organization"
        );
      }
    } catch (error) {
      toast.error("Error fetching organization");
      console.error("Error fetching organization:", error);
    }
  };

  const handleInputPhoneChange = (e: any) => {
    const rawInput = e.target.value.trim();
    const phoneNumberLimit = selectedCountry?.phoneNumberLimit || 0;

    let phoneNumber = rawInput.replace(selectedCountry?.phoneNumberCode, '').trim();

    if (phoneNumber.length > phoneNumberLimit) {
      phoneNumber = phoneNumber.slice(0, phoneNumberLimit);
    }

    const enteredPhone = `${selectedCountry?.phoneNumberCode || ''} ${phoneNumber}`;

    // console.log(enteredPhone, "entered");

    setInputData((prevData) => ({
      ...prevData,
      organizationPhNum: enteredPhone
    }));
  };


  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: string } }
  ) => {
    const { name, value } = "target" in e ? e.target : e;
    setInputData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    key: string // Specify the key to update, e.g., "organizationLogo"
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInputData((prevData) => ({
          ...prevData,
          [key]: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };


  const selectTimeZone = (e: any) => {
    const selectedZone = e.target.value;

    const selectedTimeZone = additionalData.timezones.find(
      (timezone: any) => timezone.zone === selectedZone
    );

    console.log(selectedTimeZone);

    if (selectedTimeZone) {
      setInputData((prevDetails) => ({
        ...prevDetails,
        timeZone: selectedZone,
        timeZoneExp: selectedTimeZone.timeZone,
      }));
    }
  };

  const selectDateFormat = (e: any) => {
    const selectedFormat = e.target.value;

    const selectedDateFormat = [
      ...additionalData.dateFormats.short,
      ...additionalData.dateFormats.medium,
      ...additionalData.dateFormats.long,
    ].find((dateFormat) => dateFormat.format === selectedFormat);

    console.log(selectedDateFormat);

    if (selectedDateFormat) {
      setInputData((prevDetails: any) => ({
        ...prevDetails,
        dateFormat: selectedFormat,
        dateFormatExp: selectedDateFormat.dateFormat,
      }));
    }
  };

  const handleCreateOrganization = async (e: any) => {
    e.preventDefault();
    try {
      const url = `${endponits.CREATE_ORGANIZATION}`;
      const apiResponse = await createOrganization(url, inputData);
      const { response, error } = apiResponse;

      if (!error && response) {
        toast.success(response.data.message);
        getOrganization()
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.log(error, "Error in creating organization");
    }
  };


  const handleDeleteImage = () => {
    setInputData((prevDetails: any) => ({
      ...prevDetails,
      organizationLogo: "",
    }));
  };
  useEffect(() => {
    getDropdownList();
    getCountryData();
    getcurrencyData();
  }, []);

  useEffect(() => {
    getOrganization()
  }, [countryData])

  useEffect(() => {
    if (selectedCountry === null && inputData.organizationCountry) {
      const matchingCountry = countryData.find((country: any) => country.name === inputData.organizationCountry);

      // If a matching country is found, set it as selectedCountry
      if (matchingCountry) {

        setSelectedCountry(matchingCountry);
      }
      else {
        const matchingCountry = countryData.find((country: any) => country.name === "India");
        setSelectedCountry(matchingCountry);

      }
    }
  }, [selectedCountry, inputData.organizationCountry, countryData]);


  useEffect(() => {
    if (inputData.organizationCountry) {
      const country = countryData.find(
        (c: any) => c.name === inputData.organizationCountry
      );
      if (country) {
        setStateList(country.states || []);
      }
    }
  }, [inputData.organizationCountry, countryData, inputData.organizationLogo]);

  const handleTooltipToggle = (tooltip: string, state: boolean) => {
    setTooltipState((prevState) => ({
      ...prevState,
      [tooltip]: state,
    }));
  };

  const renderCustomTooltip = (content: string) => {
    return (
      <Tooltip
        fontsize="12px"
        content={content}
        textColor="#ffffff"
        bgColor="#585953"
        arrowColor="transparant"
        width="250px"
      />
    );
  };
  console.log(selectedCountry, "selectedCountry");

  return (
    <div className=" m-4 overflow-y-scroll hide-scrollbar h-auto">
      <Banner seeOrgDetails />

      {/* FORM */}
      <form className="text-slate-800 text-sm">
        <div className="h-56 p-3 border-dashed border-neutral-400  rounded-md mt-5 border bg-white text-textColor w-full sm:w-[403px]">
          {" "}
          <label>
            <div
              className={`bg-lightPink flex h-28 justify-center items-center rounded-lg ${inputData.organizationLogo ? "h-[90px] rounded-b-none" : ""
                }`}
            >
              {inputData.organizationLogo ? (
                <div className="">
                  <img
                    src={inputData.organizationLogo}
                    alt=""
                    className="py-0 h-[51px]"
                  />
                </div>
              ) : (
                <>
                  <div className="justify-center flex items-center bg-darkRed text-white  p-1 rounded-full">
                    <Plus color="white" classname="h-3 w-3" />
                  </div>
                  <p className="text-sm ms-2">
                    {" "}
                    Upload Your Organizational Logo
                  </p>
                </>
              )}
              <input
                accept="image/*"
                type="file"
                className="hidden"
                onChange={(e) => handleFileChange(e, "organizationLogo")}
              />
            </div>
          </label>
          {inputData.organizationLogo && (
            <div className="bg-neutral-200 rounded-b-lg h-7 flex items-center justify-end px-4">
              <div onClick={handleDeleteImage}>
                {" "}
                <TrashCan color={"darkRed"} />
              </div>
            </div>
          )}
          <div className="text-center">
            <p className="mt-3 text-base">
              <b>Organization Logo</b>
            </p>
            <p className="text-xs mt-1">
              Preferred Image Dimensions: 240&times;240&times; pixels @ 72 DPI{" "}
              <br />
              Maximum File size 1MB
            </p>
          </div>
        </div>

        <p className="mt-4 text-textColor">
          <b>Organizational Details</b>
        </p>

        <div className="bg-white border-slate-200  border-2 rounded-md mt-4 p-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Organization Name Field */}
            <div className="relative">
              <label htmlFor="organizationName" className="text-slate-600">
                Organization Name <span className="text-[#bd2e2e] ">*</span>
              </label>
              <input
                type="text"
                id="organizationName"
                name="organizationName"
                value={inputData.organizationName}
                onChange={handleInputChange}
                className="block w-full mt-3 text-[#495160] bg-white border border-inputBorder text-sm h-[39px] px-3 rounded-md focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter organization name"
              />
            </div>

            {/* Organization Location Field */}
            <div className="relative">
              <label htmlFor="location" className="text-slate-600">
                Organization Location <span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full mt-3">
                <select
                  value={inputData.organizationCountry}
                  onChange={handleInputChange}
                  name="organizationCountry"
                  id="Location"
                  className="  block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
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
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>

            {/* Industry Field */}
            <div>
              <label
                htmlFor="organizationIndustry"
                className="text-slate-600 flex items-center gap-1"
              >
                <p>Industry</p>
                <div
                  className="relative mt-1"
                  onMouseEnter={() => handleTooltipToggle("industry", true)}
                  onMouseLeave={() => handleTooltipToggle("industry", false)}
                >
                  <Info size={18} color={"currentColor"} stroke={3} />
                  {tooltipState.industry && (
                    <div className="absolute left-full -top-10 ml-2 w-[250px] p-2 rounded-md text-sm text-slate-700 z-10">
                      {renderCustomTooltip(
                        "Select your industry type to help us fine-tune your experience. If you can't find your industry type from the list of options, you can input your own."
                      )}
                    </div>
                  )}
                </div>
              </label>
              <div className="w-full mt-2.5 relative">
                <Dropdown
                  value={inputData.organizationIndustry || null}
                  options={additionalData.industry || []}
                  onSelect={(selectedIndustry) =>
                    handleInputChange({
                      target: {
                        name: "organizationIndustry",
                        value: selectedIndustry,
                      },
                    })
                  }
                  getDisplayValue={(industry) => industry || "Select Industry"}
                  getFilterValue={(industry) => industry}
                  placeholder="Select Industry"
                />
              </div>
            </div>
          </div>

          <div className="pt-3">
            <label
              className="text-slate-600 flex items-center gap-1"
              htmlFor="organizationAddress"
            >
              Organization Address{" "}
              <div
                className="relative mt-1"
                onMouseEnter={() => handleTooltipToggle("address", true)}
                onMouseLeave={() => handleTooltipToggle("address", false)}
              >
                <Info size={18} color={"currentColor"} stroke={3} />
                {tooltipState.address && (
                  <div className="absolute left-full -top-7 ml-2 w-[200px] p-2  rounded-md text-sm text-slate-700">
                    {renderCustomTooltip(
                      "You can display your organization's address in your preferred style. Edit it in Settings > Preferences > General."
                    )}
                  </div>
                )}
              </div>
            </label>
          </div>

          <div className="grid grid-cols-2 gap-4 -mt-2 space-y-4 ">
            <div>
              <input
                className="pl-3 text-sm w-[100%] mt-4 placeholder-[#495160] rounded-md text-start bg-white  border border-inputBorder  h-[39px]  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Street 1"
                name="addline1"
                value={inputData.addline1}
                onChange={handleInputChange}
              />{" "}
            </div>

            <div>
              <input
                className="pl-3 text-sm w-[100%] placeholder-[#495160] rounded-md text-start bg-white border border-inputBorder h-[39px] p-2  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Street 2"
                name="addline2"
                value={inputData.addline2}
                onChange={handleInputChange}
              />{" "}
            </div>
            <div>
              <div className="-mt-4">
                <label className="text-slate-600 " htmlFor="City">
                  City
                </label>
              </div>
              <input
                className="pl-3 text-sm w-[100%] placeholder-[#495160] rounded-md text-start bg-white border border-inputBorder  h-[39px] p-2 mt-2  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Enter City"
                value={inputData.city}
                name="city"
                onChange={handleInputChange}
              />{" "}
            </div>

            <div>
              <div className="-mt-4">
                <label className="text-slate-600 " htmlFor="pincode">
                  Pin / Zip / Post code
                </label>
              </div>
              <input
                className="pl-3 text-sm w-[100%] placeholder-[#495160] rounded-md text-start bg-white border border-inputBorder  h-[39px] p-2 mt-2  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder=" Pin / Zip / Post code"
                type="text"
                value={inputData.pincode}
                name="pincode"
                onChange={handleInputChange}
              />{" "}
            </div>
            <div className="relative ">
              <div className="-mt-4">
                <label className="text-slate-600 " htmlFor="state">
                  State / Region / County <span className="text-[#bd2e2e] ">*</span>
                </label>
              </div>
              <div className="relative w-full mt-2">
                <Dropdown
                  value={inputData.state || null} // Currently selected state
                  options={stateList} // List of states
                  onSelect={(selectedState) =>
                    handleInputChange({
                      target: {
                        name: "state",
                        value: selectedState, // Update with the selected state's value
                      },
                    })
                  }
                  getDisplayValue={(state) => state || "State / Region / County"} 
                  getFilterValue={(state) => state}
                  placeholder="State / Region / County"
                  disabled={!inputData.organizationCountry} 
                />

              </div>
            </div>

            <div>
              <div className="-mt-4">
                <label className="text-slate-600" htmlFor="organizationPhNum">
                  Phone <span className="text-[#bd2e2e] ">*</span>
                </label>
              </div>

              <div className="w-full border-0">
                <div className="relative flex">
                  {/* Flag and Dial Code dropdown */}
                  <div
                    className="flex items-center cursor-pointer border border-neutral-300 justify-center h-[39px] mt-2 rounded-l-lg focus:bg-white focus:border-darkRed "
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {selectedCountry?.flag ? (
                      <div className="flex items-center justify-center px-3 ">
                        <img
                          src={selectedCountry.flag}
                          alt={`${selectedCountry.name} flag`}
                          className="h-4 w-4 mr-2"
                        />
                        <CehvronDown color={"currentcolor"} height={10} width={10} />
                      </div>
                    ) : (
                      <div>
                        {countryData?.name === "India" && (
                          <img
                            src={countryData.flag}
                            alt="India flag"
                            className="h-4 w-4 mr-2"
                          />
                        )}
                      </div>
                    )}
                  </div>

                  {/* Dropdown list for country selection */}
                  {dropdownOpen && (
                    <div className="absolute top-full left-0 mt-1 bg-white shadow-md rounded-md z-10 max-h-60 overflow-y-auto">
                      {countryData.map((country: any, index: number) => (
                        <div
                          onClick={() => {
                            setSelectedCountry(country);
                            setDropdownOpen(false);
                            setInputData((prevData) => ({
                              ...prevData,
                              organizationPhNum: country.phoneNumberCode
                            }));
                          }}
                          key={index}
                          className="flex items-center px-2 py-1 hover:bg-red-50 cursor-pointer text-sm border-b border-neutral-300 text-textColor "
                        >
                          <img src={country.flag} className="h-4 w-4 mr-2" />{" "}
                          <span>{country.name}</span>{" "}
                          <span>{country.phoneNumberCode}</span>
                        </div>
                      ))}
                    </div>
                  )}


                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    className="pl-3 text-sm w-[100%] placeholder-[#495160] rounded-r-md text-start bg-white border border-inputBorder h-[39px] p-2 leading-tight focus:outline-none focus:bg-white focus:border-darkRed mt-2"
                    value={inputData.organizationPhNum}
                    name="organizationPhNum"
                    onChange={handleInputPhoneChange}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-4">
          <b>Website Address</b>
        </p>
        <div className="bg-white border-slate-200  border-2 rounded-md  mt-4 p-5">
          <label htmlFor="websit" className="text-slate-600">
            Website URL
          </label>
          <input
            type="text"
            placeholder="Value"
            className="pl-3 text-sm w-[100%] placeholder-[#495160] mt-3 rounded-md text-start bg-white border border-inputBorder  h-[39px] p-2  leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
            value={inputData.website}
            name="website"
            onChange={handleInputChange}
          />
        </div>
        <p className="mt-4">
          <b>Financial Settings</b>
        </p>
        <div className="bg-white  border-slate-200  border-2 rounded-md mt-4 p-5">
          <div className="grid grid-cols-2 gap-4 ">
            <div className="relative ">
              <label
                htmlFor="currency"
                className="text-slate-600 flex items-center gap-1"
              >
                Base Currency{" "} <span className="text-[#bd2e2e] ">*</span>
                <div
                  className="mt-1"
                  onMouseEnter={() => handleTooltipToggle("baseCurrency", true)}
                  onMouseLeave={() =>
                    handleTooltipToggle("baseCurrency", false)
                  }
                >
                  <Info size={18} color={"currentColor"} stroke={3} />
                  {tooltipState.baseCurrency && (
                    <div className="absolute z-10 -top-5 left-32">
                      {renderCustomTooltip(
                        "Your transactions and financial reports will be shown in the base currency."
                      )}
                    </div>
                  )}
                </div>
              </label>

              <div className="relative w-full mt-3">
                <Dropdown
                  value={currencyData.find((item: any) => item.currencyCode === inputData.baseCurrency) || null}
                  options={currencyData}
                  onSelect={(selectedCurrency) =>
                    handleInputChange({ target: { name: "baseCurrency", value: selectedCurrency.currencyCode } })
                  }
                  getDisplayValue={(currency) =>
                    currency ? `${currency.currencyName} (${currency.currencySymbol})` : ""
                  }
                  getFilterValue={(currency) =>
                    `${currency.currencyName} ${currency.currencySymbol} ${currency.currencyCode}`
                  }
                  placeholder="Select Currency"
                />
              </div>
            </div>

            <div className="relative">
              <label htmlFor="fiscalYear" className="text-slate-600">
                Financial Year
              </label>

              <div className="relative w-full mt-3">
                <Dropdown
                  value={inputData.fiscalYear || null} // Current selected financial year
                  options={additionalData.financialYear || []} // List of financial years
                  onSelect={(selectedYear) =>
                    handleInputChange({
                      target: { name: "fiscalYear", value: selectedYear },
                    })
                  }
                  getDisplayValue={(year) => year || ""} // Display the year directly
                  getFilterValue={(year) => year} // Filter by the year string
                  placeholder="Select Financial Year"
                />
              </div>
            </div>
          </div>
          <div></div>
        </div>
        <p className="mt-4">
          <b>Preferences</b>
        </p>
        <div className="bg-white  border-slate-200  border-2 rounded-md mt-4 p-5">
          <div className="grid grid-cols-12 gap-4 ">
            <div className="relative col-span-8">
              <label htmlFor="timeZone" className="text-slate-600">
                Time Zone <span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full my-3">
                <select
                  value={inputData.timeZone}
                  name="timeZone"
                  onChange={selectTimeZone}
                  id="timeZone"
                  className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="">Select Time Zone</option>
                  {additionalData.timezones &&
                    additionalData.timezones.length > 0 ? (
                    additionalData.timezones.map((item: any, index: any) => (
                      <option key={index} value={item.zone}>
                        {item.zone} - {item.description}
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
            <div className="col-span-4"></div>
          </div>
          <div className="grid grid-cols-12 gap-4 mt-1">
            <div className="relative col-span-8 ">
              <label htmlFor="dateformat" className="text-slate-600">
                Date Format <span className="text-[#bd2e2e] ">*</span>
              </label>
              <div className="relative w-full mt-3">
                <select
                  value={inputData.dateFormat}
                  onChange={selectDateFormat}
                  name="dateFormat"
                  id="dateFormat"
                  className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="">Select Date Format</option>
                  {additionalData?.dateFormats?.short &&
                    additionalData?.dateFormats.short.length > 0 ? (
                    <>
                      <optgroup label="Short">
                        {additionalData.dateFormats.short.map(
                          (item: any, index: any) => (
                            <option key={`short-${index}`} value={item.format}>
                              {item.format}
                            </option>
                          )
                        )}
                      </optgroup>
                    </>
                  ) : (
                    <></>
                  )}

                  {additionalData?.dateFormats?.medium &&
                    additionalData?.dateFormats.medium.length > 0 ? (
                    <>
                      <optgroup label="Medium">
                        {additionalData.dateFormats.medium.map(
                          (item: any, index: any) => (
                            <option key={`medium-${index}`} value={item.format}>
                              {item.format}
                            </option>
                          )
                        )}
                      </optgroup>
                    </>
                  ) : (
                    <></>
                  )}

                  {additionalData?.dateFormats?.long &&
                    additionalData?.dateFormats.long.length > 0 ? (
                    <>
                      <optgroup label="Long">
                        {additionalData.dateFormats.long.map(
                          (item: any, index: any) => (
                            <option key={`long-${index}`} value={item.format}>
                              {item.format}
                            </option>
                          )
                        )}
                      </optgroup>
                    </>
                  ) : (
                    <></>
                  )}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>
            <div className="relative col-span-4 mt-5">
              <div className="relative w-full mt-3">
                <select
                  value={inputData.dateSplit}
                  onChange={handleInputChange}
                  name="dateSplit"
                  id="dateSplit"
                  className="block appearance-none w-full text-[#495160] bg-white border border-inputBorder text-sm h-[39px] pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                >
                  <option value="">Select Date Split</option>

                  {additionalData?.dateSplit &&
                    additionalData?.dateSplit.length > 0 ? (
                    additionalData?.dateSplit.map((item: any, index: any) => (
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
        </div>

        <div className="flex my-4 gap-4">
          <Button
            variant="primary"
            size="sm"
            onClick={(e) => handleCreateOrganization(e)}
          >
            Save
          </Button>

          <Button variant="secondary" size="sm">
            Cancel
          </Button>
        </div>
      </form>


    </div>
  );
};

export default CreateOrganizationForm;


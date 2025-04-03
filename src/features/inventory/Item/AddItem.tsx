import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import CehvronDown from "../../../assets/icons/CehvronDown";
import CheveronLeftIcon from "../../../assets/icons/CheveronLeftIcon";
import CircleHelp from "../../../assets/icons/CircleHelp";
import Plus from "../../../assets/icons/Plus";
import SettingsIcons from "../../../assets/icons/SettingsIcon";
import Button from "../../../Components/Button";
import ProductSelection from "../../../Components/Form/ProductSelection";
import SearchBar from "../../../Components/SearchBar";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import AddSupplierModal from "../../Supplier/SupplierHome/AddSupplierModal";
import BrandModal from "../Brand/BrandModal";
import CategoryModal from "../Category/CategoryModal";
import NewManufacture from "../Manufature/NewManufacture";
import RackModal from "../Rack/RackModal";
import NewUnit from "../Unit/NewUnit";

type Props = {};

interface ItemSettings {
  itemDuplicateName: boolean;
  hsnSac: boolean;
  hsnDigits: string;
}

interface ItemsData {
  bmcrData: {
    brandNames: string[];
    manufacturers: string[];
    categories: string[];
    racks: string[];
  };
  taxRate: TaxRate[];
  unitName: string[];
  organization: Organization;
  itemSettings?: ItemSettings;
}

interface TaxRate {
  taxName: string;
}

interface Organization {
  baseCurrency: string;
  timeZoneExp?: string;
  dateFormatExp?: string;
}

const initialItemDataState = {
  _id: "",
  itemType: "goods",
  itemName: "",
  itemImage: "",
  sku: "",
  unitName: "",
  returnableItem: false,
  hsnCode: "",
  sac: "",
  taxPreference: "Taxable",
  taxExemptReason: "",
  productUsage: "",
  length: "",
  width: "",
  height: "",
  dimensionUnit: "",
  warranty: "",
  weight: "",
  weightUnit: "",
  manufacturer: "",
  brand: "",
  categories: "",
  rack: "",
  upc: "",
  mpn: "",
  ean: "",
  isbn: "",
  baseCurrency: "",
  sellingPrice: "",
  saleMrp: "",
  salesAccountId: "",
  salesDescription: "",
  costPrice: "",
  purchaseAccountId: "",
  purchaseDescription: "",
  preferredVendorId: "",
  taxRate: "",
  trackInventory: false,
  inventoryAccount: "",
  openingStock: "",
  openingStockRatePerUnit: "",
  reorderPoint: "",
  currentStock: "",
  status: "",
  products:'',
  duration:''
};

const AddItem = ({ }: Props) => {
  const [initialItemData, setInitialItemData] = useState(initialItemDataState);
  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);
  const [isService, setIsService] = useState<boolean>(false);
  const [isRackModalOpen, setIsRackModalOpen] = useState(false);
  const [searchValueManufacturer, setSearchValueManufacturer] =
    useState<string>("");
  const [searchValueBrand, setSearchValueBrand] = useState<string>("");
  const [searchValueCategory, setSearchValueCategory] = useState<string>("");
  const [searchValueVendor, setSearchValueVendor] = useState<string>("");
  const [searchValueRack, setSearchValueRack] = useState<string>("");
  const [searchValueTaxRate, setSearchValueTaxRate] = useState<string>("");
  const [openDropdownIndex, setOpenDropdownIndex] = useState<string | null>(
    null
  );
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isManufatureModalOpen, setIsManufatureModalOpen] = useState(false);

  useEffect(() => {
    fetchAllItems();
    fetchAllItemName();
    fetchAllSuppliers()
  }, []);
  useEffect(() => {
    window.scrollTo({
      top: 165,
      behavior: "smooth",
    });
  }, []);

  const [itemsData, setItemsData] = useState<ItemsData>({
    bmcrData: {
      brandNames: [],
      manufacturers: [],
      categories: [],
      racks: [],
    },
    taxRate: [],
    unitName: [],
    organization: { baseCurrency: "" },
  });

  const { request: AllItems } = useApi("get", 7003);
  const fetchAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_Dropdown}`;
      const { response, error } = await AllItems(url);
      if (!error && response) {
        setItemsData(response.data);
        console.log(response.data, "As");
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const [suppliers, setSuppliers] = useState<any>([])

  const { request: AllSuppliers } = useApi("get", 7009);
  const fetchAllSuppliers = async () => {
    try {
      const url = `${endponits.GET_ALL_SUPPLIER}`;
      const { response, error } = await AllSuppliers(url);
      if (!error && response) {
        setSuppliers(response.data)
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const products = [
    { value: "BillBizz", label: "BillBizz", logo: "BillBizz" },
    { value: "SewNex", label: "SewNex", logo: "SewNex" },
    { value: "SaloNex", label: "SaloNex", logo: "SaloNex" },
    { value: "6NexD", label: "6NexD", logo: "6NexD" },
];
  const [itemsDataName, setItemsDataName] = useState<string[]>([]);
  const { request: GetAllItemsName } = useApi("get", 7003);

  const fetchAllItemName = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEM}`;
      const { response, error } = await GetAllItemsName(url);
      if (!error && response) {
        const itemNames = response.data
          .map((item: any) => item.itemName)
          .filter(Boolean);
        setItemsDataName(itemNames);
      } else {
        console.error("Error in response:", error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };
  const fetchData = async (
    url: string,
    setData: React.Dispatch<React.SetStateAction<any>>,
    fetchFunction: (url: string) => Promise<any>
  ) => {
    try {
      const { response, error } = await fetchFunction(url);
      if (!error && response) {
        setData(response.data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const [allAccounts, setAllAccounts] = useState<any>([]);
  const { request: getAccounts } = useApi("get", 7001);

  useEffect(() => {
    const allAccountsUrl = `${endponits.Get_ALL_Acounts}`;
    fetchData(allAccountsUrl, setAllAccounts, getAccounts);
  }, []);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = event.target;
    if (type === "number" && parseFloat(value) < 0) {
      return;
    }

    setInitialItemData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? (event.target as HTMLInputElement).checked
          : value,
    }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result as string;
        setInitialItemData((prevDetails: any) => ({
          ...prevDetails,
          itemImage: base64String,
        }));
      };

      reader.readAsDataURL(file);
    }
  };



  const toggleDropdown = (key: string | null) => {
    setOpenDropdownIndex(key === openDropdownIndex ? null : key);
    fetchAllItems();
    fetchAllSuppliers()
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownIndex(null);
      setSearchValueManufacturer("");
      setSearchValueBrand("");
      setSearchValueCategory("");
      setSearchValueRack("");
      setSearchValueTaxRate("");
    }
  };

  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleMouseEnter = () => {
    setTooltipVisible(true);
  };

  const handleMouseLeave = () => {
    setTooltipVisible(false);
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

  const handleDropdownSelect = (key: string, value: string) => {
    setInitialItemData((prev) => ({
      ...prev,
      [key]: value,
    }));
    setOpenDropdownIndex(null);
  };
  const [errors, setErrors] = useState({
    itemName: false,
    taxPreference: false,
    taxRate: false,
    taxExemptReason: false,
    purchaseAccountId: false,
    salesAccountId: false,
    costPrice: false,
    sellingPrice:false,
    products:false,
    duration:false
  });

  const navigate = useNavigate();

  const { request: CreateItem } = useApi("post", 7003);
  const { request: UpdateItem } = useApi("put", 7003); // For editing

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    // Validation checks
    const newErrors = {
      itemName: !initialItemData.itemName,
      taxPreference: !initialItemData.taxPreference,
      taxRate: initialItemData.taxPreference === "Taxable" && !initialItemData.taxRate,
      taxExemptReason: initialItemData.taxPreference === "Non-taxable" && !initialItemData.taxExemptReason,
      purchaseAccountId: Boolean(initialItemData.costPrice) && initialItemData.purchaseAccountId === "",
      salesAccountId: Boolean(initialItemData.sellingPrice) && initialItemData.salesAccountId === "",
      costPrice: !isService &&!initialItemData.costPrice,
      sellingPrice: !initialItemData.sellingPrice,
      products: isService && !initialItemData.products,
      duration:isService && !initialItemData.duration,
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) {
      toast.error("Please fill in all required fields.");
      return;
    }
    // Check for duplicate item names if adding a new item
    if (!selectedItem && itemsData?.itemSettings?.itemDuplicateName === false) {
      if (itemsDataName.includes(initialItemData.itemName)) {
        toast.error("Item with this name already exists.");
        return;
      }
    }
   
    try {
      const url = selectedItem
        ? `${endponits.UPDATE_ITEM}/${selectedItem._id}`
        : `${endponits.ADD_ITEM}`;
      const body = initialItemData;
      const apiRequest = selectedItem ? UpdateItem : CreateItem;
      const { response, error } = await apiRequest(url, body);
      if (!error && response) {
        toast.success(response.data.message);
        setTimeout(() => {
          navigate("/inventory/Item");
          setInitialItemData(initialItemDataState);
        }, 500);
      } else {
        toast.error(error.response.data.message);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClearFields = (field: string) => {
    setInitialItemData((prev) => ({
      ...prev,
      [field]: "",
    }));
  };
  const location = useLocation();
  const selectedItem = location.state?.item;
  console.log("select",selectedItem);
  
  useEffect(() => {
    if (selectedItem) {
      setInitialItemData({
        _id: selectedItem._id,
        itemType: selectedItem.itemType || "",
        itemName: selectedItem.itemName || "",
        itemImage: selectedItem.itemImage || "",
        sku: selectedItem.sku || "",
        unitName: selectedItem.unitName || "",
        returnableItem: selectedItem.returnableItem || false,
        hsnCode: selectedItem.hsnCode || "",
        sac: selectedItem.sac || "",
        taxPreference: selectedItem.taxPreference || "",
        taxExemptReason: selectedItem.taxExemptReason || "",
        productUsage: selectedItem.productUsage || "",
        length: selectedItem.length || "",
        width: selectedItem.width || "",
        height: selectedItem.height || "",
        dimensionUnit: selectedItem.dimensionUnit || "",
        warranty: selectedItem.warranty || "",
        weight: selectedItem.weight || "",
        weightUnit: selectedItem.weightUnit || "",
        manufacturer: selectedItem.manufacturer || "",
        brand: selectedItem.brand || "",
        categories: selectedItem.categories || "",
        rack: selectedItem.rack || "",
        upc: selectedItem.upc || "",
        mpn: selectedItem.mpn || "",
        ean: selectedItem.ean || "",
        isbn: selectedItem.isbn || "",
        baseCurrency: selectedItem.baseCurrency || "",
        sellingPrice: selectedItem.sellingPrice || "",
        saleMrp: selectedItem.saleMrp || "",
        salesAccountId: selectedItem.salesAccountId || "",
        salesDescription: selectedItem.salesDescription || "",
        costPrice: selectedItem.costPrice || "",
        purchaseAccountId: selectedItem.purchaseAccountId || "",
        purchaseDescription: selectedItem.purchaseDescription || "",
        preferredVendorId: selectedItem.preferredVendorId || "",
        taxRate: selectedItem.taxRate || "",
        trackInventory: selectedItem.trackInventory || false,
        inventoryAccount: selectedItem.inventoryAccount || "",
        openingStock: selectedItem.openingStock || "",
        openingStockRatePerUnit: selectedItem.openingStockRatePerUnit || "",
        reorderPoint: selectedItem.reorderPoint || "",
        currentStock: selectedItem.currentStock || "",
        status: selectedItem.status || "",
        products:selectedItem.products || "",
        duration:selectedItem.duration || "",
      });
      if (selectedItem.itemType === "service") {
        setIsService(true);
      } else {
        setIsService(false);
      }
    }
  }, [selectedItem]);
  const hsnSac = location.state?.hsnSac;

  useEffect(() => {
    if (initialItemData.taxPreference === "Non-taxable") {
      setInitialItemData((prevData: any) => ({
        ...prevData,
        taxRate: ""
      }));
    }
  }, [initialItemData.taxPreference])

  const handleProductChange = (selectedValue: any) => {
    setInitialItemData((prev:any)=>({
      ...prev,
      products:selectedValue
    }))
  };



  return (
    <>
      <div className="bg-white mx-5 p-6 rounded-lg overflow-scroll hide-scrollbar">
        <div className="flex gap-5">
          <Link to={"/inventory/Item"}>
            <div className="flex justify-center items-center h-11 w-11 bg-[#F3F3F3] rounded-full">
              <CheveronLeftIcon />
            </div>
          </Link>
          <div className="flex justify-center items-center">
            <h4 className="font-bold text-xl text-textColor ">{
              selectedItem ? "Edit Item" :
                "New Item"}</h4>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-12 gap-4 my-2">

          {/* Add Image */}
          <div className="col-span-12 sm:col-span-2">
            <div className="   h-36 border border-inputBorder border-dashed rounded-lg items-center justify-center flex text-center">
              <label htmlFor="image">
                <div
                  className={`bg-lightPink flex items-center justify-center h-16 w-36 rounded-lg ${initialItemData.itemImage ? "h-[90px] rounded-b-none" : ""
                    }`}
                >
                  {initialItemData.itemImage ? (
                    <img
                      src={initialItemData.itemImage}
                      alt="Item"
                      className="max-h-20 max-w-40"
                    />
                  ) : (
                    <div className="flex gap-4 justify-center items-center">
                      <div className="bg-darkRed rounded-full  flex items-center p-0.5 justify-center">
                        <Plus color={"white"} classname="" />
                      </div>
                      <p className="text-xs">Add Image</p>
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-extrabold text-textColor mt-1 text-sm">
                    Upload Item Image
                  </p>
                  <p className="text-[55%] text-[#818894] mt-1">
                    Support: JPG, PNG
                  </p>
                </div>
                <input
                  type="file"
                  id="image"
                  className="hidden"
                  name="itemImage"
                  onChange={handleFileChange}
                  accept="image/*"
                />
              </label>
            </div>
          </div>

          <div className="col-span-10 -mt-4">
            <div className="flex-row sm:flex justify-start items-center">
              <div>
                <label
                  className="block text-sm text-labelColor"
                  htmlFor="itemType"
                >
                  Item Type
                </label>
                <div className="flex items-center space-x-4 text-textColor text-sm">
                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onClick={() => {
                        setInitialItemData((prev) => ({
                          ...prev,
                          itemType: "goods",
                        }));
                        setIsService(false);
                      }}
                    >
                      <input
                        id="goods"
                        type="radio"
                        name="itemType"
                        value="goods"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${initialItemData.itemType === "goods"
                          ? "border-8 border-[#97998E]"
                          : "border-1 border-[#97998E]"
                          }`}
                        checked={initialItemData.itemType === "goods"} // "Goods" will be checked by default
                        onChange={handleInputChange}
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${initialItemData.itemType === "goods"
                          ? "bg-neutral-50"
                          : "bg-transparent"
                          }`}
                      />
                    </div>
                    <label
                      htmlFor="goods"
                      className="text-start font-medium mt-1"
                    >
                      Goods
                    </label>
                  </div>

                  <div className="flex gap-2 justify-center items-center">
                    <div
                      className="grid place-items-center mt-1"
                      onClick={() => {
                        setInitialItemData((prev) => ({
                          ...prev,
                          itemType: "service",
                        }));
                        setIsService(true);
                      }}
                    >
                      <input
                        id="service"
                        type="radio"
                        name="itemType"
                        value="service"
                        className={`col-start-1 row-start-1 appearance-none shrink-0 w-5 h-5 rounded-full border ${initialItemData.itemType === "service"
                          ? "border-8 border-[#97998E]"
                          : "border-1 border-[#97998E]"
                          }`}
                        checked={initialItemData.itemType === "service"}
                        onChange={handleInputChange}
                      />
                      <div
                        className={`col-start-1 row-start-1 w-2 h-2 rounded-full ${initialItemData.itemType === "service"
                          ? "bg-neutral-50"
                          : "bg-transparent"
                          }`}
                      />
                    </div>
                    <label
                      htmlFor="service"
                      className="text-start font-medium mt-1"
                    >
                      Service
                    </label>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-4 ms-0 sm:ms-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-3 md:col-span-6 lg:col-span-9">

                  <div>
                    <label
                      className="text-slate-600 text-sm"
                      htmlFor="itemName"
                    >
                      Name <span className="text-[#bd2e2e] ">*</span>
                      <input
                        className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start  bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                        placeholder="Enter Name"
                        name="itemName"
                        value={initialItemData.itemName}
                        onChange={handleInputChange}
                      />
                      {errors.itemName && (
                        <div className="text-red-800 text-xs  ms-1">
                          Item name is required
                        </div>
                      )}
                    </label>
                  </div>

                  <div>
                    <label
                      className="text-slate-600 flex items-center gap-2"
                      htmlFor="sku"
                    >
                      SKU
                      <div
                        onMouseEnter={handleMouseEnter}
                        onMouseLeave={handleMouseLeave}
                        className="relative"
                      >
                        <CircleHelp />
                        {tooltipVisible && (
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 pl-5  w-60 py-1 bg-gray text-white text-xs rounded-md">
                            The stock keeping unit of the item
                          </div>
                        )}
                      </div>
                    </label>
                    <input
                      className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Enter SKU"
                      name="sku"
                      value={initialItemData.sku}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="relative col-span-1 w-full sm:w-[300%] mt-3">
                  <label
                    htmlFor="unit-input"
                    className="text-slate-600 flex items-center gap-2"
                  >
                    Unit
                    {/* <CircleHelp /> */}
                  </label>
                  <div className="relative w-full">
                    <input
                      id="unit-input"
                      type="text"
                      value={initialItemData.unitName}
                      readOnly
                      className="cursor-pointer appearance-none mt-0.5 w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Select Unit"
                      onClick={() => toggleDropdown("unit")}
                    />
                    <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                  {openDropdownIndex === "unit" && (
                    <div
                      ref={dropdownRef}
                      className="absolute w-[100%] z-10 bg-white rounded-md mt-1 p-2 space-y-1 border border-inputBorder"
                    >
                      {itemsData.unitName &&
                        itemsData.unitName.map(
                          (unit: string, index: number) => (
                            <div
                              key={index}
                              onClick={() => handleDropdownSelect("unitName", unit)}
                              className="flex p-2 w-[100%] mb-4 hover:bg-gray-100 cursor-pointer border-b border-slate-300 text-sm  text-textColor"
                            >
                              {unit}

                            </div>
                          )
                        )}
                      <NewUnit page="item" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4 ">
              {hsnSac &&
                (isService ? (
                  <div>
                    <label
                      className="text-slate-600 flex text-sm items-center gap-2"
                      htmlFor="sac"
                    >
                      SAC
                    </label>
                    <input
                      className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="SAC"
                      name="sac"
                      value={initialItemData.sac}
                      onChange={handleInputChange}
                      maxLength={
                        Number(itemsData?.itemSettings?.hsnDigits) || 6
                      }
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      className="text-slate-600 flex text-sm items-center gap-2"
                      htmlFor="hsnCode"
                    >
                      HSN Code
                    </label>
                    <input
                      className="pl-3 text-sm w-[100%] mt-0.5 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Enter HSN code"
                      name="hsnCode"
                      value={initialItemData.hsnCode}
                      onChange={handleInputChange}
                      maxLength={
                        Number(itemsData?.itemSettings?.hsnDigits) || 6
                      }
                    />
                  </div>
                ))}

              <div className="relative">
                <label
                  htmlFor="taxPreference"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Tax Preference
                </label>
                <div className="relative w-full ">
                  <select
                    className="block appearance-none w-full mt-0.5 text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    name="taxPreference"
                    value={initialItemData.taxPreference}
                    onChange={handleInputChange}
                  >
                    <option value="" disabled hidden>
                      Select Tax Preference
                    </option>
                    <option value="Taxable">Taxable</option>
                    <option value="Non-taxable">Non-taxable</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
                {errors.taxPreference && (
                  <div className="text-red-800 text-xs  ms-1">
                    Tax Preference is required
                  </div>
                )}
              </div>

              {initialItemData.taxPreference === "Non-taxable" && (
                <div className="">
                  <div className="">
                    <div>
                      <label
                        className="text-slate-600 flex text-sm items-center gap-2"
                        htmlFor="productUsage"
                      >
                        Tax Exempt Reason{" "}
                        <span className="text-red-600 font-semibold">*</span>
                      </label>
                      <input
                        className="pl-3 text-sm w-[100%]  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                        placeholder="Enter a reason"
                        name="taxExemptReason"
                        value={initialItemData.taxExemptReason}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>
                  {errors.taxExemptReason && (
                    <div className="text-red-800 text-xs  ms-1">
                      Tax exempt reason is required
                    </div>
                  )}
                </div>
              )}
              {initialItemData.taxPreference === "Taxable" && (
                <div className="relative">
                  <label
                    htmlFor="taxRate-input"
                    className="text-slate-600 text-sm flex items-center gap-2"
                  >
                    Tax Rate <span className="text-[#bd2e2e] ">*</span>
                  </label>
                  <div className="relative w-full ">
                    <input
                      id="taxRate-input"
                      type="text"
                      value={initialItemData.taxRate}
                      readOnly
                      className="cursor-pointer appearance-none w-full mt-0.5 items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      placeholder="Select State Tax Rate"
                      onClick={() => toggleDropdown("taxRate")}
                    />
                    <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>

                  {openDropdownIndex === "taxRate" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                    >
                      <div className="mb-2.5">
                        <SearchBar
                          searchValue={searchValueTaxRate}
                          onSearchChange={setSearchValueTaxRate}
                          placeholder="Select Tax Rate"
                        />
                      </div>

                      {itemsData.taxRate
                        ?.filter((tax: TaxRate) =>
                          tax.taxName
                            .toLowerCase()
                            .includes(searchValueTaxRate.toLowerCase())
                        )
                        .map((tax, index) => (
                          <div
                            key={index}
                            onClick={() =>
                              handleDropdownSelect("taxRate", tax.taxName)
                            }
                            className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                          >
                            <div className="col-span-10 flex">
                              <div>
                                <p className="font-bold text-sm">
                                  {tax.taxName}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      <Link to={"/settings/taxes"}>
                        <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold">
                          <SettingsIcons color="darkRed" bold={2} />
                          <p className="mt-0.5">Manage Tax Rates</p>
                        </div>
                      </Link>
                    </div>
                  )}
                  {errors.taxRate && (
                    <div className="text-red-800 text-xs  ms-1">
                      Tax Rate is required
                    </div>
                  )}
                </div>
              )}
            </div>
            {!isService && (
              <div className="flex items-center mt-3  gap-1 text-textColor">
                <input
                  type="checkbox"
                  className="accent-[#97998E] bg-white h-5 w-4 mx-1 my-1"
                  id="checkbox3"
                  name="returnableItem"
                  checked={initialItemData.returnableItem}
                  onChange={handleInputChange}
                />
                <label
                  htmlFor="checkbox3"
                  className="text-textColor text-sm font-semibold"
                >
                  Returnable Item
                </label>
              </div>
            )}
          </div>
        </div>

        {!isService &&
         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6">
          <div>
            <p className="text-textColor text-base font-semibold my-2">
              Storage Information
            </p>
            <label className="block text-sm text-labelColor mb-0.5">Dimensions</label>

            <div className="grid grid-cols-4 gap-4 items-center ">
              <input
                type="number"
                className="text-sm rounded-md pl-3  bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Length"
                name="length"
                value={initialItemData.length}
                onChange={handleInputChange}
                min={0}
              />
              <input
                type="number"
                min={0}
                className="text-sm rounded-md pl-3 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Width"
                name="width"
                value={initialItemData.width}
                onChange={handleInputChange}
              />
              <input
                type="number"
                min={0}
                className="text-sm rounded-md pl-3 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Height"
                name="height"
                value={initialItemData.height}
                onChange={handleInputChange}
              />

              <div className="relative">
                <select
                  name="dimensionUnit"
                  className="text-sm appearance-none rounded-md w-full pl-3 text-zinc-400 bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  value={initialItemData.dimensionUnit}
                  onChange={handleInputChange}
                >
                  <option value="CM">CM</option>
                  <option value="MM">MM</option>
                  <option value="Inch">Inch</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-4">
                <label className="text-slate-600 text-sm" htmlFor="weight">
                  Weight
                </label>
                <div className="flex">
                  <input
                    type="number"
                    min={0}
                    className="pl-3 text-sm w-full rounded-l-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Weight"
                    name="weight"
                    value={initialItemData.weight}
                    onChange={handleInputChange}
                  />
                  <div className="relative w-24">
                    <select
                      name="weightUnit"
                      className="block w-full appearance-none text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-7 rounded-r-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                      value={initialItemData.weightUnit}
                      onChange={handleInputChange}
                    >
                      <option value="KG">KG</option>
                      <option value="G">G</option>
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-span-8">
                <label
                  className="text-slate-600 mt-1.5 flex text-sm items-center "
                  htmlFor="warranty"
                >
                  Warranty
                </label>
                <select
                  name="warranty"
                  className="block w-full text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                  value={initialItemData.warranty}
                  onChange={handleInputChange}
                >
                  <option value="">Select Warranty</option>
                  <option value="6 months">6 months</option>
                  <option value="1 year">1 year</option>
                </select>

              </div>
            </div>
          </div>

          <div>
            <p className="text-textColor text-base font-semibold my-2">
              Classification Details
            </p>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
              <div className="relative">
                <label
                  htmlFor="manufacturer-input"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Manufacturer
                </label>
                <div className="relative w-full ">
                  <input
                    id="manufacturer-input"
                    type="text"
                    value={initialItemData.manufacturer}
                    readOnly
                    className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Select or add Manufacturer"
                    onClick={() => toggleDropdown("manufacturer")}
                  />
                  {initialItemData.manufacturer.length === 0 ? (
                    <div onClick={() => toggleDropdown("manufacturer")} className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  ) : (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span onClick={() => handleClearFields("manufacturer")} className="text-textColor text-2xl font-light">&times;</span>
                    </div>
                  )}
                </div>
                {openDropdownIndex === "manufacturer" && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                  >
                    <div className="mb-2.5">
                      <SearchBar
                        searchValue={searchValueManufacturer}
                        onSearchChange={setSearchValueManufacturer}
                        placeholder="Select Manufacturer"
                      />
                    </div>
                    {itemsData.bmcrData.manufacturers
                      .filter((manufacturer: string) =>
                        manufacturer
                          .toLowerCase()
                          .includes(searchValueManufacturer.toLowerCase())
                      )
                      .map((manufacturer: string, index: number) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleDropdownSelect("manufacturer", manufacturer)
                          }
                          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                        >
                          <div className="col-span-10 flex">
                            <div>
                              <p className="font-bold text-sm">{manufacturer}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div
                      onClick={() => setIsManufatureModalOpen(true)}
                      className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                    >
                      <SettingsIcons color="darkRed" bold={2} />
                      <p className="mt-0.5">Manage Manufacturer</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="brand-input"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Brand
                </label>
                <div className="relative w-full ">
                  <input
                    id="brand-input"
                    type="text"
                    value={initialItemData.brand}
                    readOnly
                    className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Select or add Brand"
                    onClick={() => toggleDropdown("brand")}
                  />
                  {initialItemData.brand.length === 0 ? (
                    <div onClick={() => toggleDropdown("brand")} className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  ) : (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span onClick={() => handleClearFields("brand")} className="text-textColor text-2xl font-light">&times;</span>
                    </div>
                  )}
                </div>
                {openDropdownIndex === "brand" && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                  >
                    <div className="mb-2.5">
                      <SearchBar
                        searchValue={searchValueBrand}
                        onSearchChange={setSearchValueBrand}
                        placeholder="Select Brand"
                      />
                    </div>
                    {itemsData.bmcrData.brandNames
                      .filter((brand: string) =>
                        brand.toLowerCase().includes(searchValueBrand.toLowerCase())
                      )
                      .map((brand: string, index: number) => (
                        <div
                          key={index}
                          onClick={() => handleDropdownSelect("brand", brand)}
                          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                        >
                          <div className="col-span-10 flex">
                            <div>
                              <p className="font-bold text-sm">{brand}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div
                      onClick={() => setIsBrandModalOpen(true)}
                      className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                    >
                      <SettingsIcons color="darkRed" bold={2} />
                      <p className="mt-0.5">Manage Brand</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="category-input"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Category
                </label>
                <div className="relative w-full">
                  <input
                    id="category-input"
                    type="text"
                    value={initialItemData.categories}
                    readOnly
                    className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Select or add Category"
                    onClick={() => toggleDropdown("category")}
                  />
                  {initialItemData.categories.length === 0 ? (
                    <div onClick={() => toggleDropdown("category")} className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  ) : (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span onClick={() => handleClearFields("categories")} className="text-textColor text-2xl font-light">&times;</span>
                    </div>
                  )}
                </div>
                {openDropdownIndex === "category" && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                  >
                    <div className="mb-2.5">
                      <SearchBar
                        searchValue={searchValueCategory}
                        onSearchChange={setSearchValueCategory}
                        placeholder="Select Category"
                      />
                    </div>
                    {itemsData.bmcrData.categories
                      .filter((category: string) =>
                        category
                          .toLowerCase()
                          .includes(searchValueCategory.toLowerCase())
                      )
                      .map((category: string, index: number) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleDropdownSelect("categories", category)
                          }
                          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                        >
                          <div className="col-span-10 flex">
                            <div>
                              <p className="font-bold text-sm">{category}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div
                      onClick={() => setIsCategoryModalOpen(true)}
                      className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                    >
                      <SettingsIcons color="darkRed" bold={2} />
                      <p className="mt-0.5">Manage Category</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="relative">
                <label
                  htmlFor="rack-input"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Rack
                </label>
                <div className="relative w-full ">
                  <input
                    id="rack-input"
                    type="text"
                    value={initialItemData.rack}
                    readOnly
                    className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Select or add Rack"
                    onClick={() => toggleDropdown("rack")}
                  />
                  {initialItemData.rack.length === 0 ? (
                    <div onClick={() => toggleDropdown("rack")} className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                      <CehvronDown color="gray" />
                    </div>
                  ) : (
                    <div className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700">
                      <span onClick={() => handleClearFields("rack")} className="text-textColor text-2xl font-light">&times;</span>
                    </div>
                  )}
                </div>
                {openDropdownIndex === "rack" && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
                  >
                    <div className="mb-2.5">
                      <SearchBar
                        searchValue={searchValueRack}
                        onSearchChange={setSearchValueRack}
                        placeholder="Select Rack"
                      />
                    </div>
                    {itemsData.bmcrData.racks
                      .filter((rack: string) =>
                        rack.toLowerCase().includes(searchValueRack.toLowerCase())
                      )
                      .map((rack: string, index: number) => (
                        <div
                          key={index}
                          onClick={() => handleDropdownSelect("rack", rack)}
                          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                        >
                          <div className="col-span-10 flex">
                            <div>
                              <p className="font-bold text-sm">{rack}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div
                      onClick={() => setIsRackModalOpen(true)}
                      className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4 px-4 text-darkRed flex text-sm gap-2 font-bold"
                    >
                      <SettingsIcons color="darkRed" bold={2} />
                      <p className="mt-0.5">Manage Rack</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>}



        
        {isService && (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-3">
    <div>
      <p className="text-textColor text-base font-semibold my-2">
        Storage Information
      </p>
      <div className="flex flex-col gap-2">
        <ProductSelection
          placeholder="Select a product"
          options={products}
          value={initialItemData.products}
          label="Select a product"
          error={(errors.products && isService)&& "Product is required"}
          required
          onChange={handleProductChange}
        />
      </div>
    </div>
    
    <div>
      <p className="text-textColor text-base font-semibold my-2">
        Item Codes and Standards
      </p>
      <div className="grid grid-cols-2 gap-x-4">
        <div>
          <label className="text-slate-600 text-sm flex items-center gap-2" htmlFor="upc">
            UPC
          </label>
          <input
            className="pl-3 text-sm w-full rounded-md bg-white border border-inputBorder h-10 focus:outline-none focus:border-darkRed"
            placeholder="Enter UPC"
            name="upc"
            value={initialItemData.upc}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label className="text-slate-600 text-sm flex items-center gap-2" htmlFor="mpn">
            MPN
          </label>
          <input
            className="pl-3 text-sm w-full rounded-md bg-white border border-inputBorder h-10 focus:outline-none focus:border-darkRed"
            placeholder="Enter MPN"
            name="mpn"
            value={initialItemData.mpn}
            onChange={handleInputChange}
          />
        </div>
      </div>
    </div>

    {isService && (
  <div className="relative">
  <label
    htmlFor="taxRate-input"
    className="text-slate-600 text-sm flex items-center gap-2"
  >
    Duration <span className="text-[#bd2e2e] ">*</span>
  </label>
  <div className="relative w-full ">
    <input
      id="taxRate-input"
      type="text"
      value={initialItemData.duration}
      readOnly
      className="cursor-pointer appearance-none w-full mt-0.5 items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
      placeholder="Select a duration"
      onClick={() => toggleDropdown("duration")}
    />
    <div className="cursor-pointer pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
      <CehvronDown color="gray" />
    </div>
  </div>

  {openDropdownIndex ==="duration" && (
    <div
    ref={dropdownRef}
    className="absolute z-10 h-52 overflow-y-scroll bg-white shadow rounded-md mt-1 p-2 w-full space-y-1"
  >
    {[
      "1 Month", "2 Month", "3 Month", "4 Month", "5 Month",
      "6 Month", "7 Month", "8 Month", "9 Month", "10 Month",
      "11 Month", "12 Month"
    ]
      .map((duration, index) => (
        <div
          key={index}
          onClick={() => handleDropdownSelect("duration", duration)}
          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-[#F5F5F5]"
        >
          <div className="col-span-10 flex">
            <div>
              <p className="font-bold text-sm">{duration}</p>
            </div>
          </div>
        </div>
      ))}
  </div>
  
  )}
  {(errors.duration &&isService) &&(
    <div className="text-red-800 text-xs  ms-1">
      Duration is required
    </div>
  )}
</div>
)}



    <div className={`grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-6 ${isService ? "mt-0" : "mt-10"}`}>
      <div>
        <label className="text-slate-600 text-sm flex items-center gap-2" htmlFor="ean">
          EAN
        </label>
        <input
          className="pl-3 text-sm w-full rounded-md bg-white border border-inputBorder h-10 focus:outline-none focus:border-darkRed"
          placeholder="Enter EAN"
          name="ean"
          value={initialItemData.ean}
          onChange={handleInputChange}
        />
      </div>

      <div>
        <label className="text-slate-600 text-sm flex items-center gap-2" htmlFor="isbn">
          ISBN
        </label>
        <input
          className="pl-3 text-sm w-full rounded-md bg-white border border-inputBorder h-10 focus:outline-none focus:border-darkRed"
          placeholder="Enter ISBN"
          name="isbn"
          value={initialItemData.isbn}
          onChange={handleInputChange}
        />
      </div>
    </div>
  </div>
)}


        <div className={`grid grid-cols-1 ${!isService?'md:grid-cols-2':'md:grid-cols-1'}  gap-x-4 gap-y-6`}>
         {!isService&&<div >
            <p className="text-textColor text-base font-semibold mt-2">
              Purchase Information
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Cost Price Section */}
              <div className="relative mt-1.5">
                <label className="text-slate-600 flex text-sm items-center gap-2" htmlFor="costPrice">
                  Cost Price
                </label>
                <div className="flex">
                  <div className="w-16 text-sm mt-0.5 rounded-l-md text-start bg-white text-zinc-400 border border-inputBorder h-10 items-center justify-center flex">
                    {itemsData?.organization?.baseCurrency?.toUpperCase() || "INR"}
                  </div>
                  <input
                    type="number"
                    min={0}
                    className={`pl-3 text-sm w-[100%] mt-0.5 rounded-r-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed ${errors.costPrice ? "border-red-500" : ""
                      }`}
                    placeholder="Enter Price"
                    name="costPrice"
                    value={initialItemData.costPrice}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value) {
                        // Automatically set "Cost of Goods Sold" as the default selection
                        setInitialItemData((prevState) => ({
                          ...prevState,
                          purchaseAccountId:
                            allAccounts.find((item: any) => item.accountSubhead === "Cost of Goods Sold")?._id || "",
                        }));
                      }
                    }}
                    onWheel={(e) => e.currentTarget.blur()}
                  />
                </div>

                {/* ✅ Display Error Message if costPrice is missing */}
                {errors.costPrice && (
                  <div className="text-red-800 text-xs mt-1 ms-1">
                    Cost Price is required
                  </div>
                )}
              </div>


              <div className="relative mt-2">
                <label
                  htmlFor="vendor-input"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Preferred Vendor
                </label>
                <div className="relative w-full">
                  <input
                    id="vendor-input"
                    type="text"
                    value={
                      suppliers.find(
                        (supplier: any) => supplier._id === initialItemData.preferredVendorId
                      )?.supplierDisplayName || ""
                    }
                    readOnly
                    className="cursor-pointer appearance-none w-full items-center flex text-zinc-400 bg-white border border-inputBorder text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Select or add Preferred Vendor"
                    onClick={() => toggleDropdown("preferredVendorId")}
                  />
                  {initialItemData.preferredVendorId ? (
                    <div
                      className="cursor-pointer absolute inset-y-0 right-0.5 -mt-1 flex items-center px-2 text-gray-700"
                    >
                      <span
                        onClick={() => handleClearFields("preferredVendorId")}
                        className="text-textColor text-2xl font-light"
                      >
                        &times;
                      </span>
                    </div>
                  ) : (
                    <div
                      onClick={() => toggleDropdown("preferredVendorId")}
                      className="cursor-pointer absolute inset-y-0 right-0 flex items-center px-2 text-gray-700"
                    >
                      <CehvronDown color="gray" />
                    </div>
                  )}
                </div>
                {openDropdownIndex === "preferredVendorId" && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-10 bg-white shadow rounded-md mt-1 max-h-[200px] overflow-y-scroll p-2 w-full space-y-1"
                  >
                    <div className="mb-2.5">
                      <SearchBar
                        searchValue={searchValueVendor}
                        onSearchChange={setSearchValueVendor}
                        placeholder="Select Preferred Vendor"
                      />
                    </div>
                    {suppliers
                      .filter((supplier: any) =>
                        supplier.supplierDisplayName
                          .toLowerCase()
                          .includes(searchValueVendor.toLowerCase())
                      )
                      .map((supplier: any, index: number) => (
                        <div
                          key={index}
                          onClick={() =>
                            handleDropdownSelect("preferredVendorId", supplier._id)
                          }
                          className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                        >
                          <div className="col-span-10 flex">
                            <div>
                              <p className="font-bold text-sm">{supplier.supplierDisplayName}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    <div className="hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg py-4">
                      <AddSupplierModal page="purchase" />
                    </div>
                  </div>
                )}
              </div>

              <div className="relative w-full col-span-2">
                <label
                  htmlFor="purchaseaccountDropdown"
                  className="text-slate-600 text-sm flex items-center gap-2"
                >
                  Purchase Account
                </label>
                <div className="relative w-full">
                  <select
                    className={`block appearance-none w-full mt-0.5 bg-white border ${errors.purchaseAccountId ? "border-red-800" : "border-inputBorder"
                      } text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white ${errors.purchaseAccountId ? "focus:border-red-800" : "focus:border-darkRed"
                      }`}
                    name="purchaseAccountId"
                    onChange={handleInputChange}
                    value={initialItemData.purchaseAccountId || ""}
                  >
                    <option value="" hidden>
                      Select account
                    </option>
                    {allAccounts
                      ?.filter(
                        (item: { accountSubhead: string }) =>
                          // item.accountSubhead === "Expense" ||
                          item.accountSubhead === "Cost of Goods Sold"
                      )
                      ?.map((item: { _id: string; accountName: string }) => (
                        <option key={item._id} value={item._id}>
                          {item.accountName}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <CehvronDown color="gray" />
                  </div>
                </div>
                {errors.purchaseAccountId && (
                  <div className="text-red-800 text-xs ms-1">
                    Purchase account is required when cost price is entered
                  </div>
                )}
              </div>


            </div>
          </div>}



          <div>
            <p className="text-textColor text-base font-semibold mt-2">Sales Information</p>

            <div className="flex-row sm:flex gap-4 my-1">
              {/* Selling Price Section */}
              <div className="relative  w-full sm:w-1/2 mt-0.5">
                <label className="text-slate-600 flex text-sm gap-2" htmlFor="sellingPrice">
                  Selling Price
                </label>
                <div className="flex">
                  <div className="w-16 text-sm mt-0.5 rounded-l-md text-start bg-white text-zinc-400 border border-inputBorder h-10 items-center justify-center flex">
                    {itemsData?.organization?.baseCurrency?.toUpperCase() || "INR"}
                  </div>
                  <input
                    type="number"
                    min={0}
                    className={`pl-3 text-sm w-[100%] mt-0.5 rounded-r-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed ${errors.sellingPrice ? "border-red-500" : ""
                      }`}
                    placeholder="Enter Price"
                    name="sellingPrice"
                    value={initialItemData.sellingPrice}
                    onChange={(e) => {
                      handleInputChange(e);
                      if (e.target.value) {
                        // Automatically set "Sales" as the default selection
                        setInitialItemData((prevState) => ({
                          ...prevState,
                          salesAccountId:
                            allAccounts.find((item: any) => item.accountName === "Sales")?._id || "",
                        }));
                      }
                    }}
                  />
                </div>

                {/* ✅ Display Selling Price Error Message */}
                {errors.sellingPrice && (
                  <div className="text-red-800 text-xs mt-1 ms-1">
                    Selling Price is required
                  </div>
                )}
              </div>


              {/* MRP Section */}
              <div className="w-full sm:w-1/2">
                <label className="text-slate-600 flex text-sm items-center gap-2" htmlFor="saleMrp">
                  MRP
                </label>
                <div className="flex">
                  <div className="w-16 text-sm mt-0.5 rounded-l-md text-start bg-white text-zinc-400 border border-inputBorder h-10 items-center justify-center flex">
                    {itemsData?.organization?.baseCurrency?.toUpperCase() || "INR"}
                  </div>
                  <input
                    type="number"
                    min={0}
                    className="pl-3 text-sm w-full mt-0.5 rounded-r-md text-start bg-white border border-l-0 border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                    placeholder="Enter MRP"
                    name="saleMrp"
                    value={initialItemData.saleMrp}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Sales Account Dropdown */}
            <div className="relative -mt-1 sm:mt-4">
              <label
                htmlFor="salesAccountDropdown"
                className="text-slate-600 text-sm flex items-center gap-2"
              >
                Sales Account
              </label>

              <div className="relative w-full">
                <select
                  className={`block appearance-none w-full mt-0.5  bg-white border ${errors.salesAccountId ? "border-red-800" : "border-inputBorder"
                    } text-sm h-10 pl-3 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white ${errors.salesAccountId ? "focus:border-red-800" : "focus:border-darkRed"
                    }`}
                  name="salesAccountId"
                  onChange={handleInputChange}
                  value={initialItemData.salesAccountId || ""}
                >
                  <option value="" hidden>
                    Select account
                  </option>
                  {allAccounts
                    ?.filter(
                      (item: { accountSubhead: string }) => item.accountSubhead === "Sales"
                    )
                    .sort((a: { accountName: string }, b: { accountName: string }) =>
                      a.accountName.localeCompare(b.accountName)
                    ) // Sort alphabetically by accountName
                    .map((item: { _id: string; accountName: string }) => (
                      <option key={item._id} value={item._id}>
                        {item.accountName}
                      </option>
                    ))}
                </select>

                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <CehvronDown color="gray" />
                </div>
              </div>

              {errors.salesAccountId && (
                <div className="text-red-800 text-xs mt-1 ms-1">
                  Sales account is required when selling price is entered
                </div>
              )}
            </div>
          </div>


        </div>

        {!isService&&<div className="w-full mt-2">
          <div className="flex items-center gap-1 text-textColor">
            <label
              htmlFor="checkboxTrack"
              className="text-textColor text-base font-semibold mt-2"
            >
              Track Inventory for this item
            </label>
          </div>
          <div className="flex gap-3 mt-1">
            <div className="w-[50%] ">
              <label
                className="text-slate-600 flex text-sm gap-2 mb-0.5"
                htmlFor="openingStock"
              >
                Opening Stock
              </label>
              <input
                type="number"
                min={0}
                className="pl-3 text-sm w-[100%] mt-1  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Value"
                name="openingStock"
                value={initialItemData.openingStock}
                onChange={handleInputChange}
              />
            </div>

            {/* <div className="w-1/3">
              <label
                className="text-slate-600 flex text-sm gap-2 mb-0.5"
                htmlFor="openingStockRatePerUnit"
              >
                Opening Stock Rate Per Unit  <span className="text-[#bd2e2e] ">*</span>
              </label>
              <input
                type="number"
                min={0}
                className="pl-3 text-sm w-[100%] mt-1 rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Value"
                name="openingStockRatePerUnit"
                value={initialItemData.openingStockRatePerUnit}
                onChange={handleInputChange}
              />
            </div>  */}

            <div className="w-[50%]">
              <label
                className="text-slate-600 flex text-sm gap-2 mb-0.5"
                htmlFor="reorderPoint"
              >
                Reorder Point
              </label>
              <input
                type="number"
                min={0}
                className="pl-3 text-sm w-[100%] mt-1  rounded-md text-start bg-white border border-inputBorder h-10 leading-tight focus:outline-none focus:bg-white focus:border-darkRed"
                placeholder="Value"
                name="reorderPoint"
                value={initialItemData.reorderPoint}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>}
      </div>
      <div className="justify-end me-5 flex gap-4 p-2">
        <Link to="/inventory/Item">
          <Button variant="secondary" size="sm" className="text-sm pl-8 pr-8">
            Cancel
          </Button>
        </Link>
        <Button
          onClick={handleSave}
          variant="primary"
          size="sm"
          className="text-sm pl-8 pr-8"
        >
          Save
        </Button>
      </div>
      {isBrandModalOpen && (
        <BrandModal ref={modalRef} onClose={() => setIsBrandModalOpen(false)} />
      )}
      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
        />
      )}
      {isRackModalOpen && (
        <RackModal ref={modalRef} onClose={() => setIsRackModalOpen(false)} />
      )}
      {isManufatureModalOpen && (
        <NewManufacture
          ref={modalRef}
          onClose={() => setIsManufatureModalOpen(false)}
        />
      )}
    </>
  );
};

export default AddItem;
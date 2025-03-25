import { useEffect, useRef, useState } from "react";
import useApi from "../../../Hooks/useApi";
import toast from "react-hot-toast";
import { endponits } from "../../../Services/apiEndpoints";
import CheveronDownIcon from "../../../assets/icons/CheveronDownIcon";
import SearchBar from "../../../Components/SearchBar";
import TrashCan from "../../../assets/icons/TrashCan";
import PlusCircle from "../../../assets/icons/PlusCircle";
import { newCreditTableHead } from "../../../assets/constants";
import { CreditNoteBody } from "../../../Types/Creditnote";

type Row = {
  itemImage: string;
  itemId: string;
  itemName: string;
  quantity: number | string;
  sellingPrice: number | string;
  itemTotaltax: number | string;
  itemAmount: number | string;
  sgst: number | string;
  cgst: number | string;
  igst: number | string;
  vat: number | string;
  sgstAmount: number | string;
  cgstAmount: number | string;
  igstAmount: number | string;
  vatAmount: number | string;
  stock: number | string;
  taxPreference: string;
  salesAccountId?: string;
};

type Props = {
  SalesOrderState?: any;
  isInterState?: Boolean;
  setSalesOrderState?: (value: any) => void;
  oneOrganization?: any;
  isNonTaxable?: Boolean;
  selectedInvoice?: any
};

const CreditNoteTable = ({
  SalesOrderState,
  setSalesOrderState,
  isInterState,
  selectedInvoice
}: Props) => {


  const [openDropdownId, setOpenDropdownId] = useState<number | null>(null);
  const [openDropdownType, setOpenDropdownType] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>("");
  const [items, setItems] = useState<any>([]);
  const { request: getAllItemsRequest } = useApi("get", 5003);
  const previousItemsRef = useRef([]);



  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const [rows, setRows] = useState<Row[]>([
    {
      itemImage: "",
      itemId: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      itemTotaltax: "",
      itemAmount: "",
      sgst: "",
      cgst: "",
      igst: "",
      vat: "",
      sgstAmount: "",
      cgstAmount: "",
      igstAmount: "",
      vatAmount: "",
      stock: "",
      taxPreference: "",
      salesAccountId: ""
    },
  ]);


  const toggleDropdown = (id: number | null, type: string | null, row: Row) => {
    if (!row.itemName) {
      setOpenDropdownId((prevId) => (prevId === id ? null : id));
      setOpenDropdownType(type);
    }
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setOpenDropdownId(null);
      setOpenDropdownType(null);
    }
  };

  const addRow = () => {
    const newRow: Row = {
      itemImage: "",
      itemId: "",
      itemName: "",
      quantity: "",
      sellingPrice: "",
      itemTotaltax: "",
      itemAmount: "",
      sgst: "",
      cgst: "",
      igst: "",
      sgstAmount: "",
      cgstAmount: "",
      igstAmount: "",
      vat: "",
      vatAmount: "",
      stock: "",
      taxPreference: "",
      salesAccountId: ""
    };
    const updatedRows = [...rows, newRow];
    setRows(updatedRows);
  };


  const handleItemSelect = (item: any, index: number) => {
    setOpenDropdownId(null);
    setOpenDropdownType(null);

    // Find the matching item from items array to get the complete item data
    const matchingItem = items.find((i: any) => i._id === item.itemId);
    const itemImage = matchingItem?.itemImage || item.itemImage || "";

    const newRows = [...rows];
    newRows[index] = {
      ...newRows[index],
      itemName: item.itemName,
      itemImage: itemImage, // Set the image explicitly
      sellingPrice: item.sellingPrice,
      quantity: 1,
      itemId: item.itemId,
      cgst: item.cgst,
      sgst: item.sgst,
      igst: item.igst,
      itemAmount: item.itemAmount,
      stock: item.returnQuantity ? item.quantity - item.returnQuantity : item.quantity,
      taxPreference: item.taxPreference,
      salesAccountId: item.salesAccountId,
    };
    const costPrice = Number(newRows[index].sellingPrice);
    const quantity = Number(newRows[index].quantity);
    const totalCostPrice = quantity * costPrice;

    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      totalCostPrice,
      newRows[index],
      isInterState as boolean
    );
    newRows[index].itemAmount = isInterState
      ? (itemAmount + igstAmount).toFixed(2)
      : (itemAmount + cgstAmount + sgstAmount).toFixed(2); newRows[index].cgstAmount = cgstAmount;
    newRows[index].sgstAmount = sgstAmount;
    newRows[index].igstAmount = igstAmount;


    console.log(igstAmount, sgstAmount, cgstAmount, "igstsvdjgjgh")

    if (isInterState) {
      newRows[index].itemTotaltax = igstAmount;
    } else {
      newRows[index].itemTotaltax = cgstAmount + sgstAmount;
    }

    setRows(newRows);

    setSalesOrderState?.((prevData: any) => ({
      ...prevData,
      items: newRows?.map((row) => {
        // Ensure itemImage is included in the state update
        const updatedItem = {
          ...row,
          itemImage: row.itemImage || ""
        };
        return updatedItem;
      }),
    }));
  };


  const calculateTax = (
    totalSellPrice: number,
    item: any,
    isInterState: boolean
  ) => {

    const cgstPercentage = item.cgst || 0;
    const sgstPercentage = item.sgst || 0;
    const igstPercentage = item.igst || 0;

    console.log(cgstPercentage, sgstPercentage, igstPercentage, "qwertyui")


    let cgstAmount = 0;
    let sgstAmount = 0;
    let igstAmount = 0;

    if (!isInterState) {
      cgstAmount = (totalSellPrice * cgstPercentage) / 100;
      sgstAmount = (totalSellPrice * sgstPercentage) / 100;
    } else {
      igstAmount = (totalSellPrice * igstPercentage) / 100;
    }

    return {
      itemAmount: totalSellPrice,
      cgstAmount,
      sgstAmount,
      igstAmount,
    };
  };

  const handleRowChange = (index: number, field: keyof Row, value: string) => {
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], [field]: value };

    const quantity = Number(newRows[index].quantity);
    const sellPrice = Number(newRows[index].sellingPrice);
    const salesQuantity = Number(newRows[index].stock);

    if (quantity > salesQuantity) {
      newRows[index].quantity = salesQuantity.toString()

      toast.error("The entered quantity exceeds available stock.");
      return;
    }

    const totalSellPrice = quantity * sellPrice;

    const { itemAmount, cgstAmount, sgstAmount, igstAmount } = calculateTax(
      totalSellPrice,
      newRows[index],
      isInterState as boolean
    );

    newRows[index].itemAmount = isInterState
      ? (itemAmount + igstAmount).toFixed(2)
      : (itemAmount + cgstAmount + sgstAmount).toFixed(2); newRows[index].cgstAmount = cgstAmount;
    newRows[index].sgstAmount = sgstAmount;
    newRows[index].igstAmount = igstAmount;
    if (isInterState) {
      newRows[index].itemTotaltax = igstAmount
      newRows[index].cgstAmount = ""
      newRows[index].sgstAmount = ""

    }
    else {
      newRows[index].itemTotaltax = cgstAmount + sgstAmount
      newRows[index].igstAmount = ""
    }

    setRows(newRows);

    setSalesOrderState?.((prevData: any) => ({
      ...prevData,
      items: newRows?.map((row) => {
        const updatedItem = { ...row };

        return updatedItem;
      }),
    }));
  };


  const getAllItems = async () => {
    try {
      const url = `${endponits.GET_ALL_ITEMS_SALES}`;
      const apiResponse = await getAllItemsRequest(url);
      const { response, error } = apiResponse;

      if (!error && response) {
        console.log('API Response:', response.data);
        setItems(response.data);
      } else {
        console.log(error);
      }
    } catch (error) {
      console.error("Error fetching items:", error);
    }
  };

  const removeRow = (index: number) => {
    if (rows.length > 1) {
      const newRows = rows?.filter((_, i) => i !== index);

      // Update both rows and purchaseOrderState
      setRows(newRows);
      setSalesOrderState?.((prevData: any) => ({
        ...prevData,
        items: newRows, // Directly use newRows without mapping
      }));
    } else {
      const defaultRow = {
        itemId: "",
        itemImage: "",
        itemName: "",
        quantity: "",
        sellingPrice: "",
        itemTotaltax: "",

        itemAmount: "",
        sgst: "",
        cgst: "",
        igst: "",
        vat: "",
        sgstAmount: "",
        cgstAmount: "",
        igstAmount: "",
        vatAmount: "",
        stock: "",
        taxPreference: "",
        salesAccountId: ""
      };

      // Reset rows to default row
      setRows([defaultRow]);

      // Update purchaseOrderState with the default row
      setSalesOrderState?.((prevData: any) => ({
        ...prevData,
        items: [defaultRow], // Set default row
      }));
    }
  };

  const calculateTotalSGST = () => {
    return rows.reduce((total, row) => {
      const sgst = !isInterState ? (Number(row.sgstAmount) || 0) : 0;
      return total + sgst;
    }, 0);
  };


  // Function to calculate total CGST
  const calculateTotalCGST = () => {
    return rows.reduce((total, row) => {
      console.log(row.cgstAmount, "total cgst");

      const cgst = !isInterState ? (Number(row.cgstAmount) || 0) : 0;
      return total + cgst;
    }, 0);
  };

  // Function to calculate total IGST
  const calculateTotalIGST = () => {
    return rows.reduce((total, row) => {
      const igst = isInterState ? (Number(row.igstAmount) || 0) : 0;
      return total + igst;
    }, 0);
  };

  // Function to calculate total item quantity
  const calculateTotalQuantity = () => {
    return rows.reduce((total, row) => {
      const quantity = parseFloat(row.quantity?.toString() || '0');
      return total + quantity;
    }, 0);
  };

  // Function to calculate the total subtotal
  const calculateTotalSubtotal = () => {
    return rows.reduce((total, row) => {
      const quantity = Number(row.quantity) || 0;
      const itemPrice = Number(row.sellingPrice) || 0;
      const subtotal = quantity * itemPrice;
      return total + subtotal;
    }, 0);
  };






  useEffect(() => {
    if (openDropdownId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openDropdownId]);


  useEffect(() => {
    const totalQuantity = calculateTotalQuantity();
    const totalSGST = calculateTotalSGST();
    const totalCGST = calculateTotalCGST();
    const totalIGST = calculateTotalIGST();
    const totalSellingPrice = calculateTotalSubtotal();



    setSalesOrderState?.((prevData: CreditNoteBody) => ({
      ...prevData,
      totalItem: totalQuantity,
      sgst: isInterState ? "" : totalSGST,
      cgst: isInterState ? "" : totalCGST,
      igst: isInterState ? totalIGST : "",
      subTotal: totalSellingPrice,
      totalTax: isInterState
        ? totalIGST
        : totalSGST + totalCGST,
      totalAmount: totalSellingPrice + SalesOrderState.totalTax

    }));
  }, [rows, SalesOrderState.totalTax]);


  useEffect(() => {
    const updatedRows = rows?.map((row) => {
      const originalPrice = (Number(row.sellingPrice) || 0) * (Number(row.quantity) || 0);

      const taxDetails = calculateTax(
        originalPrice,
        row,
        isInterState as boolean
      );


      return {
        ...row,
        itemAmount: isInterState ? taxDetails.itemAmount + taxDetails.igstAmount : taxDetails.itemAmount + taxDetails.cgstAmount + taxDetails.sgstAmount,
        cgstAmount: taxDetails.cgstAmount > 0 ? taxDetails.cgstAmount : "",
        sgstAmount: taxDetails.sgstAmount > 0 ? taxDetails.sgstAmount : "",
        igstAmount: taxDetails.igstAmount > 0 ? taxDetails.igstAmount : "",
      };
    });

    setRows(updatedRows);
    setSalesOrderState?.((prevData: any) => ({
      ...prevData,
      items: updatedRows?.map((row) => {
        const updatedItem = { ...row };

        return updatedItem;
      }),
    }));

  }, [isInterState, SalesOrderState?.placeOfSupply,]);



  useEffect(() => {
    if (selectedInvoice?.length == 0) {
      const defaultRow = {
        itemId: "",
        itemName: "",
        quantity: "",
        sellingPrice: "",
        itemTotaltax: "",
        itemImage: "",
        itemAmount: "",
        sgst: "",
        cgst: "",
        igst: "",
        vat: "",
        sgstAmount: "",
        cgstAmount: "",
        igstAmount: "",
        vatAmount: "",
        stock: "",
        taxPreference: "",
        salesAccountId: ""
      };

      setRows([defaultRow]);

      setSalesOrderState?.((prevData: any) => ({
        ...prevData,
        items: [defaultRow],
        totalAmount: 0
      }));
    }
  }, [selectedInvoice]);

  const filterItems = () => {
    return selectedInvoice?.items?.filter((item: any) => {
      const isItemAlreadySelected = rows.some((row) => row.itemId === item.itemId);
      const matchingItem = items.find((i: any) => i._id === item.itemId);
      
      if (matchingItem) {
        // Enhance the item with the image from matching item
        item.itemImage = matchingItem.itemImage || "";
      }
      
      return (
        !isItemAlreadySelected &&
        item?.itemName?.toLowerCase().includes(searchValue.toLowerCase()) &&
        items?.some((i: any) => i._id === item?.itemId)
      );
    });
  };

  useEffect(() => {
    if (SalesOrderState?.items) {
      if (JSON.stringify(SalesOrderState.items) !== JSON.stringify(previousItemsRef.current)) {
        const updatedItems = SalesOrderState.items.map((item: any) => {
          const matchingItem = items.find((data: any) => data._id === item.itemId);

          return {
            ...item,
            itemStock: matchingItem?.currentStock || "",
            salesAccountId: matchingItem?.salesAccountId || item.salesAccountId || ""
          };
        });

        setRows(updatedItems);
        previousItemsRef.current = SalesOrderState.items;
      }
    }
  }, [SalesOrderState?.items, items]);




  useEffect(() => {
    getAllItems();
  }, []);




  return (
    <div>

      <div className="rounded-lg border-2 border-tableBorder mt-5">
        <table className="min-w-full bg-white rounded-lg relative pb-4 border-dropdownText">
          <thead className="text-[12px] text-center text-dropdownText">
            <tr className="bg-lightPink">
              {newCreditTableHead?.map((item, index) => (
                <th
                  className="py-2 px-4 font-medium border-b border-tableBorder relative"
                  key={index}
                >
                  {item}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-dropdownText text-center text-[13px] ">
            {rows?.map((row: any, index: number) => (
              <tr key={index}>
                <td className="border-y py-3 px-2 border-tableBorder">
                  <div
                    className="relative w-full"
                    onClick={() => toggleDropdown(index, "searchProduct", row)}
                  >
                    {row.itemName ? (
                      <div className="cursor-pointer gap-2 grid grid-cols-12 appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                        <div className="flex items-start col-span-4">
                          <img
                            className="rounded-full h-10"
                            src={row.itemImage || "path/to/fallback-image.png"} // Add a fallback image
                            alt={row.itemName || "Item"}
                            onError={(e) => {
                              e.currentTarget.src = "path/to/fallback-image.png"; // Fallback if image fails to load
                            }}
                          />
                        </div>
                        <div className="col-span-8  text-start">
                          <p className="text-textColor">{row.itemName}</p>
                        </div>
                      </div>
                    ) : (
                      <div className="cursor-pointer flex appearance-none items-center justify-center h-9 text-zinc-400 bg-white text-sm">
                        <p>Type or click</p>
                        <CheveronDownIcon strokeWidth={""} color="currentColor" />
                      </div>
                    )}
                  </div>
                  {openDropdownId === index && openDropdownType === "searchProduct" && (
                    <div
                      ref={dropdownRef}
                      className="absolute z-10 bg-white shadow rounded-md mt-1 p-2 w-[30%] space-y-1"
                    >
                      <SearchBar
                        searchValue={searchValue}
                        onSearchChange={setSearchValue}
                        placeholder="Select Item"
                      />
                      {selectedInvoice?.items?.length >= 0 ? ( // Check if selectedBill has items
                        filterItems()?.length > 0 ? ( // Check if filtered items exist
                          filterItems()?.map((item: any, idx: number) => (
                            <div
                              key={idx}
                              className="grid grid-cols-12 gap-1 p-2 hover:bg-gray-100 cursor-pointer border border-slate-400 rounded-lg bg-lightPink"
                              onClick={() => handleItemSelect(item, index)}
                            >
                              <div className="col-span-2 flex justify-center">
                                <img
                                  className="rounded-full h-10"
                                  src={item.itemImage || "path/to/fallback-image.png"} // Add a fallback image
                                  alt={item.itemName || "Item"}
                                  onError={(e) => {
                                    e.currentTarget.src = "path/to/fallback-image.png"; // Fallback if image fails to load
                                  }}
                                />
                              </div>
                              <div className="col-span-10 flex">
                                <div className="text-start">
                                  <p className="font-bold text-sm text-black">{item.itemName}</p>
                                  <p className="text-xs text-gray-500">Rate: {item.sellingPrice}</p>
                                </div>
                              </div>
                            </div>
                          ))
                        ) : (
                          <div className="text-center border-slate-400 border rounded-lg">
                            <p className="text-[red] text-sm py-4">Items Not Found!</p>
                          </div>
                        )
                      ) : (
                        <div className="text-center border-slate-400 border rounded-lg">
                          <p className="text-[darkRed] text-sm py-4 px-4">Please select a invoice to view items!</p>
                        </div>
                      )}

                    </div>
                  )}

                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.quantity || ""}
                    onChange={(e) =>
                      handleRowChange(index, "quantity", e.target.value)
                    }
                  /> <br />
                  Stock : {row.stock ? row.stock : "0"}
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.sellingPrice}
                    onChange={(e) =>
                      handleRowChange(index, "sellingPrice", e.target.value)
                    }
                    disabled
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  {
                    <input
                      disabled
                      type="text"
                      placeholder="0"
                      className="w-[50px] focus:outline-none text-center"
                      value={
                        !isInterState
                          ? (
                            ((row.cgstAmount) || 0) + ((row.sgstAmount) || 0) === 0
                              ? "nil"
                              : ((row.cgstAmount) + (row.sgstAmount))
                          )
                          : ((row.igstAmount) || 0) === 0
                            ? "nil"
                            : (row.igstAmount)
                      }
                    />


                  }
                </td>



                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <input
                    disabled
                    type="text"
                    placeholder="0"
                    className="w-[50px]  focus:outline-none text-center"
                    value={row.itemAmount}
                    onChange={(e) =>
                      handleRowChange(index, "itemAmount", e.target.value)
                    }
                  />
                </td>
                <td className="py-2.5 px-4 border-y border-tableBorder">
                  <div
                    className="text-center flex justify-center gap-2"
                    onClick={() => removeRow(index)}
                  >
                    <TrashCan color="darkRed" />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-[60%] mt-0">
        <button
          type="button"
          className="bg-darkGreen text-darkRed rounded-lg py-2 px-6 flex items-center text-sm font-bold"
          onClick={addRow}
        >
          <PlusCircle color="darkRed" />
          Add Item
        </button>
      </div></div>
  )
}

export default CreditNoteTable
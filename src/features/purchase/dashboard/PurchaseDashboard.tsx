import { useEffect, useRef, useState } from "react";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import RefreshIcon from "../../../assets/icons/RefreshIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import PurchaseCards from "./PurchaseCards";
import PurchaseOverTime from "./PurchaseOverTime";
import TopProductBySpend from "./TopProductBySpend";
import RecentTransaction from "./RecentTransaction";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import MonthYearDropdown from "../../../Components/dropdown/MonthYearDropdown";

type Props = {};

function PurchaseDashboard({ }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7005)
  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const dropdownItems = [
    {
      icon: <ArrowDownIcon />,
      text: "Import Supplier",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Supplier",
      onClick: () => {
        console.log("Export Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Current View",
      onClick: () => {
        console.log("Export Current View clicked");
      },
    },
    {
      icon: <RefreshIcon color="#4B5C79" />,
      text: "Refresh List",
      onClick: () => {
        console.log("Refresh List clicked");
      },
    },
  ];


  const getPurchaseOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.PURCHASE_DASH_OVERVIEW}?date=${year}/${month}`)
      if (response && !error) {
        setCardData(response.data)
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  }

  useEffect(() => {
    if (month || year) {
      getPurchaseOverView()
    }
  }, [month, year])

  return (
    <div className="mx-5 my-4 text-[#303F58]">
      <div className=" flex-row sm:flex  items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">
            Purchase
          </h3>
          <p className="text-sm text-dropdownText mt-1">
            A comprehensive snapshot of all purchases, to effectively manage
            procurement and budget allocation.{" "}
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <MonthYearDropdown setMonth={setMonth} year={year} setYear={setYear} month={month} />

          {/* <div onClick={toggleDropdown} className="cursor-pointer">
            <Ellipsis />
          </div> */}

          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-12 right-1 mt-2 w-48 bg-white shadow-xl z-10"
            >
              <ul className="py-1 text-dropdownText">
                {dropdownItems.map((item, index) => (
                  <li
                    key={index}
                    onClick={item.onClick}
                    className="px-4 py-2 flex items-center gap-2 hover:bg-orange-100 rounded-md text-sm cursor-pointer"
                  >
                    {item.icon}
                    {item.text}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
      {/* cards */}
      <div className="mt-4">
        <PurchaseCards data={cardData} />
      </div>

      <div className="grid grid-cols-1 gap-4 my-5 md:grid-cols-2 lg:grid-cols-12">
        {/* Purchase Over Time */}
        <div className="col-span-1 md:col-span-2 lg:col-span-8">
          <PurchaseOverTime date={`${year}/${month}`} />
        </div>

        {/* Top Product By Spend */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4">
          <TopProductBySpend date={`${year}/${month}`} />
        </div>
      </div>

      <RecentTransaction date={`${year}/${month}`} />
    </div>
  );
}

export default PurchaseDashboard;

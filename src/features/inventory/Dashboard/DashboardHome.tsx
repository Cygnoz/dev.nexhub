import { useEffect, useRef, useState } from "react";
import ArrowDownIcon from "../../../assets/icons/ArrowDownIcon";
import ArrowUpIcon from "../../../assets/icons/ArrowUpIcon";
import RefreshIcon from "../../../assets/icons/RefreshIcon";
import InventoryCards from "./InventoryCards";
import TopSellingProduct from "./TopSellingProduct";
import TopProductCategories from "./TopProductCategories";
import StockLevelOvertime from "./StockLevelOvertime";
import MostFrequentlyRec from "./MostFrequentlyRec";
import MonthYearDropdown from "../../../Components/dropdown/MonthYearDropdown";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
// import MonthYearDropdown from "../../../Components/dropdown/MonthYearDropdown"; 

type DropdownItem = {
  icon: JSX.Element;
  text: string;
  onClick: () => void;
};

// Extend DashboardData to include required properties

type Props = {};

function DashboardHome({ }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7003)

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      setIsDropdownOpen(false);
    }
  };

  // const handleDateChange = (month: number, year: number) => {
  //   getDashboards(month, year);
  // };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);


  const dropdownItems: DropdownItem[] = [
    {
      icon: <ArrowDownIcon />,
      text: "Import Items",
      onClick: () => {
        console.log("Import Sales Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Items",
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
        console.log("Refresh List clicked");// Refresh the data
      },
    },
  ];

  const getInventoryOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.INVENTORY_DASH_OVERVIEW}?date=${year}/${month}`)
      if (response && !error) {
        console.log("res", response.data);

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
      getInventoryOverView()
    }
  }, [month, year])

  return (
    <div className="mx-5 mb-2 space-y-8 text-[#303F58]">
      <div className="flex-row sm:flex items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">
            Inventory Overview
          </h3>
        </div>
        <div className="ml-auto gap-3 mt-2 flex items-center">
          <MonthYearDropdown month={month} setMonth={setMonth} year={year} setYear={setYear} />
          <div onClick={toggleDropdown} className="cursor-pointer">
            {/* Add your ellipsis icon here if needed */}
          </div>
          {isDropdownOpen && (
            <div
              ref={dropdownRef}
              className="absolute top-16 right-4 mt-2 w-48 bg-white shadow-xl z-10"
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

      {/* Cards */}
      <InventoryCards data={cardData} />

      {/* Top suppliers and supplier retention rate over time */}
      <div className="grid grid-cols-1 sm:grid-cols-10 gap-5">
        <div className="col-span-1 sm:col-span-6 flex justify-center">
          <TopSellingProduct date={`${year}/${month}`} />
        </div>
        <div className="col-span-1 sm:col-span-4 flex justify-center">
          <TopProductCategories date={`${year}/${month}`} />
        </div>
        <div className="col-span-1 sm:col-span-6 flex justify-center items-center">
          <StockLevelOvertime date={`${year}/${month}`} />
        </div>
        <div className="col-span-1 sm:col-span-4 flex justify-center">
          <MostFrequentlyRec date={`${year}/${month}`} />
        </div>
      </div>

    </div>
  );
}

export default DashboardHome;

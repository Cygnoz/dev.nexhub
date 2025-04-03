import { useEffect, useRef, useState } from 'react';
import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../assets/icons/ArrowUpIcon';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import MonthYearDropdown from '../../../Components/dropdown/MonthYearDropdown';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
import AverageDeliveryTimebySupplier from './AverageDeliveryTimebySupplier';
import Cards from './Cards';
import NumberofOrdersbySupplier from './NumberofOrdersbySupplier';
import TopSupplierBySpend from './TopSupplierBySpend';
import TotalProduct from './TotalProduct';

type Props = {};

function DashboardHome({ }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7009)
  // const toggleDropdown = () => {
  //   setIsDropdownOpen(!isDropdownOpen);
  // };

  const handleClickOutside = (event: MouseEvent) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const getSupplierOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.SUPPLIER_DASH_OVERVIEW}?date=${year}/${month}`)
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
      getSupplierOverView()
    }
  }, [month, year])

  return (
    <div className="px-6 mb-3 space-y-8 text-[#303F58]">
      <div className="flex-row sm:flex items-center relative">
        <div>
          <h3 className="font-bold text-xl text-textColor ">Supplier</h3>
          <p className="text-sm text-gray mt-1">
            Effectively manage and track supplier information to enhance procurement processes and ensure reliable partnerships
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <MonthYearDropdown month={month} setMonth={setMonth} year={year} setYear={setYear} />
          {/* <div onClick={toggleDropdown} className="cursor-pointer">
            <Ellipsis />
          </div> */}
          {isDropdownOpen && (
            <div ref={dropdownRef} className="absolute top-12 right-1 mt-2 w-48 bg-white shadow-xl z-10">
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
      <Cards data={cardData} />
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-10">
        {/* Total Product */}
        <div className="col-span-1 md:col-span-2 lg:col-span-6 flex justify-center">
          <TotalProduct date={`${year}/${month}`} />
        </div>

        {/* Average Delivery Time by Supplier */}
        <div className="col-span-1 md:col-span-2 lg:col-span-4 flex justify-center">
          <AverageDeliveryTimebySupplier date={`${year}/${month}`} />
        </div>

        {/* Top Supplier By Spend */}
        <div className="col-span-1 md:col-span-1 lg:col-span-5 flex justify-center items-center">
          <TopSupplierBySpend date={`${year}/${month}`} />
        </div>

        {/* Number of Orders by Supplier */}
        <div className="col-span-1 md:col-span-1 lg:col-span-5 flex justify-center">
          <NumberofOrdersbySupplier date={`${year}/${month}`} />
        </div>
      </div>

    </div>
  );
}

export default DashboardHome;

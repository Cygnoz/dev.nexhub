import { useEffect, useRef, useState } from 'react';
import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon';
import ArrowUpIcon from '../../../assets/icons/ArrowUpIcon';
import RefreshIcon from '../../../assets/icons/RefreshIcon';
import MonthYearDropdown from '../../../Components/dropdown/MonthYearDropdown';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
import Cards from './Cards';
import CustomersRetentionRate from './CustomersRetentionRate';
import ExpBreakdownCategory from './ExpBreakdownCategory';
import ExpBreakdownSupplier from './ExpBreakdownSupplier';
import TopCategories from './TopCategories';


type Props = {};

function DashboardHome({ }: Props) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7008)
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
      text: "Import Expense",
      onClick: () => {
        console.log("Import Expense Order clicked");
      },
    },
    {
      icon: <ArrowUpIcon />,
      text: "Export Expense",
      onClick: () => {
        console.log("Export Expense  Order clicked");
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

  const getExpenseOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.EXPENSE_DASH_OVERVIEW}?date=${year}/${month}`)
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
      getExpenseOverView()
    }
  }, [month, year])

  return (
    <div className="px-6 mb-3 space-y-8 text-[#303F58]">
      <div className="flex-row sm:flex items-center relative">
        <div>
          <h3 className="font-bold text-2xl text-textColor">Expense Overview</h3>
          <p className="text-sm text-gray mt-1">
            Lorem ipsum dolor sit amet consectetur. Commodo enim odio fringilla egestas consectetur amet.
          </p>
        </div>
        <div className="ml-auto gap-3 flex items-center">
          <MonthYearDropdown setMonth={setMonth} year={year} setYear={setYear} month={month} />
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


      {/* Top suppliers and supplier retention rate over time */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {/* Customers Retention Rate */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 flex justify-center">
          <CustomersRetentionRate date={`${year}/${month}`} />
        </div>

        {/* Top Categories */}
        <div className="col-span-1 flex justify-center">
          <TopCategories date={`${year}/${month}`} />
        </div>

        {/* Expense Breakdown by Category */}
        <div className="col-span-1 flex justify-center">
          <ExpBreakdownCategory date={`${year}/${month}`} />
        </div>

        {/* Expense Breakdown by Supplier */}
        <div className="col-span-1 md:col-span-2 lg:col-span-2 flex justify-center">
          <ExpBreakdownSupplier date={`${year}/${month}`} />
        </div>
      </div>

    </div>
  );
}

export default DashboardHome;

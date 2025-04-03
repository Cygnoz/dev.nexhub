import { useEffect, useRef, useState } from 'react'
// import ArrowDownIcon from '../../../assets/icons/ArrowDownIcon'
// import ArrowUpIcon from '../../../assets/icons/ArrowUpIcon'
// import Ellipsis from '../../../assets/icons/Ellipsis'
// import RefreshIcon from '../../../assets/icons/RefreshIcon'
import AvaragePurchase from './AvaragePurchase'
import Cards from './Cards'
import CustomersRetentionRate from './CustomersRetentionRate'
import TopCustomers from './TopCustomers'
import MonthYearDropdown from '../../../Components/dropdown/MonthYearDropdown'
import useApi from '../../../Hooks/useApi'
import { endponits } from '../../../Services/apiEndpoints'
type Props = {}

function CustomerDashboard({ }: Props) {
  //   const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7002)
  //   const toggleDropdown = () => {
  //     setIsDropdownOpen(!isDropdownOpen);
  //   };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      dropdownRef.current &&
      !dropdownRef.current.contains(event.target as Node)
    ) {
      //   setIsDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  //   const dropdownItems = [
  //     {
  //       icon: <ArrowDownIcon />,
  //       text: "Import Supplier",
  //       onClick: () => {
  //         console.log("Import Sales Order clicked");
  //       },
  //     },
  //     {
  //       icon: <ArrowUpIcon />,
  //       text: "Export Supplier",
  //       onClick: () => {
  //         console.log("Export Sales Order clicked");
  //       },
  //     },
  //     {
  //       icon: <ArrowUpIcon />,
  //       text: "Export Current View",
  //       onClick: () => {
  //         console.log("Export Current View clicked");
  //       },
  //     },
  //     {
  //       icon: <RefreshIcon color="#4B5C79" />,
  //       text: "Refresh List",
  //       onClick: () => {
  //         console.log("Refresh List clicked");
  //       },
  //     },
  //   ];
  const getCustomerOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.CUST_DASH_OVERVIEW}?date=${year}/${month}`)
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
      getCustomerOverView()
    }
  }, [month, year])

  return (

    <>
      <div className='mx-5 my-3 space-y-8 text-[#303F58]'>
        <div className=" flex-row sm:flex sm:justify-between  items-center relative">
          <div>
            <h3 className="font-bold text-xl text-textColor ">Customer Overview</h3>
            <p className="text-sm text-gray mt-1">
              A customer overview is a high level description that provides key insights into business customer base.
            </p>
          </div>
          <MonthYearDropdown month={month} setMonth={setMonth} year={year} setYear={setYear} />
          {/* <div className="ml-auto gap-3 flex items-center">
            <div onClick={toggleDropdown} className="cursor-pointer">
              {/* <Ellipsis /> */}
          {/* </div> */}

          {/* {isDropdownOpen && (
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
          </div> */}
        </div>
        {/* Cards */}

        <Cards data={cardData} />


        {/* Top suppliers and supplier rentaion rate overtime */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          <div className="flex sm:col-span-2 justify-center">
            <TopCustomers date={`${year}/${month}`} />
          </div>
          <div className="flex justify-center">
            <AvaragePurchase date={`${year}/${month}`} />
          </div>
          <div className="col-span-1 sm:col-span-3 flex justify-center">
            <CustomersRetentionRate date={`${year}/${month}`} />
          </div>
        </div>

      </div>

    </>
  );
}

export default CustomerDashboard;
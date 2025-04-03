import { useEffect, useState } from "react"
// import Button from "../Components/Button"
// import bannerBg from "../assets/Images/Banner-bg.png"
// import happyWoman from "../assets/Images/Businesswoman happy about profit growth.png"
import Cards from "../features/dashboard/Cards"
import ExpenseByCategory from "../features/dashboard/ExpenseByCategory"
import SalesOverTime from "../features/dashboard/SalesOverTime"
import TopCustomers from "../features/dashboard/TopCustomers"
import TopSellingProducts from "../features/dashboard/TopSellingProducts"
import useApi from "../Hooks/useApi"
import { endponits } from "../Services/apiEndpoints"
import MonthYearDropdown from "../Components/dropdown/MonthYearDropdown"
import { useLocation } from "react-router-dom"

type Props = {}

function Dashboard({ }: Props) {

  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7004)
  const { request: getTopCustomers } = useApi("get", 7004);
  const [customerData, setCustomerData] = useState<any>();
  const location=useLocation()
  const getMainOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.MAIN_DASH_OVERVIEW}?date=${year}/${month}`)
      if (response && !error) {
        setCardData(response.data)
        console.log("res", response.data);

      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  }

  useEffect(() => {
    if (month || year) {
      getMainOverView()
      getTopCus();
    }
  }, [month, year])


  const getTopCus = async () => {
    try {
      const { response, error } = await getTopCustomers(
        `${endponits.MAIN_DASH_TOP_PRODUCT_CUSTOMER}?date=${year}/${month}`
      );
      if (response && !error) {
        console.log("top", response.data);

        // Transform API response into required forma

        setCustomerData(response.data);
      } else {
        console.log("err", error);
      }
    } catch (error) {
      console.log("er", error);
    }
  };
  useEffect(()=>{
    if(location.pathname=="/"){
      localStorage.setItem('savedIndex','0')
      localStorage.setItem('savedSelectedIndex','0')
    }
  },[location])

  return (
    <div className="mx-4 sm:mx-6 my-4 min-h-screen">
      {/* Banner Section */}
      {/* <div
        className="relative rounded-lg p-6 sm:px-9 flex flex-col sm:flex-row justify-between items-center bg-cover bg-center"
        style={{ backgroundImage: `url(${bannerBg})` }}
      >
        <div className="absolute top-2 right-5 text-3xl font-light cursor-pointer">
          &times;
        </div>

        <div className="text-center sm:text-left">
          <p className="text-[#263238] font-bold text-lg sm:text-xl">
            Get Ready to Unlock Predictive Maintenance Insights!
          </p>
          <p className="mt-1 text-[#272727] text-sm sm:text-base w-full sm:w-[70%]">
            Anticipate maintenance needs before issues arise, optimizing uptime and reducing unexpected costs.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          <Button className="h-9 px-4 w-full sm:w-auto flex justify-center">
            Explore Now
          </Button>
          <img src={happyWoman} className="w-32 sm:w-48 object-cover" alt="" />
        </div>
      </div> */}

      {/* Overview & Dropdown */}
      <div className="flex flex-col sm:flex-row items-center sm:justify-between my-4 relative">
        <p className="text-[#454545] font-bold text-lg sm:text-xl">Overview</p>
        <MonthYearDropdown setMonth={setMonth} year={year} setYear={setYear} month={month} />
      </div>

      {/* Cards Section */}
      <Cards data={cardData} />

      <br />

      {/* Charts & Data Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-10 gap-5">
        <div className="col-span-1 sm:col-span-6 flex justify-center">
          <SalesOverTime date={`${year}/${month}`} />
        </div>
        <div className="col-span-1 sm:col-span-4 flex justify-center">
          <ExpenseByCategory date={`${year}/${month}`} />
        </div>
        <div className="col-span-1 sm:col-span-5 flex justify-center">
          <TopSellingProducts topSellingData={customerData?.topProducts} />
        </div>
        <div className="col-span-1 sm:col-span-5 flex justify-center">
          <TopCustomers topCustomerData={customerData?.topCustomers} />
        </div>
      </div>
    </div>

  )
}

export default Dashboard
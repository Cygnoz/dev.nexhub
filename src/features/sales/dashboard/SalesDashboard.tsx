import { useEffect, useState } from 'react';
import Cards from './Cards'
import RecentTransactions from './RecentTransactions';
import SalesOverTime from './SalesOverTime';
import TopSalesByCustomer from './TopSalesByCustomer';
import TopSalesOrder from './TopSalesOrder';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
import MonthYearDropdown from '../../../Components/dropdown/MonthYearDropdown';
type Props = {}

function SalesDashboard({ }: Props) {
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
  const [cardData, setCardData] = useState<any>()
  const { request: getOverView } = useApi('get', 7007)

  const getSalesOverView = async () => {
    try {
      const { response, error } = await getOverView(`${endponits.SALES_DASH_OVERVIEW}?date=${year}/${month}`)
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
      getSalesOverView()
    }
  }, [month, year])

  return (

    <>
      <div className='mx-5 my-3 space-y-8 text-[#303F58]'>
        <div className="flex-row sm:flex justify-between  items-center relative">
          <div>
            <h3 className="font-bold text-xl text-textColor ">Sales Overview</h3>
            <p className="text-sm text-gray mt-1">
              A sales overview is a summary of our business’s sales performance
            </p>
          </div>
          <MonthYearDropdown setMonth={setMonth} year={year} setYear={setYear} month={month} />
        </div>
        {/* Cards */}
        <Cards data={cardData} />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-10 gap-5">
          <div className="lg:col-span-6 sm:col-span-1 flex justify-center">
            <SalesOverTime date={`${year}/${month}`} />
          </div>
          <div className="lg:col-span-4 sm:col-span-1 flex justify-center">
            <TopSalesOrder date={`${year}/${month}`} />
          </div>
          <div className="lg:col-span-5 sm:col-span-1 flex justify-center">
            <TopSalesByCustomer date={`${year}/${month}`} />
          </div>
          <div className="lg:col-span-5 sm:col-span-1 flex justify-center">
            <RecentTransactions date={`${year}/${month}`} />
          </div>
        </div>


      </div>

    </>
  );
}

export default SalesDashboard;

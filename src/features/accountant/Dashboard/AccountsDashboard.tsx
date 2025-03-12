import { useEffect, useState } from 'react'
import MonthYearDropdown from '../../../Components/dropdown/MonthYearDropdown'
import useApi from '../../../Hooks/useApi'
import { endponits } from '../../../Services/apiEndpoints'
import AccountPayableAging from './AccountPayableAging'
import AccountReceivableAging from './AccountReceivableAging'
import Cards from './Cards'
import InvoiceStatus from './InvoiceStatus'
import TotalRevenue from './TotalRevenue'
type Props = {}


function AccountsDashboard({}: Props) {
  const currentDate = new Date();
  const [month, setMonth] = useState(String(currentDate.getMonth() + 1).padStart(2, "0")); // Current month (zero-based index)
  const [year, setYear] = useState(currentDate.getFullYear()); // Current year
    const [cardData,setCardData] = useState<any>()
    const {request:getOverView}=useApi('get',5001)
   const getAccountsOverView=async()=>{
          try{
              const {response,error}=await getOverView(`${endponits.ACCOUNT_DASH_OVERVIEW}?date=${year}/${month}`)
              if(response&&!error){
                  setCardData(response.data)
              }else{
                  console.log("err",error);
              }
          }catch(error){
              console.log("er",error);
          }
      }
     
        useEffect(()=>{
          if(month||year){
              getAccountsOverView()
          }
        },[month,year])
  return (

    <>
    <div className='mx-5 space-y-8 text-[#303F58]'>
    <div className=" flex  items-center relative justify-between">
          <div>
            <h3 className="font-bold text-xl text-textColor ">Accountant Overview</h3>
            <p className="text-sm text-gray mt-1">
            Provides a comprehensive summary of financial accounts. It serves a vital tool for monitoring financial performace
            </p>
          </div>
          <MonthYearDropdown setMonth={setMonth} year={year} setYear={setYear} month={month}/>
        </div>
    
        <Cards data={cardData}/>

        <div className="grid grid-cols-10 gap-5">
          <div className="col-span-6 flex justify-center">
          <TotalRevenue date={`${year}/${month}`}/>
          </div>
          <div className="col-span-4 flex justify-center">
          <AccountReceivableAging date={`${year}`}/>
          </div>
          <div className="col-span-6 flex justify-center">
          <AccountPayableAging date={`${year}`}/>
          </div>
          <div className="col-span-4 flex justify-center">
          <InvoiceStatus date={`${year}/${month}`}/>
          </div>
        </div>
      </div>

      </>
  );
}

export default AccountsDashboard;

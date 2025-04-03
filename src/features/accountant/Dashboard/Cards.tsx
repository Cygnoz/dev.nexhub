import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import OrderCards from "./OrderCards";
type Props = {
  data?:any
}

const Cards = ({data}: Props) => {  
  
  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Revenue",
      count: data?.totalRevenue || 0,
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Accounts Payable",
      count: data?.accountsPayable || 0,
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Accounts Receivable",
        count: data?.accountsReceivable || 0,
        rating: "12,95",
    },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Pending Bills",
        count: data?.pendingBills || 0,
        rating: "18",
    },
  ];
  return (
    <div>
        <div className="flex-row sm:flex justify-between gap-4 overflow-x-auto">
      {cards.map((card, index) => (
        <OrderCards
          key={index}
          icon={card.icon}
          title={card.title}
          count={card.count}
          rating={card.rating}
        />
      ))}
    </div>
    </div>
  )
}

export default Cards
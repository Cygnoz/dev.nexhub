import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import TotalSalesIcon from "../../../assets/icons/TotalSalesIcon";
import OrderCards from "./OrderCards"
type Props = {
  data?:any
}

const Cards = ({data}: Props) => {

  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Customers",
      count: data?.totalCustomers,
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "New Customers",
      count: data?.newCustomer,
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Active Customers",
        count: data?.activeCustomers,
        rating: "12,95",
    },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Customer Rentation Rate",
        count: data?.customerRetentionRate,
        rating: "18",
    },
    {
        icon: <TotalSalesIcon/>,
        title: "Customers Churn Rate",
        count: data?.customerChurnRate,
        rating: "10",
    },
  ];
  return (
    <div>
        <div className=" flex-row sm:flex justify-between gap-3">
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
import ActiveCustomerIcon from "../../../assets/icons/ActiveCustomerIcon";
import CustomerRentationIcon from "../../../assets/icons/CustomerRentationIcon";
import NewCustomerIcon from "../../../assets/icons/NewCustomerIcon";
import TopCustomerIcon from "../../../assets/icons/TopCustomerIcon";
import OrderCards from "./OrderCards";
type Props = {
  data: any;
}

const Cards = ({data}: Props) => {

  const cards = [
    {
      icon: <TopCustomerIcon/>,
      title: "Total Sales Revenue",
      count: data?.totalRevenue || 0,
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Sales Orders",
      count: data?.totalSalesOrderCount || 0,
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Quotes",
        count: data?.
        totalSalesQuoteCount || 0,
        rating: "12,95",
    },
    {
      icon:<CustomerRentationIcon/> ,
      title: "Invoices",
      count:data?.totalInvoiceCount || 0,
      rating: "18",
  },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Credit Notes",
        count:data?.totalCreditNoteCount || 0,
        rating: "18",
    },
  ];
  return (
    <div>
        <div className="sm:flex justify-between  gap-4 overflow-x-auto">
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
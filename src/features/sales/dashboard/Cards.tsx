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
      count: data?.totalRevenue,
      rating: "12,95",
    },
    {
      icon: <NewCustomerIcon/>,
      title: "Sales Orders",
      count: data?.totalSalesOrderCount,
      rating: "18,95",
    },
    {
        icon: <ActiveCustomerIcon/>,
        title: "Quotes",
        count: data?.
        totalSalesQuoteCount,
        rating: "12,95",
    },
    {
      icon:<CustomerRentationIcon/> ,
      title: "Invoices",
      count:data?.totalInvoiceCount,
      rating: "18",
  },
    {
        icon:<CustomerRentationIcon/> ,
        title: "Credit Notes",
        count:data?.totalCreditNoteCount,
        rating: "18",
    },
  ];
  return (
    <div>
        <div className="flex justify-between gap-4">
      {cards?.map((card, index) => (
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
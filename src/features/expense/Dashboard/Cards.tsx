import { useState } from "react";
import OrderCards from "./OrderCards";
import UserRounded from "../../../assets/icons/UserRounded";
import DollerSign from "../../../assets/icons/DollerSign";
type CardProps = {
  data?:any
}
const Cards = ({data}:CardProps) => {
  const [activeCard, setActiveCard] = useState<number | null>(0);
  const handleCardClick = (index: number) => {
    setActiveCard(index);
  };
  console.log("data",data);

  const cards = [
    {
      icon: UserRounded,
      title: "Total Expenses",
      count: data?.totalExpense,
    },
    {
      icon: DollerSign,
      title: "Expense Reports Submitted",
      count: data?.expenseReportsSubmitted,
    },
  ];

  return (
    <div>
      <div className="flex justify-between w-full space-x-4">
        {cards.map((card, index) => (
          <OrderCards
            key={index}
            icon={card.icon} 
            title={card.title}
            count={card.count}
            active={activeCard === index}
            onClick={() => handleCardClick(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Cards;

import React, { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from "recharts";
import Tooltips from "../../../Components/tooltip/Tooltip";
import useApi from "../../../Hooks/useApi";
import { endponits } from "../../../Services/apiEndpoints";
import NoData from "../../../Components/charts/Nodata";

interface SalesData {
  date: string;
  totalSales: number;
}

interface TransformedData {
  name: string;
  value: number;
}



interface SalesOverTimeProps {
  date: string;
}

const SalesOverTime: React.FC<SalesOverTimeProps> = ({ date }) => {
  const { request: getSalesOvertime } = useApi("get", 7004);
  const [salesData, setSalesData] = useState<TransformedData[]>([]);

  const transformData = (dailySales: SalesData[]): TransformedData[] => {
    const groupedData: TransformedData[] = [
      { name: "0-5", value: 0 },
      { name: "5-10", value: 0 },
      { name: "10-15", value: 0 },
      { name: "15-20", value: 0 },
      { name: "20-25", value: 0 },
      { name: "25-31", value: 0 },
    ];

    dailySales?.forEach(({ date, totalSales }) => {
      const day = parseInt(date.split("-")[2], 10);
      if (day <= 5) groupedData[0].value += totalSales;
      else if (day <= 10) groupedData[1].value += totalSales;
      else if (day <= 15) groupedData[2].value += totalSales;
      else if (day <= 20) groupedData[3].value += totalSales;
      else if (day <= 25) groupedData[4].value += totalSales;
      else groupedData[5].value += totalSales;
    });
    return groupedData;
  };

  const fetchSalesData = async () => {
    try {
      const { response, error } = await getSalesOvertime(
        `${endponits.MAIN_DASH_SALES_OVER_TIME}?date=${date}`
      );
      if (response && !error) {
        setSalesData(transformData(response?.data?.dailySales));
      }
    } catch (error) {
      console.error("Fetch Error:", error);
    }
  };

  useEffect(() => {
    if (date) fetchSalesData();
  }, [date]);

  return (
    <div className="bg-white rounded-lg w-full py-8">
     <h3 className="ms-10 mb-6 text-[#303F58] text-[16px] font-bold">
        Sales Over Time
      </h3>


     {salesData?.some((item:any) => item.value> 0) ? <ResponsiveContainer width="100%" height={340}>
        <LineChart data={salesData}>
          <XAxis
            dataKey="name"
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            padding={{ left: 30, right: 30 }}
          />
          <YAxis
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12 }}
            interval={0}
          />
          <CartesianGrid vertical={false} stroke="#E2E8F0" />
          <RechartsTooltip
            content={({ payload }) =>
              payload && payload.length ? (
                <Tooltips
                  content={`${payload[0].value}`}
                  textColor="#ffffff"
                  bgColor="#4A5568"
                  arrowColor="#4A5568"
                  width="50px"
                />
              ) : null
            }
            cursor={false}
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#4A5568"
            strokeWidth={2}
            dot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>:
       <NoData parentHeight="400px"/>
      }
    </div>
  );
};

export default SalesOverTime;
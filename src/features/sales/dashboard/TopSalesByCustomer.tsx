import React, { useEffect, useState } from 'react';
import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import Tooltips from '../../../Components/tooltip/Tooltip';
import useApi from '../../../Hooks/useApi';
import { endponits } from '../../../Services/apiEndpoints';
import NoData from '../../../Components/charts/Nodata';

type Props = {
  date: any;
};

const colors = ['#f2c6b8', '#a72522', '#fbe6c3', '#eef1d6', '#e3e7e5', '#8fd3f4', '#ffcc00'];

interface DataItem {
  name: string;
  value: number;
}

const renderCustomTooltip: React.FC<any> = ({ payload }) => {
  if (payload && payload.length) {
    return (
      <Tooltips
        content={`${payload[0].value}`}
        textColor="#ffffff"
        bgColor="#0099F8"
        arrowColor="#0099F8"
        width="80px"
      />
    );
  }
  return null;
};

interface CustomBarProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  fill?: string;
}

const CustomBar: React.FC<CustomBarProps> = ({ x = 0, y = 0, width = 0, height = 0, fill = '' }) => {
  const radius = 10;
  return (
    <g>
      <path
        d={`M${x},${y} 
           L${x},${y + height} 
           L${x + width - radius},${y + height} 
           Q${x + width},${y + height} ${x + width},${y + height - radius}
           L${x + width},${y + radius} 
           Q${x + width},${y} ${x + width - radius},${y} 
           Z`}
        fill={fill}
      />
    </g>
  );
};

function TopSalesByCustomer({ date }: Props) {
  const { request: getTopCustomers } = useApi('get', 7002);
  const [topCustomerData, setTopCustomerData] = useState<DataItem[]>([]);

  const getTopCus = async () => {
    try {
      const { response, error } = await getTopCustomers(`${endponits.CUST_DASH_TOP_CUSTOMERS}?date=${date}`);
      if (response && !error) {
        console.log('top', response.data);

        // Transform API response into required format
        const formattedData = response?.data?.topCustomers?.map((customer: any) => ({
          name: customer.customerName.split(' ')[0],
          value: customer.totalSpent,
        }));

        setTopCustomerData(formattedData);
      } else {
        console.log('err', error);
      }
    } catch (error) {
      console.log('er', error);
    }
  };

  useEffect(() => {
    if (date) {
      getTopCus();
    }
  }, [date]);

  // Get the max value to dynamically adjust domain
  const maxSpent = Math.max(...topCustomerData.map((item) => item.value), 100000);

  return (
    <div className="bg-white rounded-lg w-full px-8 overflow-x-auto">
      <h3 className="text-[16px] mt-6 font-bold">Top Sales By Customer</h3>
     {topCustomerData?.length>0? <ResponsiveContainer width="100%" height={400}>
        <BarChart layout="vertical" data={topCustomerData} margin={{ left: -40, right: 100, bottom: -25 }}>
          <XAxis
            type="number"
            stroke="#4A5568"
            fontSize={10}
            axisLine={false}
            tickLine={false}
            domain={[0, maxSpent]}
          />
          <YAxis
            type="category"
            dataKey="name"
            stroke="#4A5568"
            axisLine={false}
            tickLine={false}
            fontSize={10}
            width={100}
            interval={0}
          />
          <Tooltip content={renderCustomTooltip} cursor={{ fill: 'transparent' }} />
          <Bar shape={<CustomBar />} barSize={30} dataKey="value" fill="#8884d8">
            <LabelList dataKey="value" position="right" fontSize={10} />
            {topCustomerData.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      :
      <NoData parentHeight="400px"/>
      }
    </div>
  );
}

export default TopSalesByCustomer;

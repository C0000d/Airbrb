// RevenueGraph.jsx
import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

interface profitdata {
  day: string;
  revenue: string;
}

interface RevenueGraphProps {
  revenueData: profitdata[];
}

const RevenueGraph: React.FC<RevenueGraphProps> = ({ revenueData }) => {
  const data = {
    labels: revenueData.map(item => item.day),
    datasets: [
      {
        label: 'Daily Revenue',
        data: revenueData.map(item => item.revenue),
        fill: false,
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  return <Line data={data} />;
};

export default RevenueGraph;

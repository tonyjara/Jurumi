import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useColorMode, useColorModeValue } from '@chakra-ui/react';
import { kFormatter, thousandsFormatter } from '@/lib/utils/DecimalHelpers';
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

interface props {
  title: string;
  categories?: any[];
  series: ApexNonAxisChartSeries | ApexAxisChartSeries;
}

export default function HorizontalBarchart({
  title,
  categories,
  series,
}: props) {
  const fontColor = useColorModeValue('gray.800', 'white');
  const { colorMode } = useColorMode();

  const options: ApexCharts.ApexOptions = {
    chart: {
      type: 'bar',
      height: 350,
      // stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: true,
      },
    },
    stroke: {
      width: 1,
      colors: ['#fff'],
    },
    title: {
      text: title,
      style: { fontSize: '20px', color: fontColor },
    },
    xaxis: {
      // Text at the bottom of the chart
      categories: categories ?? [],

      labels: {
        style: { fontSize: '10px', colors: fontColor },
        formatter: function (val) {
          return val;
        },
      },
    },
    yaxis: {
      //Text to the left of the chart
      labels: {
        style: { fontSize: '20px', colors: fontColor },
      },
    },
    tooltip: {
      theme: colorMode === 'dark' ? 'dark' : 'light',
      y: {
        formatter: function (val) {
          // return kFormatter(val);
          return thousandsFormatter(val);
        },
      },
    },
    fill: {
      opacity: 1,
    },
    legend: {
      position: 'top',

      labels: {
        colors: fontColor,
      },
    },
  };

  return (
    <Chart
      options={options}
      series={series}
      type="bar"
      width={1200}
      height={400}
    />
  );
}

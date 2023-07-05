import { trpcClient } from "@/lib/utils/trpcClient";
import React from "react";

const ReportsTests = () => {
  const { data } = trpcClient.reports.getReportsTest.useQuery();
  return <div>{JSON.stringify(data)}</div>;
};

export default ReportsTests;

import { Text } from "@chakra-ui/react";
import { format } from "date-fns";
import React from "react";

const DateCell = ({ date, hideHours }: { date: Date; hideHours?: boolean }) => {
  return (
    <Text fontSize="md" fontWeight="bold" pb=".5rem">
      {format(date, hideHours ? "dd/MM/yy" : "dd/MM/yy hh:mm")}
    </Text>
  );
};

export default DateCell;

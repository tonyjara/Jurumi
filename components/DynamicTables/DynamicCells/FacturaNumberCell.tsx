import React from "react";
import { Text } from "@chakra-ui/react";
import { formatedFacturaNumber } from "@/lib/utils/FacturaUtils";

const FacturaNumberCell = ({
  text,
  hover,
  shortenString,
}: {
  text: string;
  hover?: string | React.ReactNode;
  shortenString?: boolean;
}) => {
  {
    /* <Tooltip label={hover}> */
  }
  return (
    <Text
      style={
        shortenString
          ? {
              textOverflow: "ellipsis",
              width: "100px",
              whiteSpace: "nowrap",
              overflow: "hidden",
            }
          : { whiteSpace: "nowrap" }
      }
      fontSize="sm"
      fontWeight="bold"
    >
      {formatedFacturaNumber(text)}
    </Text>
  );
};

export default FacturaNumberCell;

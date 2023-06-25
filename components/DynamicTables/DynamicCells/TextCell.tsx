import React from "react";
import { Text } from "@chakra-ui/react";

const TextCell = ({
  text,
  hover,
  shortenString,
}: {
  text?: string;
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
          : {}
      }
      fontSize="sm"
      fontWeight="bold"
    >
      {text}
    </Text>
  );
};

export default TextCell;

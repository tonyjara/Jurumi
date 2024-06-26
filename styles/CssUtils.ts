import type { Interpolation } from "@emotion/react";

export const customScrollbar: Interpolation<any> = {
  "&::-webkit-scrollbar": {
    width: "4px",
    height: "10px",
  },
  "&::-webkit-scrollbar-track": {
    width: "6px",
  },
  "&::-webkit-scrollbar-thumb": {
    background: "#008080",
    borderRadius: "24px",
  },
};

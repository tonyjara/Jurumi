import React from "react";
import type { HTMLProps } from "react";

export default function IndeterminateCheckbox({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === "boolean") {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
    //@ts-ignore
  }, [ref, indeterminate]);

  return (
    <input
      onClick={(e) => {
        e.stopPropagation();
      }}
      type="checkbox"
      ref={ref}
      style={{ cursor: "pointer", height: "20px", width: "20px" }}
      {...rest}
    />
  );
}

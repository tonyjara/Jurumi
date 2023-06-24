import { handleUseMutationAlerts } from "@/components/Toasts & Alerts/MyToast";
import { trpcClient } from "@/lib/utils/trpcClient";
import { CalendarIcon } from "@chakra-ui/icons";
import {
  Button,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  useOutsideClick,
} from "@chakra-ui/react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import React, { useRef, useState } from "react";
import { DayPicker } from "react-day-picker";

import "react-day-picker/dist/style.css";

const MoneyRequestOperationDateChangeCell = ({
  date,
  id,
}: {
  date: Date | null;
  id: string;
}) => {
  const context = trpcClient.useContext();
  const [selectedDate, setSelectedDate] = useState<Date>(date ?? new Date());
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useOutsideClick({
    ref: ref,
    handler: () => {
      open && setOpen(false);
    },
  });

  const { mutate, isLoading } =
    trpcClient.moneyRequest.changeOperationDate.useMutation(
      handleUseMutationAlerts({
        successText: "La fecha de operación se ha cambiado exitosamente",
        callback: () => {
          setOpen(false);
          context.invalidate();
        },
      })
    );

  const handleSaveDate = () => {
    mutate({ id, date: selectedDate });
  };

  return (
    <div onClick={(e) => e.stopPropagation()}>
      <Popover isOpen={open}>
        <PopoverTrigger>
          <Button
            size="sm"
            isDisabled={isLoading}
            onClick={() => setOpen(true)}
            rightIcon={<CalendarIcon />}
          >
            {date ? format(date, "dd/MM/yy") : "-"}
          </Button>
        </PopoverTrigger>

        <PopoverContent ref={ref}>
          <DayPicker
            mode="single"
            defaultMonth={selectedDate}
            selected={selectedDate}
            onSelect={(e: Date | undefined) => {
              setSelectedDate(e ? e : new Date());
            }}
            locale={es}
          />
          <Flex justifyContent={"space-between"} p="10px">
            <Button
              isDisabled={isLoading}
              variant={"ghost"}
              onClick={() => setOpen(false)}
            >
              Cerrar
            </Button>
            <Button isDisabled={isLoading} onClick={handleSaveDate}>
              Guardar
            </Button>
          </Flex>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default MoneyRequestOperationDateChangeCell;

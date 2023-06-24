import React, { useRef, useState } from "react";
import { ColumnFilterProps } from "../ColumnFilter";
import {
  Button,
  Flex,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Portal,
  useOutsideClick,
} from "@chakra-ui/react";
import { Prisma } from "@prisma/client";
import { CalendarIcon, CloseIcon } from "@chakra-ui/icons";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { DayPicker } from "react-day-picker";

const FromToDateColumnFilter = ({
  setWhereFilterList,
  whereFilterList,
}: ColumnFilterProps) => {
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);
  const ref = useRef(null);
  useOutsideClick({
    ref: ref,
    handler: () => {
      fromOpen && setFromOpen(false);
      toOpen && setToOpen(false);
    },
  });
  const whereBuilder = (from: Date | null, to: Date | null) =>
    Prisma.validator<Prisma.MoneyRequestScalarWhereInput>()({
      createdAt: { gte: from ?? undefined, lte: to ?? undefined },
    });

  const filterListValue = whereFilterList.filter((x) => x.createdAt)[0];
  const from = filterListValue?.createdAt.gte;
  const to = filterListValue?.createdAt.lte;
  const clearPreviouseValues = () => {
    if (!setWhereFilterList) return;
    setWhereFilterList((prev) => prev.filter((x) => !x.createdAt));
  };

  return (
    <Flex onClick={(e) => e.stopPropagation()}>
      <Popover isOpen={fromOpen}>
        <PopoverTrigger>
          <Button
            size={"sm"}
            onClick={() => setFromOpen(!fromOpen)}
            rightIcon={
              from ? (
                <CloseIcon
                  _hover={{ color: "red.500" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const prevToDate = filterListValue?.createdAt.lte;

                    clearPreviouseValues();

                    setWhereFilterList &&
                      setWhereFilterList((prev) => [
                        ...prev,
                        whereBuilder(null, prevToDate ?? null),
                      ]);
                  }}
                />
              ) : (
                <CalendarIcon />
              )
            }
          >
            Del: {from ? format(from, "dd/MM/yy") : "__/__/__"}
          </Button>
        </PopoverTrigger>

        {/* FROM */}
        <Portal>
          <PopoverContent ref={ref}>
            <DayPicker
              mode="single"
              defaultMonth={from ?? new Date()}
              selected={from ?? new Date()}
              disabled={to ? [{ after: to }] : undefined}
              onDayClick={(e: Date | undefined) => {
                e?.setHours(0, 0, 0, 0);

                const filterListValue = whereFilterList.filter(
                  (x) => x.createdAt
                )[0];
                const prevToDate = filterListValue?.createdAt.lte;

                clearPreviouseValues();

                setWhereFilterList &&
                  setWhereFilterList((prev) => [
                    ...prev,
                    whereBuilder(e ?? null, prevToDate ?? null),
                  ]);

                setFromOpen(false);
              }}
              locale={es}
            />
            <Button variant={"ghost"} onClick={() => setFromOpen(false)}>
              Cerrar
            </Button>
          </PopoverContent>
        </Portal>
      </Popover>
      <Popover isOpen={toOpen}>
        <PopoverTrigger>
          <Button
            size={"sm"}
            onClick={() => setToOpen(true)}
            rightIcon={
              to ? (
                <CloseIcon
                  _hover={{ color: "red.500" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    const filterListValue = whereFilterList.filter(
                      (x) => x.createdAt
                    )[0];
                    const prevFromDate = filterListValue?.createdAt.gte;

                    clearPreviouseValues();

                    setWhereFilterList &&
                      setWhereFilterList((prev) => [
                        ...prev,
                        whereBuilder(prevFromDate ?? null, null),
                      ]);
                  }}
                />
              ) : (
                <CalendarIcon />
              )
            }
          >
            Al: {to ? format(to, "dd/MM/yy") : "__/__/__"}
          </Button>
        </PopoverTrigger>

        {/* TO */}
        <Portal>
          <PopoverContent>
            <DayPicker
              mode="single"
              defaultMonth={to ?? new Date()}
              selected={to ?? new Date()}
              onDayClick={(e: Date | undefined) => {
                e?.setHours(23, 59, 59, 59);

                const filterListValue = whereFilterList.filter(
                  (x) => x.createdAt
                )[0];
                const prevFromDate = filterListValue?.createdAt.gte;

                clearPreviouseValues();

                setWhereFilterList &&
                  setWhereFilterList((prev) => [
                    ...prev,
                    whereBuilder(prevFromDate ?? null, e ?? null),
                  ]);

                setToOpen(false);
              }}
              locale={es}
              disabled={from ? [{ before: from }] : undefined}
            />
            <Button variant={"ghost"} onClick={() => setToOpen(false)}>
              Cerrar
            </Button>
          </PopoverContent>
        </Portal>
      </Popover>
    </Flex>
  );
};

export default FromToDateColumnFilter;

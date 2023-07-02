import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
    HStack,
    IconButton,
    VStack,
    Text,
    Button,
    useColorModeValue,
    CircularProgress,
    CircularProgressLabel,
    Flex,
    Box,
} from "@chakra-ui/react";
import type { Currency, MoneyRequest, Transaction } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect } from "react";
import type { FieldValues, Control, UseFormSetValue } from "react-hook-form";
import { useFieldArray } from "react-hook-form";
import { useWatch } from "react-hook-form";
import { currencyOptions } from "@/lib/utils/SelectOptions";
import {
    reduceTransactionAmountsToSetCurrency,
    reduceTransactionFieldsToSetCurrency,
} from "@/lib/utils/TransactionUtils";
import { translateCurrencyPrefix } from "@/lib/utils/TranslatedEnums";
import { trpcClient } from "@/lib/utils/trpcClient";
import type {
    FormTransactionCreate,
    TransactionField,
} from "@/lib/validations/transaction.create.validate";
import FormControlledImageUpload from "../FormControlled/FormControlledImageUpload";
import FormControlledMoneyInput from "../FormControlled/FormControlledMoneyInput";

import FormControlledRadioButtons from "../FormControlled/FormControlledRadioButtons";
import FormControlledSelect from "../FormControlled/FormControlledSelect";
import FormControlledNumberInput from "../FormControlled/FormControlledNumberInput";

interface formProps<T extends FieldValues> {
    control: Control<T>;
    errors: any;
    moneyRequest: MoneyRequest & {
        transactions: Transaction[]; // only transactionAmount is selected
    };
    setValue: UseFormSetValue<T>;
    moneyAccOptions: (currency: Currency) =>
        | {
            value: string;
            label: string;
        }[]
        | undefined;
}

const TransactionForm = ({
    control,
    errors,
    setValue,
    moneyAccOptions,
    moneyRequest,
}: formProps<FormTransactionCreate>) => {
    const user = useSession().data?.user;
    const { fields, prepend, remove, update } = useFieldArray({
        control,
        name: "transactions",
    });

    const { data: projects } = trpcClient.project.getMany.useQuery();
    const { data: myOrg } = trpcClient.org.getCurrent.useQuery();

    const projectId = useWatch({ control, name: "projectId" });
    const transactions = useWatch({ control, name: "transactions" });

    const { data: costCats } = trpcClient.project.getCostCatsForProject.useQuery(
        { projectId: projectId ?? "" },
        { enabled: !!projectId?.length }
    );
    const projectOptions = projects?.map((proj) => ({
        value: proj.id,
        label: `${proj.displayName}`,
    }));

    const costCatOptions = () =>
        costCats?.map((cat) => ({
            value: cat.id,
            label: `${cat.displayName}`,
        }));

    const defaultTransaction: TransactionField = {
        currency: "PYG",
        transactionAmount: new Prisma.Decimal(0),
        moneyAccountId: "",
        exchangeRate: myOrg?.dolarToGuaraniExchangeRate ?? 0,
        wasConvertedToOtherCurrency: false,
    };

    const containerBorder = useColorModeValue("gray.100", "white");

    const previousAmountExecuted = reduceTransactionAmountsToSetCurrency({
        transactions: moneyRequest.transactions,
        currency: moneyRequest.currency,
    });
    const currentAmountExecuted = reduceTransactionFieldsToSetCurrency(
        transactions,
        moneyRequest.currency
    );

    const totalExeCuted = previousAmountExecuted.add(currentAmountExecuted);

    const totalAmountRequested = moneyRequest.amountRequested;

    const percentage = () => {
        return totalAmountRequested
            ? totalExeCuted
                .dividedBy(totalAmountRequested)
                .times(100)
                .toFixed(0)
                .toString()
            : "0";
    };



    return (
        <>
            <FormControlledSelect
                control={control}
                errors={errors}
                name="projectId"
                label="Seleccione un proyecto"
                options={projectOptions ?? []}
                isClearable
            />

            {moneyRequest.moneyRequestType !== "FUND_REQUEST" &&
                costCatOptions()?.length && (
                    <FormControlledSelect
                        control={control}
                        errors={errors}
                        name={"costCategoryId"}
                        label="Linea presupuestaria"
                        options={costCatOptions() ?? []}
                        isClearable
                    />
                )}

            <HStack mt={"20px"} justifyContent={"space-between"}>
                <CircularProgress value={parseInt(percentage())} color="green.400">
                    <CircularProgressLabel>{percentage()}%</CircularProgressLabel>
                </CircularProgress>
                <Button
                    onClick={() => prepend(defaultTransaction)}
                    aria-label="add"
                    rightIcon={<AddIcon />}
                >
                    Agregar otra extracción
                </Button>
            </HStack>

            <Box my={"20px"}>
                {user && (
                    <FormControlledImageUpload
                        control={control}
                        errors={errors}
                        urlName="searchableImage.url"
                        idName="searchableImage.imageName"
                        label="Comprobante del desembolso"
                        setValue={setValue}
                        helperText="Favor tener en cuenta la orientación y legibilidad del documento."
                        userId={user.id}
                    />
                )}
            </Box>
            {fields.map((x, index) => {
                const currency = x.currency;
                const exchangeRate = transactions[index]?.exchangeRate; //Needs to be the current state
                const wasConvertedToOtherCurrency = x.wasConvertedToOtherCurrency;
                const resetAccountSelectValues = (e: any) => {
                    update(index, {
                        moneyAccountId: "",
                        currency: e,
                        transactionAmount: new Prisma.Decimal(0),
                        exchangeRate: myOrg?.dolarToGuaraniExchangeRate ?? 0,
                        wasConvertedToOtherCurrency: e !== moneyRequest.currency,
                    });
                };
                const amountToMax = () => {
                    if (currency !== moneyRequest.currency) {
                        if (currency === "USD") {
                            return totalAmountRequested
                                .sub(totalExeCuted)
                                .dividedBy(exchangeRate ?? 0);
                        }
                        if (currency === "PYG") {
                            return totalAmountRequested
                                .sub(totalExeCuted)
                                .times(exchangeRate ?? 0);
                        }
                    }
                    return totalAmountRequested.sub(totalExeCuted);
                };

                return (
                    <VStack
                        borderColor={containerBorder}
                        borderWidth={"3px"}
                        borderRadius="8px"
                        p={"10px"}
                        my="10px"
                        key={x.id}
                        spacing={5}
                    >
                        <Flex w={"100%"} justifyContent={"space-between"}>
                            <Text fontWeight={"bold"} fontSize={"lg"} alignSelf={"start"}>
                                Extracción {index + 1}
                            </Text>
                            <IconButton
                                isDisabled={transactions.length < 2}
                                onClick={() => remove(index)}
                                aria-label="remove"
                                icon={<DeleteIcon />}
                            />
                        </Flex>
                        <FormControlledRadioButtons
                            control={control}
                            errors={errors}
                            name={`transactions.${index}.currency`}
                            label="Moneda"
                            options={currencyOptions}
                            onChangeMw={resetAccountSelectValues}
                        />

                        {wasConvertedToOtherCurrency && (
                            <FormControlledNumberInput
                                control={control}
                                errors={errors}
                                name={`transactions.${index}.exchangeRate`}
                                label="Tasa de cambio"
                                helperText={"Un dolar equivale X guaranies"}
                            />
                        )}
                        <FormControlledMoneyInput
                            control={control}
                            errors={errors}
                            name={`transactions.${index}.transactionAmount`}
                            label="Monto"
                            prefix={translateCurrencyPrefix(currency)}
                            currency={currency}
                            totalAmount={amountToMax()}
                        />
                        <FormControlledSelect
                            control={control}
                            errors={errors}
                            name={`transactions.${index}.moneyAccountId`}
                            label="Seleccione un medio de extracción"
                            options={moneyAccOptions(currency) ?? []}
                            isClearable={true}
                            error={
                                (errors.transactions &&
                                    errors.transactions[index]?.moneyAccountId?.message) ??
                                ""
                            }
                        />
                    </VStack>
                );
            })}
        </>
    );
};

export default TransactionForm;

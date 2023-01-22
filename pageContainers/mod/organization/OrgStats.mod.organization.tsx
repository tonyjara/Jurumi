import BigStat from '@/components/Stats/BigStat';
import SmallStat from '@/components/Stats/SmallStat';
import { reduceCostCatAsignedAmount } from '@/lib/utils/CostCatUtilts';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import { StatGroup, Box, useColorModeValue } from '@chakra-ui/react';
import type { Currency } from '@prisma/client';
import { Prisma } from '@prisma/client';
import React from 'react';
import type { OrgForDashboard } from './OrganizationPage.mod.organization';

const OrganizationStats = ({ org }: { org: OrgForDashboard | undefined }) => {
  const labelColor = useColorModeValue('gray.600', 'gray.300');

  const accountTotal = (currency: Currency) => {
    return (
      org?.moneyAccounts.reduce((acc, value) => {
        if (value.currency === currency) {
          return value.transactions[0]
            ? acc.add(value.transactions[0]?.currentBalance)
            : value.initialBalance;
        }
        return acc;
      }, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0)
    );
  };

  const assignedInProjects = (currency: Currency) => {
    return (
      org?.projects.reduce((acc, value) => {
        if (value.costCategories.length) {
          return acc.add(
            reduceCostCatAsignedAmount({
              costCats: value.costCategories,
              currency,
            })
          );
        }

        return acc;
      }, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0)
    );
  };
  const imbursedTotal = (currency: Currency) => {
    return (
      org?.projects.reduce((acc, value) => {
        const imbursementsTotals = value.imbursements.reduce((acc2, value2) => {
          if (value2.transactions[0]?.currency === currency) {
            return acc2.add(value2.transactions[0].currentBalance);
          }
          return acc2;
        }, new Prisma.Decimal(0));

        return acc.add(imbursementsTotals);
      }, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0)
    );
  };
  const executedInProjectsTotal = (currency: Currency) => {
    return (
      org?.projects.reduce((acc, value) => {
        const costCatTotals = value.costCategories.reduce((acc2, value2) => {
          if (value2.transactions[0]?.currency === currency) {
            return acc2.add(value2.transactions[0].currentBalance);
          }
          return acc2;
        }, new Prisma.Decimal(0));

        return acc.add(costCatTotals);
      }, new Prisma.Decimal(0)) ?? new Prisma.Decimal(0)
    );
  };

  // Imbursed amount is already in account's total. So the assigned total minus executed total, leaves what should be substracted from the accounts to find how much is left free.
  const FreeMoney = (currency: Currency) =>
    accountTotal(currency).sub(
      assignedInProjects(currency).sub(executedInProjectsTotal(currency))
    );

  return (
    <Box>
      <StatGroup mb={'20px'}>
        <BigStat
          label="Cuentas en Gs."
          value={decimalFormat(accountTotal('PYG'), 'PYG')}
        />
        <BigStat
          label="Cuentas en Usd."
          value={decimalFormat(accountTotal('USD'), 'USD')}
        />
      </StatGroup>

      <StatGroup mb={'20px'} gap={5}>
        <SmallStat
          color="teal"
          label="Asignado Proyectos en Gs"
          value={decimalFormat(assignedInProjects('PYG'), 'PYG')}
        />
        <SmallStat
          color="teal"
          label="Asignado Proyectos en Usd"
          value={decimalFormat(assignedInProjects('USD'), 'USD')}
        />
      </StatGroup>
      <StatGroup mb={'20px'} gap={5}>
        <SmallStat
          color="green"
          label="Desembolsado en Gs"
          value={decimalFormat(imbursedTotal('PYG'), 'PYG')}
        />
        <SmallStat
          color="green"
          label="Desembolsado en Usd"
          value={decimalFormat(imbursedTotal('USD'), 'USD')}
        />
      </StatGroup>
      <StatGroup mb={'20px'} gap={5}>
        <SmallStat
          color="orange"
          label="Ejecutado en Proyectos en Gs"
          value={decimalFormat(executedInProjectsTotal('PYG'), 'PYG')}
        />
        <SmallStat
          color="orange"
          label="Ejecutado en Proyectos en Usd"
          value={decimalFormat(executedInProjectsTotal('USD'), 'USD')}
        />
      </StatGroup>
      <StatGroup mb={'20px'}>
        <BigStat
          label="Libre en Gs."
          value={decimalFormat(FreeMoney('PYG'), 'PYG')}
        />
        <BigStat
          label="Libre en Usd."
          value={decimalFormat(FreeMoney('USD'), 'USD')}
        />
      </StatGroup>
    </Box>
  );
};

export default OrganizationStats;

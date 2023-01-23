import PercentageCell from '@/components/DynamicTables/DynamicCells/PercentageCell';
import SmallStat from '@/components/Stats/SmallStat';
import { decimalFormat } from '@/lib/utils/DecimalHelpers';
import {
  Box,
  Divider,
  Flex,
  IconButton,
  ScaleFade,
  StatGroup,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Prisma } from '@prisma/client';
import React from 'react';
import { BiShow, BiHide } from 'react-icons/bi';
import type { ProjectComplete } from '../ProjectsPage.mod.projects';

const CostCategoryStats = ({
  project,
}: {
  project: ProjectComplete | undefined;
}) => {
  const { isOpen, onToggle } = useDisclosure({ defaultIsOpen: true });
  return (
    <Box mt={'10px'}>
      <Flex alignItems={'center'} gap={5}>
        <Text fontSize={'xl'}>Lineas Presupuestarias</Text>
        <IconButton
          aria-label="close drawer"
          onClick={onToggle}
          colorScheme="teal"
          icon={
            isOpen ? (
              <BiHide style={{ fontSize: '25px' }} />
            ) : (
              <BiShow style={{ fontSize: '25px' }} />
            )
          }
          variant="ghost"
        />
      </Flex>
      <ScaleFade initialScale={0.9} in={isOpen}>
        {isOpen && (
          <Box>
            {project?.costCategories.map((costCat) => {
              const executedAmount = costCat.transactions[0]
                ? costCat.transactions[0].currentBalance
                : new Prisma.Decimal(0);
              const executedCurrency = costCat.transactions[0]
                ? costCat.transactions[0].currency
                : 'PYG';

              const assignedAmount = costCat.assignedAmount;

              return (
                <Box mb={'10px'} key={costCat.id}>
                  <Text fontSize={'lg'} fontWeight={'bold'} mb={'10px'}>
                    {costCat.displayName}
                  </Text>
                  <StatGroup alignItems={'center'} mb={'10px'} gap={5}>
                    <SmallStat
                      label="Asignado"
                      value={decimalFormat(assignedAmount, costCat.currency)}
                    />

                    <SmallStat
                      color="orange.300"
                      label="Ejecutado."
                      value={decimalFormat(executedAmount, executedCurrency)}
                    />

                    <PercentageCell
                      total={assignedAmount}
                      executed={executedAmount}
                      currency={costCat.currency}
                    />
                  </StatGroup>
                  <Divider />
                </Box>
              );
            })}
          </Box>
        )}
      </ScaleFade>
    </Box>
  );
};

export default CostCategoryStats;

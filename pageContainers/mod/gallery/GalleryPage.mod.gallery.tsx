import TablePagination from '@/components/DynamicTables/TablePagination';
import { useDynamicTable } from '@/components/DynamicTables/UseDynamicTable';
import ImageEnlargeModal from '@/components/Modals/imageEnlarge.modal';
import { trpcClient } from '@/lib/utils/trpcClient';
import {
  Box,
  Card,
  CardBody,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  useDisclosure,
} from '@chakra-ui/react';
import type { Currency, Prisma } from '@prisma/client';
import React, { useState } from 'react';

const GalleryPage = () => {
  const [clickedImage, setClickedImage] = useState<{
    imageName: string;
    url: string;
    text: string;
    facturaNumber: string;
    amount: Prisma.Decimal;
    currency: Currency;
  } | null>(null);
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setPageIndex, setPageSize, pageSize } = dynamicTableProps;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data } = trpcClient.gallery.getManyImages.useQuery({
    pageIndex,
    pageSize,
  });

  const { data: count } = trpcClient.gallery.count.useQuery();

  return (
    <Card overflow={'auto'}>
      <CardBody>
        <InputGroup mb={'10px'}>
          <Input maxW={'300px'} placeholder="Buscar por texto" />
        </InputGroup>
        <SimpleGrid w="80vw" columns={8} minChildWidth={'180px'} spacing={6}>
          {data?.map((x) => (
            <Box
              cursor="pointer"
              onClick={() => {
                setClickedImage({
                  imageName: x.imageName,
                  url: x.url,
                  text: x.text,
                  facturaNumber: x.facturaNumber,
                  amount: x.amount,
                  currency: x.currency,
                });
                onOpen();
              }}
              key={x.id}
              h="150px"
            >
              <Image
                position="relative"
                height="150px"
                width="150px"
                alt="Image from server"
                src={x.url}
              />
            </Box>
          ))}
        </SimpleGrid>
        <TablePagination
          pageIndex={pageIndex}
          setPageIndex={setPageIndex}
          pageSize={pageSize}
          setPageSize={setPageSize}
          count={count ?? 0}
          data={data}
        />
      </CardBody>
      {clickedImage && (
        <ImageEnlargeModal
          isOpen={isOpen}
          onClose={onClose}
          {...clickedImage}
        />
      )}
    </Card>
  );
};

export default GalleryPage;

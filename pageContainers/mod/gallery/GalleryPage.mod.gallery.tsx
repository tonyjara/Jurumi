import TablePagination from "@/components/DynamicTables/TablePagination";
import { useDynamicTable } from "@/components/DynamicTables/UseDynamicTable";
import ImageEnlargeModal from "@/components/Modals/imageEnlarge.modal";
import { trpcClient } from "@/lib/utils/trpcClient";
import {
  Box,
  Card,
  CardBody,
  Image,
  Input,
  InputGroup,
  SimpleGrid,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import type { searchableImage } from "@prisma/client";
import { format } from "date-fns";
import React, { useState } from "react";

const GalleryPage = () => {
  const [clickedImage, setClickedImage] = useState<searchableImage | null>(
    null
  );
  const dynamicTableProps = useDynamicTable();
  const { pageIndex, setPageIndex, setPageSize, pageSize } = dynamicTableProps;
  const { isOpen, onClose, onOpen } = useDisclosure();
  const { data } = trpcClient.gallery.getManyImages.useQuery({
    pageIndex,
    pageSize,
  });
  data?.map((x) => {
    x.accountId;
  });

  const { data: count } = trpcClient.gallery.count.useQuery();

  return (
    <Card overflow={"auto"}>
      <CardBody>
        <InputGroup mb={"10px"}>
          <Input maxW={"300px"} placeholder="Buscar por texto" />
        </InputGroup>
        <SimpleGrid w="80vw" columns={8} minChildWidth={"180px"} spacing={6}>
          {data?.map((x, i) => {
            const imageNumber = i + 1 + pageSize * pageIndex;
            return (
              <Box
                cursor="pointer"
                onClick={() => {
                  setClickedImage(x);
                  onOpen();
                }}
                key={x.id}
                h="170px"
              >
                <Text>
                  <span style={{ fontWeight: "bold" }}>{imageNumber}</span>{" "}
                  {format(x.createdAt, "dd/MM/yy hh:mm")}
                </Text>
                <Image
                  position="relative"
                  height="150px"
                  width="150px"
                  alt="Image from server"
                  src={x.url}
                />
              </Box>
            );
          })}
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
          searchableImage={clickedImage}
        />
      )}
    </Card>
  );
};

export default GalleryPage;

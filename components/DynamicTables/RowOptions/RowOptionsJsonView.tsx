import {
  useDisclosure,
  MenuItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";
import dynamic from "next/dynamic";
const JsonView = dynamic(() => import("react-json-view"), { ssr: false });

interface props {
  x: any;
}

export function RowOptionsJsonView({ x }: props) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isAdmin = useSession().data?.user.role === "ADMIN";

  return (
    <div style={{ display: isAdmin ? "block" : "none" }}>
      <MenuItem onClick={onOpen}>Visualizar</MenuItem>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{x?.id ?? ""}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <JsonView src={x} theme="monokai" />
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}

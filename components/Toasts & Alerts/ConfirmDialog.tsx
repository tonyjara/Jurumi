import {
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  MenuItem,
} from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import React from "react";

interface props {
  onConfirm: () => void;
  dialogTitle: string;
  dialogText: string;
  isOpen: boolean;
  onClose: () => void;
}

export function ConfirmDialog({
  onConfirm,
  dialogTitle,
  dialogText,
  onClose,
  isOpen,
}: props) {
  const cancelRef = React.useRef(null);

  const handleDelete = () => {
    onConfirm();
    onClose();
  };

  return (
    <>
      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              {dialogTitle}
            </AlertDialogHeader>

            <AlertDialogBody>{dialogText}</AlertDialogBody>

            <AlertDialogFooter>
              <Button onClick={handleDelete} mr={3}>
                Confirmar
              </Button>
              <Button ref={cancelRef} onClick={onClose}>
                Cerrar
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
}

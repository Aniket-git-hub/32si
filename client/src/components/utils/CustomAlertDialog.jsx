import { AlertDialog, AlertDialogBody, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogOverlay, Button, useDisclosure } from "@chakra-ui/react";
import React, { useRef } from "react";

function CustomAlertDialog({ title, trigger, children, footer }) {
      const { isOpen, onOpen, onClose } = useDisclosure();
      const cancelRef = useRef();

      return (
            <>
                  {trigger(onOpen)}
                  <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
                        <AlertDialogOverlay>
                              <AlertDialogContent>
                                    <AlertDialogHeader fontSize="lg" fontWeight="bold">
                                          {title}
                                    </AlertDialogHeader>

                                    <AlertDialogBody>
                                          {children}
                                    </AlertDialogBody>

                                    <AlertDialogFooter>
                                          {footer ? footer(onClose) : <Button ref={cancelRef} onClick={onClose}>Close</Button>}
                                    </AlertDialogFooter>
                              </AlertDialogContent>
                        </AlertDialogOverlay>
                  </AlertDialog>
            </>
      );
}

export default CustomAlertDialog;
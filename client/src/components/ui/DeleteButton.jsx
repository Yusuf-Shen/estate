import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
    useToast,
  } from '@chakra-ui/react'
  import React from 'react'
  


export default function DeleteButton({listingId,onConfirmDelete}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    const toast = useToast();
    
    
    const handlerDeleteListing = async (listingId) => {
      try {
        const res = await fetch(`/api/listing/delete/${listingId}`,{
          method:'DELETE',
        });
        const data = await res.json();
        if(data.success === false){
          console.log(data.message);
          return;
        }
        if(data.success === false){
          console.log("delete error");
          return;
        }
        onConfirmDelete(listingId); 
        onClose();
        toast({
          title:  'Your Listing Has Been Deleted',
          status: 'success',
          duration: 2000,
          position:'bottom',
          isClosable: true,
        })
        console.log("delete success");
      } catch (error) {
        console.log(error);
      }
    }

    return (
      <>
        <Button size='sm' className='rounded-xl text-green-400' colorScheme='red' onClick={onOpen}>
          Delete →
        </Button>
  
        <AlertDialog
          isOpen={isOpen}
          leastDestructiveRef={cancelRef}
          onClose={onClose}
        >
          <AlertDialogOverlay>
            <AlertDialogContent>
              <AlertDialogHeader fontSize='lg' fontWeight='bold'>
                Delete 
              </AlertDialogHeader>
  
              <AlertDialogBody>
                Are you sure? You can't undo this action afterwards.
              </AlertDialogBody>
  
              <AlertDialogFooter>
                <Button ref={cancelRef} onClick={onClose}>
                  Cancel
                </Button>
                <Button colorScheme='red' onClick={()=>handlerDeleteListing(listingId)} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
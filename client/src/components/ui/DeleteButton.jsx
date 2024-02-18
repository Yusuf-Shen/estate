import {
    AlertDialog,
    AlertDialogBody,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogContent,
    AlertDialogOverlay,
    useDisclosure,
    Button,
  } from '@chakra-ui/react'
  import React from 'react'
  
import { useSelector } from 'react-redux'

export default function DeleteButton({imageId}) {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const cancelRef = React.useRef()
    
    const {currentUser} = useSelector(state => state.user);
    const handlerDeleteImage = async () => {
      try {
        const res = await fetch(`/api/listing/delete/${currentUser._id}/${imageId}`,{
          method:'DELETE',
        });
        const data = await res.json();
        if(data.success === false){
          dispatch(deleteUserFailure(data.message));
          return;
        }
        if(data.success === false){
          console.log("delete error");
          return;
        }
        onClose();
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
                <Button colorScheme='red' onClick={handlerDeleteImage} ml={3}>
                  Delete
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialogOverlay>
        </AlertDialog>
      </>
    )
  }
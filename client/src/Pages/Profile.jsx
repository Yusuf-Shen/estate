import { useSelector, useDispatch} from "react-redux"
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import{getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess, singOutStart,singOutSuccess,singOutFailure } from "../redux/user/userSlice";
import { Link } from "react-router-dom";
import { CardBody,CardContainer,CardItem } from "../components/ui/3d-card.tsx";
import { Button } from "@chakra-ui/react";

// this is component of button which need import

import React from 'react'
import DeleteButton from "../components/ui/DeleteButton.jsx";

export default function Profile() {
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const {currentUser, loading, error} = useSelector(state => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [showListingError, setListingError] = useState(false); // show listing error
  const [userListings,setUserListings] = useState([]); // user listings
  const dispatch =  useDispatch();
 
  console.log(formData);
  

  
  
  
//   // Craft rules based on data in your Firestore database
// // allow write: if firestore.get(
// //    /databases/(default)/documents/users/$(request.auth.uid)).data.isAdmin;
// service firebase.storage {
//   match /b/{bucket}/o {
//     match /{allPaths=**} {
//       allow read;
//       allow write: if 
//       request.resource.size < 2 * 1024 * 1024 &&
//       request.resource.contentType.matches('image/.*')
//     }
//   }
// }s
  useEffect(() => {
    if(file){
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app);
    const fileName =  new Date().getTime() + file.name;
    const storageRef = ref (storage,fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred/ snapshot.totalBytes) * 100;
        
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadError(true);
        console.log(fileUploadError);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then
        ((downloadURL) => 
          setFormData({...formData, avatar: downloadURL})
        );
      }
    );
  };

  //this  set the updated information inside a form.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })
  };

  // This is update function frontend
  const handleSumbit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`,{
        method: 'POST',
        headers:{
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if(data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error.message));
    }
  }

  //this is the delete function:
  const handleDelete = async () => {
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`,{
        method:'DELETE',
      });
      const data = await res.json();
      if(data.success === false){
        dispatch(deleteUserFailure(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error.message));
    }
  }

  // This is the function of sign-out user:
  const handleSignOut = async () => {
    try {
      dispatch(singOutStart());
      const res = await fetch('/api/auth/signOut');
      const data = await res.json(); // Dont forget await .
      if(data.success === false) {
        dispatch(singOutFailure(data.message));
        return;
      }
      dispatch(singOutSuccess(data));
    } catch (error) {
      dispatch(singOutFailure(error.message));
    }
  }

  //This is show listings function
  const handleShowListings = async () =>{
    setListingError(false);
    try {
      const res  =  await fetch(`/api/user/listings/${currentUser._id}`); // attention the id i s_id
      const data = await res.json();
      if(data.success === false){
        setListingError(true);
        return;
      }
      setUserListings(data);
      console.log(data);
    } catch (error) {
      setListingError(true);
    }
  }



  

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      {/* <MdEdit onClick={()=> fileRef.current.click() }  ref= {fileRef} className="cursor-pointer absolute sm: ml-72 mt-20" /> */}
      <form onSubmit={handleSumbit} className="flex flex-col gap-4 ">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=> fileRef.current.click() } 
        src= { currentUser.avatar || formData.avatar}  alt="avatar" 
        className="rounded-full h-24 w-24 object-cover self-center my-2 cursor-pointer"/> 
        <p className="text-sm text-center">
          {fileUploadError ? (
            <span className="text-red-700" >Error Image 
            Upload(image size must less than 2mb)</span> 
          ) :filePerc > 0 && filePerc < 100 ?(
            <span className="text-slate-700">{`Uploading ${filePerc}%`
            }</span>
          ) : filePerc === 100 ?(
            <span className="text-green-700">Image 
            Successfully Uploaded</span>
          ) :(
            ''
          )}
        </p>
        <input  onChange={handleChange} defaultValue={currentUser.username}  placeholder='userName' type='text' className='border rounded-lg p-3'id="username"/>
        <input onChange={handleChange} defaultValue={currentUser.email} placeholder='Email' type='text' className=' border rounded-lg p-3'id="email"/>
        <input  placeholder='password' type='text' className=' border rounded-lg p-3'id="passord"/>
        <button disabled={loading} className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">
          {loading ? 'Updating...' : 'update'}
        </button>
        <Link className="bg-green-600 text-white rounded-lg p-3 uppercase hover:opacity-95 text-center" to={"/create-listing"}>
          Create Listing
        </Link>
      
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-green-700">
        {updateSuccess ? 'User is Updated Successfully!' : ''}
      </p>
      <button onClick={handleShowListings} className="text-green-500 w-full ">
        Show Listings
      </button>
      <p className="text-red-600"> {showListingError?"Error show listings": ''}</p>
            
      {/* These are  listing cards. */}
      
        {userListings&& userListings.length> 0 
          && 
          <div className="mx-auto">
            <h1 className="text-center my-16 text-2xl font-semibold">Your Listings</h1>
            {userListings.map((listing,index) => (
              <div key={listing._id} className="mx-auto">
                <CardContainer className="inter-var w-auto">
                  <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl
                  dark:hover:shadow-emerald-500/[0.1] dark:bg-black
                    dark:border-white/[0.2] border-black/[0.1] 
                    w-auto sm:w-[30rem] h-auto rounded-xl p-6 border "
                  >
                    <CardItem
                      translateZ="50"
                      className="text-xl font-bold text-neutral-600 dark:text-white"
                    >
                      {listing.name}
                    </CardItem>
                    <CardItem
                      as="p"
                      translateZ="60"
                      className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
                    >
                      {listing.address}
                    </CardItem>
                    <CardItem translateZ="100" className="w-auto mt-3">
                      <img
                        src={listing.imageUrls[0]}
                        height="1000"
                        width="1000"
                        className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                        alt="thumbnail"
                      />
                    </CardItem>
                    <div className="flex justify-between  mt-12">
                      <CardItem
                        translateZ={20}
                        className=" ml-3 py-2  text-xs font-normal dark:text-white"
                      > 
                        <DeleteButton listingId={`${listing._id}`} 
                        onConfirmDelete={(deletedId) => 
                        setUserListings(currentListings => 
                        currentListings.filter(listing => listing._id !== deletedId))}/>
                      </CardItem>
                      
                      <CardItem
                        translateZ={20}
                        
                        className="px-4 py-2 rounded-xl text-white text-xs font-bold"
                      >
                        <Link to={`/update-listing/${listing._id}`}>
                          <Button colorScheme='blue' className="p-4" size='sm'>Edit →</Button> 
                        </Link>
                      </CardItem>
                    </div>
                  </CardBody>
                </CardContainer>
              </div>
            ))}
          </div>
        }
       
      
    </div>
    
  )
}

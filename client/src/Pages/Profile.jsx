import { useSelector, useDispatch} from "react-redux"
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import{getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import { app } from "../firebase";
import { updateUserStart, updateUserSuccess, updateUserFailure,deleteUserFailure,deleteUserStart,deleteUserSuccess } from "../redux/user/userSlice";
export default function Profile() {
  const fileRef = useRef(null);
  const [file,setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  const {currentUser, loading, error} = useSelector(state => state.user);
  const [updateSuccess, setUpdateSuccess] = useState(false);
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
      </form>
      <div className="flex justify-between mt-5">
        <span onClick={handleDelete} className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
      <p className="text-green-700">{updateSuccess ? 'User is Updated Successfully!' : ''}</p>
    </div>
    
  )
}

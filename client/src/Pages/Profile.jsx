import { useSelector } from "react-redux"
import { MdEdit } from "react-icons/md";
import { useEffect, useRef, useState } from "react";
import{getStorage, uploadBytesResumable, ref, getDownloadURL} from 'firebase/storage'
import { app } from "../firebase";
export default function Profile() {
  const fileRef = useRef(null);
  const {currentUser} = useSelector(state => state.user);
  const [file,setFile] = useState(undefined);
  const [filePerc,setFilePerc] = useState(0);
  const [fileUploadError,setFileUploadError] = useState(false);
  const [formData,setFormData] = useState({});
  console.log(formData);
  console.log(currentUser);
  
  
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
  

  return (
    <div className="p-3 max-w-lg mx-auto ">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      {/* <MdEdit onClick={()=> fileRef.current.click() }  ref= {fileRef} className="cursor-pointer absolute sm: ml-72 mt-20" /> */}
      <form className="flex flex-col gap-4 ">
        <input onChange={(e) => setFile(e.target.files[0])} type="file" ref={fileRef} hidden accept="image/*"/>
        <img onClick={()=> fileRef.current.click() } 
        src= {currentUser.avatar || formData.avatar }  alt="avatar" 
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
        <input placeholder='userName' type='text' className='border rounded-lg p-3'id="username"/>
        <input placeholder='Email' type='text' className=' border rounded-lg p-3'id="email"/>
        <input placeholder='password' type='text' className=' border rounded-lg p-3'id="passord"/>
        <button className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80">update</button>
      </form>
      <div className="flex justify-between mt-5">
        <span className="text-red-700 cursor-pointer">Delete account</span>
        <span className="text-red-700 cursor-pointer">Sign out</span>
      </div>
    </div>
    
  )
}

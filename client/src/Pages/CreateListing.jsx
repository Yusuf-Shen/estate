import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';
import React from 'react'
import { useState } from 'react';
import { app } from '../firebase';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';



export default function CreateListing() {
    const [files, setFiles] = useState([]);
    const [formData,setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'rent',
        typeOfProp:'',
        bedroom:1,
        bathroom:1,
        regularPrice:10,
        offer:false,
        parking:false,
        furnished:false,
        
    });
    const [filePerc,setPercentage] = useState(0);
    const [iLoading,setIloading] = useState(false);
    const [error,setError] = useState(false);
    const [cloading,setCloading] = useState(false);
    const {currentUser} = useSelector(state => state.user);
    //create nevigate
    const navigate = useNavigate();
    console.log(formData);
    const [imageUploadError, setImageUploadError] = useState(false);

    const handleImageUpload = (e) =>{
        if (files.length > 0 && files.length < 12) {
            setIloading(true);
            const promises =[];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));    
            }
            Promise.all(promises).then((url) => {
                setFormData({...formData, imageUrls: formData.imageUrls.concat(url)});
                setIloading(false);
            })
            .catch((error) =>{
                setImageUploadError("The image size not moren than 2MB");
                setIloading(false);
            })
            
        } else {
            setImageUploadError("Upload Error");
            
        }
    }
    // store image into firebase
    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app);
            const fileName = new Date().getTime() + file.name;
            const storageRef = ref(storage,fileName);
            const uploadTask = uploadBytesResumable(storageRef,file);

            uploadTask.on(
                'state_changed',
                (snapshot) =>{
                    const progress = (snapshot.bytesTransferred/snapshot.totalBytes)*100;
                    setPercentage(Math.round(progress));
                    console.log(progress);
                },
                (error) =>{
                    reject(error);
                },
                () =>{
                    getDownloadURL(uploadTask.snapshot.ref).then
                    ((downloadURL) => {
                        resolve(downloadURL);
                    })
                }
            )
        });
    };


    // this is the function that sumbit your information
    const handleChanger = (e) =>{
        if(e.target.id === 'name' || e.target.id === 'description' || e.target.id === 'address') {
            setFormData({
                ...formData,
                [e.target.id]:  e.target.value,
            })
        }
        if(e.target.id === 'sale' || e.target.id === 'rent'){
            setFormData({
                ...formData,
                type: e.target.id,
            })
        }
        // check box
        if(e.target.id === 'parking' || e.target.id === 'furnished' || e.target.id === 'offer') {
            setFormData({
                ...formData,
                [e.target.id]:  e.target.checked,
            })
        }

        // select
        if(e.target.id === 'typeOfProp'){
            setFormData({
                ...formData,
                [e.target.id]:  e.target.value,
            })
        }
        
        //number of rooms
        if(e.target.id === 'bedrooms' || e.target.id === 'bathrooms' ||e.target.id === 'regularPrice' ){
            setFormData({
                ...formData,
                [e.target.id]:  parseInt(e.target.value),
            })
        }
    }
    // Create Listing
    const handleSumbit = async (e) =>{
        e.preventDefault(); 
        try {
            setCloading(true);
            setError(false);  // remove the previous error 
            const res = await fetch('/api/listing/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef:currentUser._id,
                }),
            })
            const data = await res.json();
            if(data.success === false){
                setError(data.message);
                setCloading(false);
                return;
            }
            setCloading(false);
            setError(false);
            navigate(`/listing/${data._id}`);
        } catch (error) {
            setCloading(false);
            setError(error.message);
        }
    }
    // This is Remove Image function 
    // be careful use the filter 
    const handleRemoveImage = (index) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((_,i) => i !== index),
        });
    }
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-8'>Create a Listing</h1>
        <form onSubmit={handleSumbit} className='flex flex-col  sm:flex-row gap-6'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' className='border rounded-lg p-3' 
                    placeholder='Name' id='name' maxLength='62'
                    minLength='3' required 
                    value={formData.name} 
                    onChange={handleChanger} 
                />
                <textarea type='text' className='border rounded-lg p-3' 
                    placeholder='Description' id='description' 
                    required 
                    value={formData.description}
                    onChange={handleChanger} 
                />
                <input type='text' className='border rounded-lg p-3' 
                    placeholder='Address' maxLength='62' 
                    minLength='4' id='address' required 
                    onChange={handleChanger} 
                    value={formData.address}
                />

                {/* this is the tickbox */}
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sale' className='w-5'
                            onChange={handleChanger}
                            checked={formData.type === 'sale'}
                        />
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type='checkbox' id='rent' className='w-5'
                            onChange={handleChanger}
                            checked={formData.type === 'rent'}
                        />
                        <span>Rent</span>
                    </div>
            
                    <div className='flex gap-2'>
                        <input type='checkbox' id='parking' className='w-5'
                            onChange={handleChanger} 
                            checked={formData.parking}
                        />
                        <span>Parking Spot</span>
                    </div>
           
               
                    <div className='flex gap-2'>
                        <input type='checkbox' id='furnished' className='w-5'
                            onChange={handleChanger}
                            checked={formData.furnished}
                        />
                        <span>Furnished</span>
                    </div>
         
               
                    <div className='flex gap-2'>
                        <input type='checkbox' id='offer' className='w-5'
                            onChange={handleChanger}
                            checked={formData.offer}
                        />
                        <span>Offer</span>
                    </div>

                    <div className='flex gap-2' id='typeOfProp'>
                        <select name='typeOfProp' className='form-control border 
                            p-1 w-full rounded-lg' 
                            value={formData.typeOfProp}
                            onChange={handleChanger} 
                            id='typeOfProp'
                        >
                            <option>
                                -Select Type of your Property- 
                            </option>
                            <option>
                                House
                            </option>
                            <option>TownHouse</option>
                            <option>Apartment</option>
                            <option>Land</option>
                        </select>    
                    </div>
                </div>
                {/* This is the function that choose number of  bed  */}
                <div className='flex flex-wrap gap-6 my-2'>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='bedrooms' className='p-3  border 
                        border-gray-300 rounded-lg' min='1' max='10' required
                          
                          onChange={handleChanger}
                        />
                        <p>BedRooms</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='bathrooms' className='p-3 border 
                        border-gray-300 rounded-lg' min='1' max='10' required
                          
                          onChange={handleChanger}
                        />
                        <p>BathRooms</p>
                    </div>
                    <div className='flex  items-center gap-3'>
                        <input type='number' id='regularPrice' className='p-3 w-36 border 
                        border-gray-300 rounded-lg' min='1' max='99999999'  required
                          value={formData.regularPrice} 
                          onChange={handleChanger}
                        />
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                    </div>
                </div>
            </div>
            {/* This is Image uploading UI */}
            <div className='flex flex-col flex-1 gap-3'>
                <p className='font-semibold'>
                    Images:<span className='font-normal text-gray-600 ml-2'>The first image will be the cover </span>
                </p>
                <div className='my-3 flex gap-4'>
                    <input onChange={(e) => setFiles(e.target.files)} className='p-3 border 
                      border-gray-300 rounded w-full' type='file' id='images' 
                        accept='image/*' multiple>
                    </input>
                    <button onClick={handleImageUpload} type='button' disabled={iLoading} 
                    className='uppercase text-green-700 border p-3 rounded-lg 
                    hover:shadow-lg disabled:opacity-80 border-green-600'>
                        {iLoading ? "uploading" : "upload"}
                    </button>   
                </div>
                <p className='text-red-600  text-sm'>{imageUploadError && imageUploadError}</p>
                {
                    // The return is very important , when you use arrow function
                    formData.imageUrls.length > 0 && formData.imageUrls.map((url, index )=> (
                        <div key={url} className='flex border justify-between p-3 items-center'>
                            <img key={url} src={url} className='w-40 h-40 rounded-lg object-cover' 
                            alt='listing image'/> 
                            <button onClick={() => handleRemoveImage(index)} type='button' 
                            className='p-3 hover:opacity-60 rounded-lg border 
                            border-red-500 text-red-600 uppercase'> 
                                Delete
                            </button>
                        </div> 
                    ))
                }
                <button disabled={cloading || iLoading} className='uppercase text-white w-full bg-blue-950 p-3 
                rounded-lg hover:opacity-95 disabled:opacity-80 ' >
                    {cloading? 'Creating....' : 'Create Listing' }
                </button>
                {error && <p className='text-red-600 text-sm'>{error}</p>}
            </div>          
        </form> 
    </main>
  )
}

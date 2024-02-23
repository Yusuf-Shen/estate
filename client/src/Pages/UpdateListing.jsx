
import { getDownloadURL, getStorage, uploadBytesResumable, ref } from 'firebase/storage';

import { useState } from 'react';
import { app } from '../firebase.js';
import { useSelector } from 'react-redux';
import { useNavigate,useParams } from 'react-router-dom';
import { Button, ColorModeContext, color } from '@chakra-ui/react';
import { useToast } from '@chakra-ui/react'; // this is successfull message of creating listing.
import { useEffect } from 'react';

export default function UpdateListing() {
    // get the current url
    const params = useParams();
    const [files, setFiles] = useState([]);
    const [formData,setFormData] = useState({
        imageUrls: [],
        name:'',
        description:'',
        address:'',
        type:'rent',
        typeOfProp:'',
        bedrooms:1,
        bathrooms:1,
        squareFootage:1,
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
    //ui toast
    const toast = useToast() // this is successfull message of creating listing.
    // set the listingId 
    const [updateId, setUpdateId] = useState();
    console.log(formData);
    const [imageUploadError, setImageUploadError] = useState(false);

    // get the current url address
    useEffect(() =>{
        const fetchListing = async () =>{
            const listingId = params.listingId;
            const res = await fetch(`/api/listing/get/${listingId}`);
            const data = await res.json();
            if(data.success === false) {
                console.log(data.message);
                return;
            }
            setFormData(data);
            setUpdateId(data._id);
        }
        fetchListing();

    }, []);


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
                console.log(error);
                setIloading(false);
                return;
            })
            
        } else {
            setImageUploadError("Upload Error");
            return;
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
        if(e.target.id === 'bedrooms' || e.target.id === 'bathrooms' ||e.target.id === 'regularPrice' ||e.target.id === 'squareFootage'){
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
            const res = await fetch(`/api/listing/update/${updateId}`, {
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

            // this is alert to inform user that listing successfully created.
            toast({
                title: 'Update Successfull.',
                status: 'success',
                duration: 1500,
                position:'bottom',
                isClosable: true,
            })
            navigate(`/listing/${data._id}`);  
            // when you sumbit the image to the database, the database will give you a new Unique ID
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
        <h1 className='text-3xl font-semibold text-center my-8'>Edit  Listing</h1>
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
                            p-1 w-full rounded-md' 
                            value={formData.typeOfProp}
                            onChange={handleChanger} 
                            id='typeOfProp'
                        >
                            <option>
                                Select Type of your Property
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
                          value={formData.bedrooms} 
                        />
                        <p>BedRooms</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='bathrooms' className='p-3 border 
                        border-gray-300 rounded-lg' min='1' max='10' required
                          onChange={handleChanger}
                          value={formData.bathrooms} 
                        />
                        <p>BathRooms</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='squareFootage' 
                        className='p-3 w-20 sm:w-36 border 
                        border-gray-300 rounded-lg' min='1' max='' required
                          onChange={handleChanger}
                          value={formData.squareFootage} 
                        />
                        <div className='flex flex-col items-center'>
                            <p>Square Footage</p>
                            <span className='text-xs'>(/m²)</span>
                        </div>
                        
                    </div>
                    <div className='flex  items-center gap-3'>
                        <input type='number' id='regularPrice' className='p-3 w-36 border 
                        border-gray-300 rounded-lg' min='1' max='99999999'  required
                          onChange={handleChanger}
                          value={formData.regularPrice} 
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
                    <div className='my-1'>
                        {iLoading
                        ? 
                         <Button onClick={handleImageUpload} type='button' disabled={iLoading} 
                          className=' uppercase text-green-700 border p-3 rounded-lg 
                          hover:shadow-lg disabled:opacity-80 border-green-600'
                          isLoading loadingText='Uploading' colorScheme='green'
                          size='md'
                          variant='outline'
                         />
                        :<Button onClick={handleImageUpload} type='button' disabled={iLoading} 
                          className='my-1 uppercase text-green-700 border p-3 rounded-lg 
                          hover:shadow-lg disabled:opacity-80 border-green-600'
                          variant='outline'colorScheme='green' >
                            UPLOAD
                         </Button>
                        }
                        {/* {iLoading ? "uploading" : "upload"} */}
                    </div>   
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
                    {cloading? 'Updating....' : 'Update Listing' }
                </button>
                {error && <p className='text-red-600 text-sm'>{error}</p>}
            </div>          
        </form> 
    </main>
  )
}

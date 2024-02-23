import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import{Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';
import { IoBedOutline } from "react-icons/io5";
import { PiBathtub } from "react-icons/pi";
import { RxRulerSquare } from "react-icons/rx";


export default function Listing() {
    SwiperCore.use([Navigation]);
    const params = useParams();
    const [showSlider, setShowSlider] = useState([]); // if the formData is object you need to inilize as object {};
    const [listing, setListing] = useState({});
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(false);
    


    useEffect(() =>{
        const fetchListing = async () =>{
            try {
                setLoading(true);
                const listingId = params.listingIds;
                const res = await fetch(`/api/listing/get/${listingId}`);
                const data = await res.json();
                if(data.success === false){
                    console.log(data.message);
                    setError(true);
                    setLoading(false);
                    return;
                }
                setListing(data);
                setShowSlider(data.imageUrls); 
                setLoading(false);
                setError(false);
            } catch (error) {
                setError(true);
                setLoading(false);
            }
            
        };
        fetchListing();
    },[params.listingIds]);
    console.log(loading);
    console.log(listing.bedrooms);
  return (
        <main>

            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (<p className='text-center my-7 text-2xl'>went wrong!</p>)}
            {listing && !loading && !error && ( 
                // this is make image on the top of the information
                <div className='flex flex-col-reverse lg:flex-row justify-between '>
                    {/* This is control the address and bed,bath, and rent button flex */}
                    <div className='w-100% px-[1rem] flex items-start flex-col  sm:items-center'> 
                        {/* This is ensure the list is items start align */}
                        <div className='py-[1.5rem]  max-w-[740px] m-auto flex items-start flex-col '>
                            <div className='flex items-start flex-wrap  '>
                                <h1 className='font-bold text-2xl'>{listing.address}</h1>
                            </div>
                            <div className='mt-4 flex gap-1 items-center flex-wrap'>
                                <IoBedOutline size={30}/> <span>{listing.bedrooms}</span>
                                <PiBathtub size={30} className='ml-3'/> <span>{listing.bathrooms}</span>
                                <PiBathtub size={30} className='ml-3'/> <span>{listing.bathrooms}</span>
                                <RxRulerSquare size={20} className='ml-3'/> <span>{listing.squareFootage} m²</span>
                                <p><span className='mx-1'>|</span>{listing.typeOfProp}</p>
                            </div>
                            <div className='mt-6  flex  items-center justify-between w-full flex-wrap'>
                                <div>
                                    <p className='bg-red-700 max-w-[200px]
                                     text-white text-center rounded-lg p-2'> 
                                        {listing.type === 'rent' ? 'For Rent' : 'For Sale'}  
                                    </p>
                                </div>
                               {/* This is price part */}
                                <div className='mr-2 sm:mt-2 ml-1'>
                                    <p className='font-bold'> 
                                        {listing.type === 'rent' ? `${listing.regularPrice}$/month` 
                                        : `${listing.regularPrice}$` }
                                    </p>
                                </div>   
                            </div>
                            {/* this is description part */}
                            <div className='mt-6'>
                                <p className='text-slate-800'>
                                    <span className='font-semibold text-black'>
                                        Description -
                                    </span>
                                    {listing.description}
                                </p>
                            </div>
                        
                        </div>
                    </div>
                    {/* this is image part */}
                    <div className='lg:w-[50%] '>
                        <Swiper navigation>
                            {showSlider.map((url) => (
                                <SwiperSlide key={url}>
                                    <div className='h-[300px] lg:h-[45rem] 'style={{background:`url(${url}) center no-repeat `, backgroundSize:'cover'}}>
                                    </div> 
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                    
                </div>
            )}
            
        </main>
  );
  

}

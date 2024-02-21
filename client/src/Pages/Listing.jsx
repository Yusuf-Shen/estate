import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import{Swiper,SwiperSlide} from 'swiper/react';
import SwiperCore from 'swiper';
import {Navigation} from 'swiper/modules'
import 'swiper/css/bundle';

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
  return (
        <main>
            {loading && <p className='text-center my-7 text-2xl'>Loading...</p>}
            {error && (<p className='text-center my-7 text-2xl'>went wrong!</p>)}
            {listing && !loading && !error && ( 
                <div>
                    <Swiper navigation>
                        {showSlider.map((url) => (
                            <SwiperSlide key={url}>
                                <div className='h-[550px]'style={{background:`url(${url}) center no-repeat `, backgroundSize:'cover'}}>
                                </div> 
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            )}
            <div className='font-bold'>{listing && listing.name}</div>
        </main>
  );
  

}

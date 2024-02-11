import React from 'react'


export default function CreateListing() {
  return (
    <main className='p-3 max-w-4xl mx-auto'>
        <h1 className='text-3xl font-semibold text-center my-8'>Create a Listing</h1>
        <form className='flex flex-col  sm:flex-row gap-6'>
            <div className='flex flex-col gap-4 flex-1'>
                <input type='text' className='border rounded-lg p-3' placeholder='Name' id='name' maxLength='62' minLength='10' required/>
                <textarea type='text' className='border rounded-lg p-3' placeholder='Description' id='description' required/>
                <input type='text' className='border rounded-lg p-3' placeholder='Address' maxLength='62' minLength='10' id='address' required/>
                {/* this is the tickbox */}
                <div className='flex gap-6 flex-wrap'>
                    <div className='flex gap-2'>
                        <input type='checkbox' id='sell' className='w-5'/>
                        <span>Sell</span>
                    </div>

                    <div className='flex gap-2'>
                        <input type='checkbox' id='Rent' className='w-5'/>
                        <span>Rent</span>
                    </div>
            
                    <div className='flex gap-2'>
                        <input type='checkbox' id='Parking spot' className='w-5'/>
                        <span>Parking Spot</span>
                    </div>
           
               
                    <div className='flex gap-2'>
                        <input type='checkbox' id='Furnished' className='w-5'/>
                        <span>Furnished</span>
                    </div>
         
               
                    <div className='flex gap-2'>
                        <input type='checkbox' id='Offer' className='w-5'/>
                        <span>Offer</span>
                    </div>
                </div>
                {/* This is the function that choose number of  bed  */}
                <div className='flex flex-wrap gap-6 my-2'>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='bedrooms' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required/>
                        <p>BedRooms</p>
                    </div>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='bathrooms' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required/>
                        <p>BathRooms</p>
                    </div>
                    <div className='flex  items-center gap-3'>
                        <input type='number' id='regularPrice' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required/>
                        <div className='flex flex-col items-center'>
                            <p>Regular price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                    </div>
                    <div className='flex items-center gap-3'>
                        <input type='number' id='discountedPrice' className='p-3 border border-gray-300 rounded-lg' min='1' max='10' required/>
                        <div className='flex flex-col items-center'>
                            <p>Discounted price</p>
                            <span className='text-xs'>($/month)</span>
                        </div>
                    </div> 
                </div>
            </div>
            {/* This is Image uploading UI */}
            <div className='flex flex-col flex-1 gap-3'>
                <p className='font-semibold'>
                    Images:<span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 9)</span>
                </p>
                <div className='my-3 flex gap-4'>
                    <input className='p-3 border border-gray-300 rounded w-full' type='file' id='images' accept='image/*' multiple></input>
                    <button className='uppercase text-green-700 border p-3 rounded-lg hover:shadow-lg disabled:opacity-80 border-green-600'>upload</button>   
                </div>
                <button className='uppercase text-white w-full bg-blue-950 p-3 rounded-lg hover:opacity-95 disabled:opacity-80'>Uploading</button>
            </div>          
        </form> 
    </main>
  )
}

import { data } from 'autoprefixer';
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export default function SignUp() {
  const[formData,setFormData] = useState();
  const[error,setError] = useState(null);  //set the error state
  const[loading, setLoading] = useState(false); // respond after click sign up
  const navigate = useNavigate(); // initial the package called useNavigate.
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
    
  };
  
  const  handleSumbit = async (e) => {
    e.preventDefault(); // prevent the default refresh the page
    try{
        setLoading(true); // after click the sign up button 
        const res = await fetch('/api/auth/signUp', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        const data =  await res.json();
        console.log(data);
        if(data.success === false){
          setError(data.message);
          setLoading(false);
          return;
        }
        setLoading(false);
        setError(null);
        navigate('/sign-in');
    } catch (error) {
        setLoading(false);
        setError(error.message || "Please fill the information!"); //  cause error is a object, we need string here to display.
    }
    
  };
  
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl text-center font-semibold my-7'>
        SignUp
      </h1>
      <form onSubmit={handleSumbit} className='flex flex-col gap-5' >
        <input type='text' placeholder='Username' 
        className='border p-3 rounded-lg' id='username' 
        onChange={handleChange}/>
        <input type='text' placeholder='Email' 
        className='border p-3 rounded-lg' id='email' 
        onChange={handleChange}/>
        <input type='text' placeholder='Password' 
        className='border p-3 rounded-lg' id='password' 
        onChange={handleChange}/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95
        disabled:opacity-80'>  
          {loading ? 'Loading...' : 'Sign up'} 
        </button> 
      </form>
      <div className='flex gap-3 mt-6'>
        <p>Have an account?</p>
        <Link to={"/sign-in"}> 
          <span className='text-blue-700'>Sign In</span>
        </Link>
      </div>
      {error && <p className='text-red-500 mt-5'>{error}</p>}

    </div>
  )
}

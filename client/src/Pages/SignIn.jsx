import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';


export default function SignIn() {
  const[formData, setFormData] = useState();
  const[loading, setLoading] =  useState(false);
  const[error,setError] = useState(null);
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };
  const handleSumbit = async (e) =>{
    e.preventDefault();
    try {
      setLoading(true);
      const res = await fetch('/api/auth/signIn', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json(); // the await is the key cause this is async function
      console.log(data);
      if(data.success === false) {
        setError(data.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setError(null);
      navigate('/home');
    } catch (error) {
      setLoading(false);
      setError(error.message || "the other message!")
    }
    
  };
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-semibold my-7'>Sign In</h1>
      <form onSubmit={handleSumbit} className='flex flex-col gap-4 '>
        <input onChange={handleChange} type='text' placeholder='Email' 
        className='border rounded-lg p-3' id='email'/>
        <input onChange={handleChange} type='text' placeholder='Password' 
        className='border p-3 rounded-lg' id='password'/>
        <button disabled={loading} className='bg-slate-700 text-white p-3 
        rounded-lg uppercase hover:opacity-95
        disabled:opacity-80'>  
          {loading ? "Loadong..." : "Sign In"}
        </button> 
      </form>
      <div className='flex gap-3 my-5'>
        <p>Don't have account?</p>
        <Link to={'/sign-up'}>
          <span className='text-blue-700'>Sign up</span>
        </Link>
      </div>
      {error && <p className='text-red-500'> {error}</p>}
    </div>
  )
}

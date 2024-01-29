import { useSelector } from "react-redux"

export default function Profile() {
  const {currentUser} = useSelector(state => state.user);
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className='text-3xl text-center font-semibold my-7'>Profile</h1>
      <form className="flex flex-col gap-3">
        <img src={currentUser.avatar}  alt="avatar" className="rounded-full h-24 w-24 object-cover self-center my-2 cursor-pointer"/>
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

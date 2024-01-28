import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';


export default function Header() {
    const {currentUser} = useSelector(state => state.user)
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex items-center justify-between max-w-6xl mx-auto p-6'>
            <Link to='/home'>
                <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                    <span className='text-slate-500'>Mys</span>
                    <span>Estate</span>
                </h1>
            </Link>
            <form className='bg-slate-100 p-1 rounded-lg flex items-center justify-between w-24 sm:w-64'>
                <input type='text' placeholder='Search...' className='bg-transparent outline-none'> 
                </input>
                <FaSearch className='text-slate-500'/>
            </form>
            
            <ul className='flex gap-5 '>
                <CustomLink href='/home' className='hidden sm:inline' title="Home"/>
                <CustomLink href='/profile' className='hidden sm:inline' title="Profile"/>
                <CustomLink href='/about' className='hidden sm:inline' title="About"/>
                <Link to={'/profile'} className=' text-black '>
                    {currentUser? (<img className='rounded-full h-7 w-7 object-cover' src={currentUser.avatar} alt='profile'/>):
                    (<li className='relative hover:text-slate-500 '>Sign In<span className='h-[2px] inline-block  w-0 
                    bg-black absolute left-0 -bottom-0.5 
                    group-hover:w-full transition-[width] ease-linear duration-300'>
                        
                    </span></li>)}
                </Link>
            </ul>
        </div>
        
    </header>
  )
}

export const CustomLink = ({href,className=" ",title}) => {
    return(
        <Link to={`${href}`} className={`${className} relative group text-black hover:text-slate-500`}>
            
                {title}
                <span className='h-[2px] inline-block  w-0 
                bg-black absolute left-0 -bottom-0.5 
                group-hover:w-full transition-[width] ease-linear duration-300'>
                    
                </span>
            
        </Link>
    )
}

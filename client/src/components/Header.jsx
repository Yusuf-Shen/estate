import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';


export default function Header() {
  return (
    <header className='bg-slate-200 shadow-md'>
        <div className='flex items-center justify-between max-w-6xl mx-auto p-6'>
            <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
                <span className='text-slate-500'>Mys</span>
                <span>Estate</span>
            </h1>
            <form className='bg-slate-100 p-1 rounded-lg flex items-center justify-between w-24 sm:w-64'>
                <input type='text' placeholder='Search...' className='bg-transparent outline-none'> 
                </input>
                <FaSearch className='text-slate-500'/>
            </form>
            <ul className='flex gap-5'>
                <CustomLink href='/home' className='hidden sm:inline' title="Home"/>
                <CustomLink href='/profile' className='hidden sm:inline' title="Profile"/>
                <CustomLink href='/about' className='hidden sm:inline' title="About"/>
                <CustomLink href='/Sign-in' className='' title="SignIn"/>
            </ul>
        </div>
        
    </header>
  )
}

export const CustomLink = ({href,className=" ",title}) => {
    return(
        <Link to={`${href}`} className={`${className} relative group`}>
            
                {title}
                <span className='h-[2px] inline-block  w-0 
                bg-black absolute left-0 -bottom-0.5 
                group-hover:w-full transition-[width] ease-linear duration-300'>
                    
                </span>
            
        </Link>
    )
}

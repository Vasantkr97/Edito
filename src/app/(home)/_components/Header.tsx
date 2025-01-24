import { getUser } from '@/src/db/user'
import { currentUser } from '@clerk/nextjs/server'
import { Blocks, Code2, Sparkles } from 'lucide-react';
import Link from 'next/link';
import React from 'react'
import ThemeSelector from './ThemeSelector';
import LanguageSelector from './LanguageSelector';
import { SignedIn } from '@clerk/nextjs';
import RunButton from './RunButton';
import HeaderProfileBtn from './HeaderProfileBtn';


async function Header() {

    const user = await currentUser()
    const postgresUser =  user ? await getUser(user.id) : null;

  return (
    <div className='relative z-10'>
      <div className='flex'>
        <div className='flex'>
          <Link href="/" className=''>
            <div>
              <Blocks />
            </div>
            <div className='flex flex-col'>
              <span className='font-bold text-xl'>
                Edito
              </span>
              <span>
                Interactive Code Editor
              </span>
            </div>
          </Link>

          <nav>
            <Link href='/snippets'>
              <Code2 />
              <span>
                Snippets
              </span>
            </Link>
          </nav>
        </div>
        
        <div className='flex'>
          <div>
            <ThemeSelector />
            <LanguageSelector />
          </div>

          {!postgresUser?.isPro && (
            <Link 
              href="/pricing"
            >
              <Sparkles />
              <span>
                Pro
              </span>
            </Link>
          )}

          <SignedIn>
            <RunButton />
          </SignedIn>

          <div className='pl-3'>
            <HeaderProfileBtn />
          </div>
        </div>
      </div>
     </div>
  )
}

export default Header
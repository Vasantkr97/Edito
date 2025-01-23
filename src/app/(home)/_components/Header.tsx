import { getUser } from '@/src/db/user'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'


async function Header() {
    const user = await currentUser()
    console.log("Clerk User", user);

    const postgresUser = user ? getUser(user.id) : null;
    console.log("Postgres User:", postgresUser);
  return (
    <div>
        
     </div>
  )
}

export default Header
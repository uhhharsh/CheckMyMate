import React from 'react';
import Login from '@/components/ui/login';
import NavBar from '@/components/ui/navBar';

export default function LoginPage() {
  return (
    <>
      {/* navBar container */}
      <div className="flex flex-col items-center justify-center gap-4 p-4"> 
        <div className="rounded sticky top-0"> 
          <NavBar />
        </div>
      </div>
      <div className='flex flex-col items-center justify-center min-h-screen'>
        <div className="flex items-center justify-center">
          <Login title={"Teacher Login"} />
        </div>
      </div>
    </>
  );
}
import React from 'react';
import { TextareaWithButton } from '@/components/ui/textareaWithButton';

const Model = () => {
  return (
    <div className='flex items-center justify-center min-h-screen'>
      {/* Container */}
      <div className='flex items-center justify-center space-x-8 p-4 shadow-lg rounded-lg'>
        
        {/* Left Container */}
        <div className='p-32 fixed top-0 left-0 w-1/2 h-screen overflow-auto flex items-center justify-center'>
          <TextareaWithButton />
        </div>

        {/* Right Container */}
        <div className='fixed top-0 right-0 w-1/2 h-screen overflow-auto flex items-center justify-center'>
          <p className='p-40 text-4xl'>Marks attained are : 99</p>
        </div>

      </div>
    </div>
  );
}

export default Model;

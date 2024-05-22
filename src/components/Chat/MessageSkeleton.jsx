import React from 'react'
import ClipSpinner from '@/components/Loader/ClipSpinner';

const MessageSkeleton = () => {
  return (
    <div className='w-full h-full flex items-center justify-center'>
        <ClipSpinner />
    </div>
  )
}

export default MessageSkeleton
import React from 'react'
import ClipSpinner from '@/components/Loader/ClipSpinner';
import { useMediaQuery } from '@uidotdev/usehooks';

const MessageSkeleton = () => {
  const isSmallDevice = useMediaQuery("only screen and (max-width : 768px)");

  return (
    <div className='w-full h-full flex items-center justify-center'>
        <ClipSpinner size={isSmallDevice ? 32 : 40} />
    </div>
  )
}

export default MessageSkeleton
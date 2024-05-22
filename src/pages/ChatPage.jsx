import Chat from '@/components/Chat/Chat'
import Layout from '@/components/Layout/Layout'
import React from 'react'

const ChatPage = () => {
  return (
    <Layout children={<Chat />} options={{overflow: false}} />
  )
}

export default ChatPage
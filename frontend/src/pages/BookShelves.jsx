import { useState } from 'react'
import '../App.css'
import CarouselBar from '@/component/CarouselBar';
import Header from '@/component/Header';
import mainPageImg from '../assets/image/mainPage.png'

export default function BookShelves({setUser, user}) {
  const [count, setCount] = useState(0);

  return (
    <div>
      <Header page={2} user={user}/>
      
    </div>
  )
}

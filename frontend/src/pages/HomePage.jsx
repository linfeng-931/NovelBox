import { useState, useEffect } from 'react'
import '../App.css'

import Header from '@/component/Header';
import mainPageImg from '../assets/image/mainPage.png'
import SlideBar from '@/component/SlideBar';

import { handleGetNovels } from '@/utils/linkDB'

export default function HomePage({setUser, user}) {
  const [count, setCount] = useState(0);
  const [rankNovels, setRankNovels] = useState([]);

    useEffect(() => {
        handleGetNovels(setRankNovels, true); 
    }, []);

  return (
    <div>
      <Header page={1} user={user}/>
      <img style={{width: '100%'}} src={mainPageImg} alt="主頁圖片"/>
      <div style={{padding: 40}}>
        <SlideBar data={rankNovels.slice(0, 15)}/>
      </div>
    </div>
  )
}

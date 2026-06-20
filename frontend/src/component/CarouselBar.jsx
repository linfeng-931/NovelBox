import * as React from 'react';
import { MotionCarousel } from '@/components/animate-ui/components/community/motion-carousel';
import testImage from '../assets/image/未來神話長卷.jpg'

export default function CarouselBar(){
    const SLIDE_COUNT = 6;
    const SLIDES = Array.from(Array(SLIDE_COUNT).keys());
    const OPTIONS = {
        loop: true,
    };
    return(
        <MotionCarousel slides={SLIDES} options={OPTIONS} />
    )
};
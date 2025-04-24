import { useState } from 'react';
import Slider from "react-slick";
import { Settings } from 'react-slick';
import Paper from './components/Fragments/Paper';
import RecommendedItem from './models/RecommendItem';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import RecommendedItemCard from './components/RecommendItemCard';
import useLeaveAnimate from './tools/LeaveAnimate';

export default function App() {

    const settings: Settings = {
        dots: true,
        fade: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        waitForAnimate: false,
        autoplay: true,
        autoplaySpeed: 3500,
        pauseOnHover: true
    };

    const recommendInCarousel: RecommendedItem[] = [
        new RecommendedItem("Vasty", "https://wallpapers.com/images/hd/4k-16-9-winter-forest-8s68ejhb0v96d5fu.jpg", "#", "33", "5k", "unk"),
        new RecommendedItem("Ompot", "https://www.keaitupian.cn/cjpic/frombd/2/253/1659552792/3869332496.jpg", "#", "66", "5k", "unk"),
        new RecommendedItem("Fierra", "https://img4.pconline.com.cn/pconline/images/product/20230524/9467332.png", "#", "99", "5k", "unk"),
    ];

    const restRecommends: RecommendedItem[] = [

    ];

    // useLeaveAnimate();

    return <>
        <div  className='h-[48px]'></div>
        <Slider {...settings} className='w-full mx-auto shadow-xl fade-in  '>
            {recommendInCarousel.map((x) => { return <RecommendedItemCard item={x} key={x.title} hero /> })}
        </Slider>
        <Paper className='pt-5!'>
            <h1 className='text-center font-bold text-3xl'>Welcome to O'Petova WholeSale!</h1>
            <div className='min-h-max w-full'>


            </div>
        </Paper>
    </>;

}

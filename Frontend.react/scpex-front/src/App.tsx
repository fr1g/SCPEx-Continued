import { useState } from 'react';
import Slider from "react-slick";
import Paper from './components/Fragments/Paper';
import RecommendedItem from './models/RecommendItem';

export default function App() {

    const settings = {
        className: "center",
        centerMode: true,
        infinite: true,
        centerPadding: "60px",
        slidesToShow: 3,
        speed: 500
    };

    const recommendInCarousel: RecommendedItem[] = [

    ];

    const restRecommends: RecommendedItem[] = [

    ];

    return <>
        <Paper>
            <div className='min-h-max w-full'>
                <Slider {...settings} >

                </Slider>

            </div>
        </Paper>
    </>;

}

import { useNavigate } from "react-router";
import RecommendedItem from "../models/RecommendItem";
import GradientText from '../Reactbits/GradientText/GradientText';
// import ShinyText from "../Reactbits/ShinyText/ShinyText";

export default function RecommendedItemCard({ item, hero = false }: { item: RecommendedItem, hero?: boolean }) {

    let navto = useNavigate();
    // !!! url should be FRONTENDTIVE.
    function handleClick() {
        console.log('click on recommend')
    }

    return (
        <div className="w-min fade-in rounded-md shadow-md hover:shadow-lg transition mx-auto" onClick={handleClick}>
            <div style={{ backgroundImage: `url(${item.cover})` }}
                className={`${hero ? 'aspect-[16/11] md:aspect-[16/6] w-screen bg-center bg-cover bg-no-repeat' : 'h-32 w-32 '}  relative  pointer-fill`} >
                {hero && <GradientText
                    colors={["#90ffaa", "#9079ff", "#70ffaa", "#6079ff", "#50ffaa"]}
                    animationSpeed={3}
                    showBorder={false}
                    className="absolute! block! left-3 bottom-0 md:left-8 md:bottom-7 p-3 text-3xl md:text-6xl font-semibold   scale-x-110 " 
                >
                    {item.title}
                </GradientText>}
            </div>
        </div>
    );

}
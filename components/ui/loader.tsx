"use client";

import { ThreeCircles } from "react-loader-spinner";

const Loader = () => {
    return (
        <div className="fixed inset-0 z-600 m-0 grid size-full place-items-center space-y-0 bg-black/50 p-0">
            <div className="grid size-22 place-items-center rounded-full bg-white">
                <ThreeCircles
                    visible={true}
                    height="48"
                    width="48"
                    color="#4fa94d"
                    ariaLabel="three-circles-loading"
                    innerCircleColor="#2D2D2D"
                    middleCircleColor="#D9D9D9"
                    outerCircleColor="#D9D9D9"
                    wrapperStyle={{}}
                    wrapperClass=""
                />
            </div>
        </div>
    );
};

export default Loader;
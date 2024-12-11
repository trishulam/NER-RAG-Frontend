import Lottie from "react-lottie";
import animationData from "@/loading-icon.json";

export default function Loader() {
    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
          preserveAspectRatio: "xMidYMid slice"
        }
      };
    
    return (
    <div className="h-screen w-screen flex items-center justify-center">
      <Lottie 
        options={defaultOptions}
        height={200}
        width={200}
      />
    </div>
    );
  }
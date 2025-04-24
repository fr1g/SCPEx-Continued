import { useEffect, useRef } from "react";
import { useBlocker, useLocation } from "react-router";

interface UseLeaveAnimationParams {
  target: HTMLElement | null;
  animationClass?: {
    enter?: string;
    exit?: string;
  };
  duration?: number;
}

export default function useLeaveAnimation({
  target,
  animationClass = { enter: "fade-in", exit: "fade-au" },
  duration = 500
}: UseLeaveAnimationParams) {
    if(target == null) return;
    const location = useLocation();
    const targetRef = useRef(target);
    const isAnimating = useRef(false);
    const { enter, exit } = animationClass;

  // 同步最新的 DOM 元素引用
  useEffect(() => {
    targetRef.current = target;
  }, [target]);

  // 创建路由拦截器
  const blocker = useBlocker(({ currentLocation, nextLocation }) => {
    return currentLocation.pathname !== nextLocation.pathname;
  });

  // 处理导航拦截和动画
  useEffect(() => {
    const element = targetRef.current;
    if (!element || blocker.state !== "blocked") return;

    isAnimating.current = true;
    
    // 应用退出动画
    if (exit && enter) {
      element.classList.replace(enter, exit);
    }

    const handleAnimationEnd = () => {
      if (blocker.state === "blocked") {
        blocker.proceed();
      }
      isAnimating.current = false;
    };

    // 双保险：同时监听动画事件和设置超时
    element.addEventListener("animationend", handleAnimationEnd, { once: true });
    const timer = setTimeout(handleAnimationEnd, duration);

    // 清理函数
    return () => {
      element.removeEventListener("animationend", handleAnimationEnd);
      clearTimeout(timer);
      if (blocker.state === "blocked") {
        blocker.reset();
      }
    };
  }, [blocker.state, duration, enter, exit]);

  // 处理导航完成后的动画重置
  useEffect(() => {
    const element = targetRef.current;
    if (!element || !enter || !exit || isAnimating.current) return;

    // 当路由实际变化时恢复动画
    if (element.classList.contains(exit)) {
      element.classList.replace(exit, enter);
    }
  }, [location.key, enter, exit]);

  // 提供手动重置方法（可选）
  const resetAnimation = () => {
    const element = targetRef.current;
    if (element && enter && exit && element.classList.contains(exit)) {
      element.classList.replace(exit, enter);
    }
  };

  return { resetAnimation };
}


// import { useEffect } from "react";
// import { useBlocker, useNavigate, useLocation } from "react-router";

// export default function useLeaveAnimate(target: HTMLElement){
//     let isCompleted = false;
//     let different;
//     let location = useLocation();

//     let blocker =  useBlocker(({ currentLocation, nextLocation }) => {
//         different = (currentLocation.pathname !== nextLocation.pathname)
//             console.log(currentLocation, nextLocation)

//         target.classList.replace("fade-in", "fade-au");
//         setTimeout(() => {
//             isCompleted = true;
//         }, 500);
//         console.log(target, 1)
//         return true;
//     }); 

//     useEffect(() => {
//         // blocker.proceed!();
//         console.log(target, 2)
//     }, [isCompleted]);

//     useEffect(() => {
//         // target.classList.replace("fade-au", "fade-in");
//         isCompleted = false;
//     }, [blocker.location]);

//     // return blocker;
// }

// // let different;

// // let blocker =  useBlocker(({ currentLocation, nextLocation }) => {
// //     different = (currentLocation.pathname === nextLocation.pathname);
    
// //     targetElement.classList.replace("fade-in", "fade-au");
// //     console.log(targetElement, typeof targetElement);
// //     return false;
// // }); 

// // useEffect(() => {

// //     setTimeout(() => {
// //         if (blocker.state === "blocked") {
// //             console.log("proceeded");
// //             setTimeout(() => {
// //                 blocker.proceed?.();
// //             }, 500);
// //         }
// //     }, 500);

// //   }, [different]);
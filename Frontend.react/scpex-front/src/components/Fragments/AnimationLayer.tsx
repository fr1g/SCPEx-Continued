import { motion } from "framer-motion"
import { ReactNode } from "react"

// fvcking vseless
export default function AnimationLayer({children} : {children: ReactNode | string | number}){
    if( true) return <>{children}</>
    return <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
    >
        {children}
    </motion.div>
}
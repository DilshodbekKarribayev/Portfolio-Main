import { useRef, useState } from 'react'
import { motion } from 'motion/react'

const MotionDiv = motion.div

export default function Magnetic({ children, damping = 0.1 }) {
    const ref = useRef(null)
    const [position, setPosition] = useState({ x: 0, y: 0 })

    const handleMouse = (e) => {
        const { clientX, clientY } = e
        const { height, width, left, top } = ref.current.getBoundingClientRect()
        const middleX = clientX - (left + width / 2)
        const middleY = clientY - (top + height / 2)
        setPosition({ x: middleX * damping, y: middleY * damping })
    }

    const reset = () => {
        setPosition({ x: 0, y: 0 })
    }

    return (
        <MotionDiv
            className="inline-block"
            ref={ref}
            onMouseMove={handleMouse}
            onMouseLeave={reset}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: 'spring', stiffness: 150, damping: 15, mass: 0.1 }}
        >
            {children}
        </MotionDiv>
    )
}


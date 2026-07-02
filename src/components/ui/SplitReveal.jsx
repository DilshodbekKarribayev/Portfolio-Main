import { motion } from 'motion/react'

/**
 * SplitReveal — оптимизированный.
 *
 * Убран rotateX (3D transform создаёт отдельный GPU layer на каждое слово).
 * Убран will-change (браузер сам решает что промотить).
 * Только opacity + translateY — лёгкий и плавный.
 */

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  show: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: i * 0.06,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
}

function SplitReveal({ text, as: Tag = 'span', className = '', delay = 0, once = true }) {
  const words = text.split(' ')

  return (
    <Tag className={className} aria-label={text}>
      <motion.span
        initial="hidden"
        whileInView="show"
        viewport={{ once, amount: 0.6 }}
        style={{ display: 'inline' }}
      >
        {words.map((word, i) => (
          <motion.span
            key={i}
            custom={i + Math.round(delay / 0.06)}
            variants={wordVariants}
            style={{ display: 'inline-block' }}
            className="mr-[0.25em] last:mr-0"
          >
            {word}
          </motion.span>
        ))}
      </motion.span>
    </Tag>
  )
}

export default SplitReveal

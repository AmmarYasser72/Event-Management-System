import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -10,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.3,
};

const PageTransition = ({ children, transitionKey }) => {
    const MotionDiv = motion.div;

    return (
        <AnimatePresence mode="wait">
            <MotionDiv
                key={transitionKey}
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
                className="h-full w-full"
            >
                {children}
            </MotionDiv>
        </AnimatePresence>
    );
};

export default PageTransition;

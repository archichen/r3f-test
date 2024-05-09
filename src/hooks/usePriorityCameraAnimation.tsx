import { RootState, useFrame } from "@react-three/fiber";
import React from "react";
import { generateUUID } from "three/src/math/MathUtils";

export declare type CameraAnimationCallback = (
    state: RootState,
    delta: number,
    handler: PriorityAnimationHandler
) => void;

declare type AnimationItem = {
    callback: CameraAnimationCallback;
    priority: number;
};

declare type PriorityAnimationItem = {
    callback: CameraAnimationCallback;
    priority: number;
    id: string;
};

const priorityAnimationQueue: PriorityAnimationItem[] = [];

declare type PriorityAnimationHandler = {
    id: string;
    priority: number;
    remove: () => void;
    change: (priority: number) => void;
    toFirst: () => void;
    toLatest: () => void;
    disable: () => void;
};

function generatePriorityAnimationItem(
    animation: AnimationItem
): PriorityAnimationItem {
    return {
        ...animation,
        id: generateUUID(),
    };
}

export function usePriorityCameraAnimation(
    callback: CameraAnimationCallback,
    priority: number = 0
) {
    const _animation = generatePriorityAnimationItem({
        callback,
        priority,
    });
    priorityAnimationQueue.push(_animation);
    priorityAnimationQueue.sort((a, b) => a.priority - b.priority);
}

export default function PriorityCameraAnimation() {
    useFrame((state, delta) => {
        // console.log(priorityAnimationQueue)
        if (priorityAnimationQueue.length === 0) return;

        const _animation = priorityAnimationQueue[0];

        if (_animation.priority === Number.MIN_VALUE) return;

        _animation.callback(state, delta, {
            id: _animation.id,
            priority: _animation.priority,
            remove: () => {
                priorityAnimationQueue.splice(
                    priorityAnimationQueue.indexOf(_animation),
                    1
                );
                priorityAnimationQueue.sort((a, b) => a.priority - b.priority);
            },
            change: (priority: number) => {
                _animation.priority = priority;
                priorityAnimationQueue.sort((a, b) => a.priority - b.priority);
            },
            toFirst: () => {
                _animation.priority = Number.MAX_VALUE - 1;
                priorityAnimationQueue.sort((a, b) => a.priority - b.priority);
            },
            toLatest: () => {
                _animation.priority = Number.MIN_VALUE + 1;
                priorityAnimationQueue.sort((a, b) => a.priority - b.priority);
            },
            disable: () => {
                _animation.priority = Number.MIN_VALUE;
                priorityAnimationQueue.sort((a, b) => a.priority - b.priority);
            }
        });
    });
    return <></>;
}

import React, { useState } from "react"
import s from "./styles.module.scss"
import cn from "classnames"
import { IElement } from "@interfaces"

export default function Element ({ title }: IElement) {
    const [isDragging, setIsDragging] = useState<boolean>(false)

    const handleDragStart = () =>
    {
        console.log('dragStart')
        setIsDragging(true)
    }
    const handleDragEnd = () =>
    {
        console.log('dragEnd')
        setIsDragging(false)
    }


    return (
        <div
            className={cn(s.element, isDragging ? s.dragging : '')}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            draggable="true"
        >
            {title}
        </div>
    )
}

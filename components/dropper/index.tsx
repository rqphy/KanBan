import React from "react"
import s from "./styles.module.scss"
import cn from "classnames"
import { Element } from "@components"
import { IElement } from "@interfaces"

export type IProps = {
    title: string
    elements: IElement[]
}

export default function Dropper ({ title, elements }: IProps) {
    return (
        <div className={s.dropper}>
            <h2>{title}</h2>
            {
                elements.map((el, index) =>
                (
                    <Element key={index} title={el.title}/>
                ))
            }
        </div>
    )
}

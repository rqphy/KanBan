import React from "react"
import s from "./styles.module.scss"
import cn from "classnames"
import { Element } from "@components"

export type IProps = {
    title: string
}

export default function Dropper ({ title }: IProps) {
    return (
        <div className={s.dropper}>
            <h2>{title}</h2>
            <Element title="test"/>
        </div>
    )
}

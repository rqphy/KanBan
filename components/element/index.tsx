import React, { useState } from "react"
import s from "./styles.module.scss"
import cn from "classnames"
import { IElement } from "@interfaces"

export default function Element ({ title }: IElement) {
    return (
        <div
            className={s.element}
        >
            {title}
        </div>
    )
}

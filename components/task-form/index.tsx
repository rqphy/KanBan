import React from "react"
import s from "./styles.module.scss"
import cn from "classnames"

export type IProps = {
    onClick: () => void
}

export default function TaskForm ({ onClick }: IProps) {
    return (
        <div className={s.button} onClick={onClick}>
            Add new task
        </div>
    )
}

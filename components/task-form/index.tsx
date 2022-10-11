import React from "react"
import s from "./styles.module.scss"
import cn from "classnames"

export type IProps = {
    onClick: (test: string | null) => void
}

export default function TaskForm ({ onClick }: IProps) {
    return (
        <form className={s.form} onSubmit={(_event) => {
            _event.preventDefault()
            const formData = new FormData(_event.target as HTMLFormElement)
            const formProps = Object.fromEntries(formData)
            onClick(formProps.title.toString())
        }}>
            <input className={s.input} type="text" name="title" id="title" placeholder="New Task"/>
            <button className={s.button}>
                Add new task
            </button>
        </form>
    )
}

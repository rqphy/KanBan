import type { NextPage } from 'next'
import Head from 'next/head'
import { Dropper } from '@components'
import s from "./styles.module.scss"
import cn from "classnames"

const elements = [
  {
    title: 'toto',
  },
  {
    title: 'Hello',
  },
  {
    title: 'World',
  },
  {
    title: 'React',
  },
]

const Home: NextPage = () => {
  return (<>
      <Head>
        <title> Simple title </title>
      </Head>
      <main className={s.table}>
        <Dropper title='Todo' elements={elements} />
        <Dropper title='In Progress' elements={elements}/>
        <Dropper title='Completed' elements={elements} />
      </main>
    </>
  )
}

export default Home

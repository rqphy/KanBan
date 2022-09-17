import type { NextPage } from 'next'
import Head from 'next/head'
import { Dropper } from '@components'
import s from "./styles.module.scss"
import cn from "classnames"

const Home: NextPage = () => {
  return (<>
      <Head>
        <title> Simple title </title>
      </Head>
      <main className={s.table}>
        <Dropper title='Todo' />
        <Dropper title='In Progress' />
        <Dropper title='Completed' />
      </main>
    </>
  )
}

export default Home

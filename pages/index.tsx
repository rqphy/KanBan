import type { NextPage } from 'next'
import Head from 'next/head'
import s from "./styles.module.scss"
import cn from "classnames"
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { v4 as uuid} from 'uuid'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from "next";



const itemsFromBackend = [
  {id: uuid(), content: "First task"},
  {id: uuid(), content: "Second task"},
  {id: uuid(), content: "Third task"},
]

const columnsFromBackend = {
  [uuid()]: {
    name: 'Todo',
    items: itemsFromBackend
  }
}

const Home: NextPage = () => {
  const [columns, setColumns] = useState(columnsFromBackend)
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(process.browser);
  }, [])


  return (
    <>
      <Head>
        <title> Simple title </title>
      </Head>
      {
        isBrowser ? (
          <main className={s.table}>
            <DragDropContext onDropEnd={result => console.log(result)}>
              {Object.entries(columns).map(([ columnId, column ]) => (
                <Droppable droppableId={columnId} key={columnId}>
                  {
                    (provided, snapshot) =>
                      (
                        <div
                          {...provided.droppableProps}
                          ref={provided.innerRef}
                          className={s.column}
                        >
                          {
                            column.items.map((item, index) =>
                            (
                              <Draggable key={item.id} draggableId={item.id} index={index}>
                                {
                                  (provided, snapshot) =>
                                  (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      className={s.item}
                                      // style={{...provided.draggableProps.style}}
                                    >
                                      {
                                        item.content
                                      }
                                    </div>
                                  )
                                }
                              </Draggable>
                            ))
                          }
                        </div>
                      )
                  }
                </Droppable>
              ))}
            </DragDropContext>
          </main>
        ) : null
      }

    </>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ query }) =>
{

  resetServerContext()   // <-- CALL RESET SERVER CONTEXT, SERVER SIDE

  return {props: { data : []}}

}

export default Home

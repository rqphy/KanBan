import type { NextPage } from 'next'
import Head from 'next/head'
import s from "./styles.module.scss"
import cn from "classnames"
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { v4 as uuid} from 'uuid'
import { useState, useEffect } from 'react'
import { GetServerSideProps } from "next";

import { Element } from '@components'


const itemsFromBackend = [
  {id: uuid(), content: "First task"},
  {id: uuid(), content: "Second task"},
  {id: uuid(), content: "Third task"},
]

const columnsFromBackend = {
  [uuid()]: {
    name: 'Todo',
    items: itemsFromBackend
  },
  [uuid()]: {
    name: 'In Progress',
    items: []
  },
  [uuid()]: {
    name: 'Compledted',
    items: []
  },
}

const handleColumnChange = (result, columns, setColumns) =>
{
	const { source, destination } = result
	const sourceColumn = columns[source.droppableId]
	const destColumn = columns[destination.droppableId]
	const sourceItems = [...sourceColumn.items]
	const destItems = [...destColumn.items]
	const [removed] = sourceItems.splice(source.index, 1)
	destItems.splice(destination.index, 0, removed)
	setColumns({
		...columns,
		[source.droppableId]: {
		...sourceColumn,
		items: sourceItems
		},
		[destination.droppableId]: {
		...destColumn,
		items: destItems
		}
	})
}

const handleColumnOrder = (result, columns, setColumns) =>
{
	const { source, destination } = result
	const column = columns[source.droppableId]
	const copiedItems = [...column.items]
	const [removed] = copiedItems.splice(source.index, 1)
	copiedItems.splice(destination.index, 0, removed)
	setColumns({
		...columns,
		[source.droppableId]: {
		...column,
		items: copiedItems
		}
	})
}

const onDragEnd = (result, columns, setColumns) =>
{
	if(!result.destination) return
	const { source, destination } = result
	if(source.droppableId !== destination.droppableId)
	{
		handleColumnChange(result, columns, setColumns)
	} else
	{
		handleColumnOrder(result, columns, setColumns)
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
        <title> Kanban App </title>
      </Head>
      {
        isBrowser ? (
          <main className={s.table}>
            <DragDropContext onDragEnd={result => onDragEnd(result, columns, setColumns)}>
              {Object.entries(columns).map(([ columnId, column ]) => (
                <div key={columnId}>
                  <h2>{column.name}</h2>
                  <Droppable droppableId={columnId}>
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
                                      >
                                        {
										  <Element title={item.content}/>
                                        }
                                      </div>
                                    )
                                  }
                                </Draggable>
                              ))
                            }
                            {
                              provided.placeholder
                            }
                          </div>
                        )
                    }
                  </Droppable>
                </div>
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

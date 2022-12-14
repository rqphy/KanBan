import type { NextPage } from 'next'
import Head from 'next/head'
import s from "./styles.module.scss"
import cn from "classnames"
const { DragDropContext, Droppable, Draggable, resetServerContext } = require('react-beautiful-dnd') 
const { v4 } = require('uuid')
const uuid = v4
import { useState, useEffect, Dispatch } from 'react'
import { GetServerSideProps } from "next";

import { Element, TaskForm } from '@components'

interface IItem
{
  id: string,
  content: string
}

interface IColumn 
{
  name: string,
  items: IItem[]
}

interface IData
{
  [key: string]: IColumn
}


const itemsFromBackend: IItem[] = [
  {id: uuid(), content: "First task"},
  {id: uuid(), content: "Second task"},
  {id: uuid(), content: "Third task"},
]

const columnsFromBackend: IData = {
  [uuid()]: {
    name: 'Monday',
    items: itemsFromBackend
  },
  [uuid()]: {
    name: 'Tuesday',
    items: []
  },
  [uuid()]: {
    name: 'Wednesday',
    items: []
  },
  [uuid()]: {
    name: 'Thursday',
    items: []
  },
  [uuid()]: {
    name: 'Friday',
    items: []
  },
}

const handleColumnChange = (result: any, columns: IData, setColumns: Dispatch<IData>) =>
{
	const { source, destination } = result
	const sourceColumn: IColumn = columns[source.droppableId]
	const destColumn: IColumn = columns[destination.droppableId]
	const sourceItems: IItem[] = [...sourceColumn.items]
	const destItems: IItem[] = [...destColumn.items]
	const [removed]: IItem[] = sourceItems.splice(source.index, 1)
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

const handleColumnOrder = (result: any, columns: IData, setColumns: Dispatch<IData>): void =>
{
	const { source, destination } = result
	const column: IColumn = columns[source.droppableId]
	const copiedItems: IItem[] = [...column.items]
	const [removed]: IItem[] = copiedItems.splice(source.index, 1)
	copiedItems.splice(destination.index, 0, removed)
	setColumns({
		...columns,
		[source.droppableId]: {
		...column,
		items: copiedItems
		}
	})
}

const onDragEnd = (result: any, columns: IData, setColumns: Dispatch<IData>): void =>
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

const addTaskToColumn = (columnId: string, columns: IData, setColumns: Dispatch<IData>, test: string | null): void =>
{
  const currentColumn: IColumn = columns[columnId]
  const newItem: IItem = {id: uuid(), content: test ? test : 'New Task'}
  setColumns({
    ...columns,
    [columnId]: {
      ...currentColumn,
      items: [
        ...currentColumn.items,
        newItem
      ]
    }
  })
}

const Home: NextPage = () => {
  const [columns, setColumns] = useState<IData>(columnsFromBackend)
  const [isBrowser, setIsBrowser] = useState<boolean>(false);

  useEffect(() => {
    setIsBrowser(process.browser);
  }, [])

  return (
    <>
      <Head>
        <title> Kanban App </title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {
        isBrowser ? (
          <main className={s.table}>
            <DragDropContext onDragEnd={(result: any) => onDragEnd(result, columns, setColumns)}>
              {Object.entries(columns).map(([ columnId, column ]) => (
                <div key={columnId} className={s.column__ctn}>
                  <div className={s.head}>
                    <h2>{column.name}</h2>
                    <TaskForm onClick={(test) => addTaskToColumn(columnId, columns, setColumns, test)} />
                  </div>
                  <Droppable droppableId={columnId}>
                    {
                      (provided: any) =>
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
                                    (provided: any) =>
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

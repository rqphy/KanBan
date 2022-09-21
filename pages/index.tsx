import type { NextPage } from 'next'
import Head from 'next/head'
import s from "./styles.module.scss"
import cn from "classnames"
import { DragDropContext, Droppable, Draggable, resetServerContext } from 'react-beautiful-dnd'
import { v4 as uuid} from 'uuid'
import { useState, useEffect, Dispatch } from 'react'
import { GetServerSideProps } from "next";

import { Element } from '@components'

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

const handleColumnChange = (result, columns: IData, setColumns: Dispatch<IData>) =>
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

const handleColumnOrder = (result, columns: IData, setColumns: Dispatch<IData>) =>
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

const onDragEnd = (result, columns: IData, setColumns: Dispatch<IData>) =>
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
  const [columns, setColumns] = useState<IData>(columnsFromBackend)
  const [isBrowser, setIsBrowser] = useState<boolean>(false);

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
                <div key={columnId} className={s.column__ctn}>
                  <h2>{column.name}</h2>
                  <Droppable droppableId={columnId}>
                    {
                      (provided) =>
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
                                    (provided) =>
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

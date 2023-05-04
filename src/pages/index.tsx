import Layout from '@/components/Layout'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { DragHandle as DragHandleIcon, Delete, Edit, Add } from '@mui/icons-material'
import { useEffect, useState } from 'react'
import { IconButton } from '@mui/material'
import { useRouter } from 'next/router'
import { Question, deleteQuestion, getList, updateOrder } from '@/api/question.api'

export default function HomePage() {
  const { push } = useRouter()

  const [isBrowser, setIsBrowser] = useState(false)
  const [items, setItems] = useState<Question[]>([])

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const newItems = [...items]
    const [removed] = newItems.splice(source.index, 1)
    newItems.splice(destination.index, 0, removed)

    handleUpdateorder(newItems)
  }

  const handleUpdateorder = (items: Question[]) => {
    const result = updateOrder(items)

    if (result) {
      handleGetList()
    }
  }

  const handleDelete = (question_id: string) => {
    const result = deleteQuestion(question_id)

    if (result) {
      handleGetList()
    }
  }

  const handleGetList = () => {
    const result = getList()

    if (result) {
      setItems(result)
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true)
    }
    handleGetList()
  }, [])

  return (
    <>
      <Layout title='List - Survey Questions'>
        <div className='flex flex-col gap-6 justify-start lg:w-1/2 mx-auto'>
          <div className='flex flex-row justify-between items-start'>
            <h1>📃 List Question</h1>
            <IconButton aria-label='add' color='success' onClick={() => push('/form')}>
              <Add />
            </IconButton>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            {isBrowser ? (
              <Droppable droppableId='my-list'>
                {(provided) => (
                  <ul ref={provided.innerRef} {...provided.droppableProps}>
                    {items.length > 0 &&
                      items.map((item, index) => (
                        <Draggable key={item.id} draggableId={item.id} index={index}>
                          {(provided) => (
                            <li
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              className='px-4 py-6 border border-gray-200 rounded-xl m-2 bg-white flex flex-row gap-6 items-center'
                            >
                              <DragHandleIcon className='text-gray-300' />
                              <div>{item.question}</div>
                              <div className='ml-auto'>
                                <IconButton
                                  aria-label='edit'
                                  color='warning'
                                  onClick={() => push(`/form?question_id=${item.id}`)}
                                >
                                  <Edit />
                                </IconButton>
                                <IconButton
                                  aria-label='delete'
                                  color='error'
                                  onClick={() => handleDelete(item.id)}
                                >
                                  <Delete />
                                </IconButton>
                              </div>
                            </li>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            ) : null}
          </DragDropContext>
          {!items.length && <p className='text-center'>Questions is empty</p>}
        </div>
      </Layout>
    </>
  )
}

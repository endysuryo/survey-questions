import { AnswerOption } from '@/api/question.api'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { DragHandle as DragHandleIcon, Delete, Edit, Add } from '@mui/icons-material'
import { IconButton, TextField } from '@mui/material'
import { useCallback, useEffect, useState } from 'react'

interface IAnswerOption {
  value: AnswerOption[]
  onChange: (e: AnswerOption[]) => void
  error: boolean
}

export default function InputAnswerOption({ value, onChange, error }: IAnswerOption): JSX.Element {
  const [isBrowser, setIsBrowser] = useState(false)

  const handleDragEnd = (result: any) => {
    if (!result.destination) return

    const { source, destination } = result
    const newItems = [...value]
    const [removed] = newItems.splice(source.index, 1)
    newItems.splice(destination.index, 0, removed)

    onChange(newItems)
  }

  const handleAdd = useCallback(() => {
    const newAnswer = {
      id: crypto.randomUUID(),
      answer: '',
    }
    const modifyAnswers = [...value, newAnswer]

    onChange(modifyAnswers)
  }, [onChange, value])

  const handleChangeAnswer = useCallback(
    (answer: string, id: string) => {
      const modifyAnswers = value.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            answer,
          }
        }

        return item
      })

      onChange(modifyAnswers)
    },
    [onChange, value],
  )

  const handleDeleteAnswer = useCallback(
    (id: string) => {
      const filterAnswers = value.filter((item) => item.id !== id)

      onChange(filterAnswers)
    },
    [onChange, value],
  )

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsBrowser(true)
    }
  }, [])

  return (
    <>
      <div>
        <div className='flex flex-row justify-between items-start'>
          <div>
            <h4>Answer Options</h4>
            {error && <p className='text-red-500 text-xs'>Required</p>}
          </div>
          <IconButton type='button' aria-label='save' color='success' onClick={handleAdd}>
            <Add />
          </IconButton>
        </div>
        <DragDropContext onDragEnd={handleDragEnd}>
          {isBrowser ? (
            <Droppable droppableId='my-list'>
              {(provided) => (
                <ul ref={provided.innerRef} {...provided.droppableProps}>
                  {value.length > 0 &&
                    value.map((item, index) => (
                      <Draggable key={item.id} draggableId={item.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className='px-2 py-4 border border-gray-200 rounded-xl m-2 bg-white flex flex-row gap-6 items-center'
                          >
                            <DragHandleIcon className='text-gray-300' />
                            <TextField
                              id='answer'
                              label={`Answer ${index + 1}`}
                              variant='outlined'
                              size='small'
                              fullWidth
                              value={item.answer}
                              onChange={(e) => handleChangeAnswer(e.target.value, item.id)}
                            />
                            <div className='ml-auto'>
                              <IconButton
                                aria-label='delete'
                                color='error'
                                onClick={() => handleDeleteAnswer(item.id)}
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
        {!value.length && <p className='text-center'>Answers is empty</p>}
      </div>
    </>
  )
}

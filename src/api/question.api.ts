export interface Question {
  id: string
  question: string
  is_must_select: 0 | 1
  answer_option: AnswerOption[]
}

interface AnswerOption {
  id: string
  answer: string
}

const getQuestionList = (): Question[] => {
  const itemsJson = localStorage.getItem('questions')
  if (!itemsJson) return []
  return JSON.parse(itemsJson)
}

const setQuestionList = (items: Question[]) => {
  localStorage.setItem('questions', JSON.stringify(items))
}

const getList = (): Question[] => {
  return getQuestionList()
}

const getDetail = (id: string): Question | null => {
  const items = getQuestionList()
  const item = items.find((i) => i.id === id)
  return item || null
}

const create = (item: Question): Question => {
  const items = getQuestionList()
  const newQuestion = { ...item, id: crypto.randomUUID() }
  setQuestionList([...items, newQuestion])
  return newQuestion
}

const update = (id: string, item: Question): Question | null => {
  const items = getQuestionList()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return null
  const updatedQuestion = { ...item, id }
  const updatedQuestions = [...items]
  updatedQuestions.splice(index, 1, updatedQuestion)
  setQuestionList(updatedQuestions)
  return updatedQuestion
}

const updateOrder = (items: Question[]) => {
  setQuestionList(items)
  return items
}

const deleteQuestion = (id: string): boolean => {
  const items = getQuestionList()
  const index = items.findIndex((i) => i.id === id)
  if (index === -1) return false
  const updatedQuestions = [...items]
  updatedQuestions.splice(index, 1)
  setQuestionList(updatedQuestions)
  return true
}

export { getList, getDetail, create, update, updateOrder, deleteQuestion }

import { Question, create, getDetail, update } from '@/api/question.api'
import Layout from '@/components/Layout'
import { ArrowBack, Save } from '@mui/icons-material'
import { FormControl, IconButton, InputLabel, MenuItem, Select, TextField } from '@mui/material'
import { useFormik } from 'formik'
import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'
import InputAnswerOption from '@/components/form/InputAnswerOption'

export default function FormPage() {
  const { push, query } = useRouter()
  const { question_id } = query

  const formik = useFormik<Question>({
    initialValues: {
      id: '',
      question: '',
      is_must_select: 0,
      answer_option: [],
    },
    onSubmit: (values) => {
      handleSubmit(values)
    },
    enableReinitialize: true,
    validateOnChange: false,
    validateOnBlur: false,
    validate: (values) => {
      let errors: Partial<{
        question: string
        answer_option: string
      }> = {}

      if (!values.question) {
        errors.question = 'Required'
      }

      if (!values.answer_option.length) {
        errors.answer_option = 'Required'
      }

      return errors
    },
  })

  const handleSubmit = (values: Question) => {
    if (question_id) {
      const result = update(question_id as string, values)

      if (result) {
        return push('/')
      }
    }

    const result = create(values)
    if (result) {
      return push('/')
    }
  }

  const handleGetDetail = useCallback(() => {
    if (question_id) {
      const result = getDetail(question_id as string)

      if (result) {
        console.info('hasilnya', result)
        formik.setValues(result)
      }
    }
  }, [formik, question_id])

  useEffect(() => {
    handleGetDetail()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Layout title='Form - Survey Questions'>
        <form
          className='flex flex-col gap-6 justify-start lg:w-1/2 mx-auto'
          onSubmit={formik.handleSubmit}
        >
          <div className='flex flex-row justify-between items-start'>
            <IconButton type='button' aria-label='back' color='primary' onClick={() => push('/')}>
              <ArrowBack />
            </IconButton>
            <h1>{question_id ? 'Edit' : 'Add'} Question</h1>
            <IconButton type='submit' aria-label='save' color='success'>
              <Save />
            </IconButton>
          </div>
          <TextField
            id='question'
            label='Question'
            variant='outlined'
            fullWidth
            value={formik.values.question}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            error={formik.touched.question && Boolean(formik.errors.question)}
            helperText={formik.touched.question && formik.errors.question}
          />
          <FormControl fullWidth>
            <InputLabel id='demo-simple-select-label'>Must Select</InputLabel>
            <Select
              id='is_must_select'
              variant='outlined'
              value={formik.values.is_must_select}
              label='Must Select'
              onChange={(e) => formik.setFieldValue('is_must_select', e.target.value)}
            >
              <MenuItem value={0}>No</MenuItem>
              <MenuItem value={1}>Yes</MenuItem>
            </Select>
          </FormControl>
          <InputAnswerOption
            value={formik.values.answer_option}
            onChange={(e) => formik.setFieldValue('answer_option', e)}
            error={Boolean(formik.errors.answer_option)}
          />
        </form>
      </Layout>
    </>
  )
}

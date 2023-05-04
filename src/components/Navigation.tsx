import { useRouter } from 'next/router'

export default function Navigation(): JSX.Element {
  const { push } = useRouter()

  return (
    <>
      <nav className='p-5 sticky top-0 bg-blue-800 z-[999]'>
        <h1 className='text-white text-2xl cursor-pointer' onClick={() => push('/')}>
          📝 Survey Questions
        </h1>
      </nav>
    </>
  )
}

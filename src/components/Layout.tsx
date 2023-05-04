import { ReactNode, useEffect, useState } from 'react'
import Head from 'next/head'
import Navigation from './Navigation'

interface ILayout {
  title: string
  children: ReactNode
}

export default function Layout({ title, children }: ILayout): JSX.Element {
  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <main className='relative'>
        <Navigation />
        <div className='p-10 md:p-16'>{children}</div>
      </main>
    </>
  )
}

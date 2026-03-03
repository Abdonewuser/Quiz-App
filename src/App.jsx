import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Cards from './component/Cards'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Homepage from './component/Homepage'
import Quiz from './component/Quiz'





function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Cards />
    },
    {
      path: "quiz/:id",
      element: <Quiz />
    }
  ])

  // 

  /** To get the number of questions in a category: https://opentdb.com/api_count.php?category=9
 {
  "category_id": 9,
  "category_question_count": {
    "total_question_count": 469,
    "total_easy_question_count": 215,
    "total_medium_question_count": 177,
    "total_hard_question_count": 77
    } 
  }
   */

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App

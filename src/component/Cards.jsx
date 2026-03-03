import React, { useEffect, useState } from 'react'
import { NavLink } from "react-router-dom"
import './Cards.css'

const QuizCards = () => {
    const [cards, setCards] = useState([])

    async function getCards() {
        try {
            const url = "https://opentdb.com/api_category.php";
            const response = await fetch(url);
            if (!response.ok) throw new Error("Internal Server Error")
            const data = await response.json()
            if (data.error) throw new Error(data.error.message);
            setCards(data.trivia_categories);
        }
        catch (err) {
            console.error(err.message)
        }
    }

    useEffect(() => { getCards() }, [])

    return (
        <div className="quiz-page">
            <header className="quiz-header">
                <h1 className="quiz-title">TRIVIA CHALLENGE</h1>
                <p className="quiz-subtitle">Pick your category</p>
            </header>
            <div className="quiz-grid">
                {cards.map((i, index) => (
                    <NavLink
                        key={i.id}
                        to={`/quiz/${i.id}`}
                        className={({ isActive }) => `quiz-link${isActive ? ' active' : ''}`}
                        style={{ '--i': index }}
                    >
                        <div className="quiz-card">
                            <span className="quiz-card-number">{String(index + 1).padStart(2, '0')}</span>
                            <div className="quiz-card-name-wrapper">
                                <span className="quiz-card-name">{i.name}</span>
                            </div>
                            <span className="quiz-card-arrow">→</span>
                        </div>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default QuizCards
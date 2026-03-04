import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom'
import "./Quiz.css"


const Quiz = () => {
    // Here we are getting the id, which is also the category number to be used in the api
    const params = useParams();
    const quizRef = useRef(null);
    const [data, setData] = useState([]);

    const {
        register,
        handleSubmit
    } = useForm()
    const [currentIndex, setCurrentIndex] = useState(0)
    const [score, setScore] = useState(0)
    const [tapped, setTapped] = useState(false)

    // I am using to add animation when the section is scrolled to.
    // useEffect(() => {
    //     const sections = document.querySelectorAll(".section");

    //     const observer = new IntersectionObserver((entries) => {
    //         // Used a for loop because entries is an array.
    //         entries.forEach((entry) => {
    //             if (entry.isIntersecting) {
    //                 // TODO: Add show class to the section
    //             }
    //         })
    //     }, { threshold: 0.3 });

    //     // Setting the observer on each section
    //     sections.forEach((section) => {
    //         observer.observe(section);
    //     })
    //     return () => {
    //         observer.disconnect();
    //     }
    // }, []);

    // Function to handle submit click
    function onSubmit(data) {
        const amount = data.amount;
        const category = params.id;
        const diffcuilty = data.diffcuilty;
        const type = data.type;
        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${diffcuilty}&type=${type}`;
        getData(url)

        // To scroll to the quiz section
        quizRef.current.scrollIntoView({ behaviour: "smooth" });

        // Set data in quiz section

    }

    function getOptions(question) {
        /**
         * {
        "type": "multiple",
        "difficulty": "easy",
        "category": "General Knowledge",
        "question": "Why is the night sky dark? ",
        "correct_answer": "The universe is finite in age and size",
        "incorrect_answers": [
        "Dust clouds absorb light ",
        "Redshift doesn&#039;t let us see distant stars ",
        "Quantum mechanics"
            ]
        }
         */
        let option = [...question.incorrect_answers, question.correct_answer];
        return option.sort(() => Math.random() - 0.5);
        // return option;

    }

    function handleAnswer(option, e) {
        if (tapped) return;

        // To avoid double tap
        setTapped(true);
        if (option === data[currentIndex].correct_answer) {
            setScore(prev => prev + 1);
        } else {
            // Todo: Disable all the buttons in case of wrong and also change the e.target background color to red
            setScore(prev => prev - 1);
        }


    }
    function handleNext() {
        setTapped(false);
        setCurrentIndex(prev => prev + 1);
        // TODO: Enable all the buttons again
    }

    async function getData(url) {
        console.log(url)
        try {
            const res = await fetch(url);
            if (!res.ok) { throw new Error("Internal Server Error") }
            const data = await res.json();
            console.log(data.results);
            setData(data.results);
        } catch (err) {
            console.error(err.message);
        }
    }


    return (
        <div>
            <section className='quiz-form-section'>
                <div className="quiz-form-category-id">Select diffcuilty</div>
                <form className="quiz-form" onSubmit={handleSubmit(onSubmit)}>
                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Number of Questions</label>
                        <input
                            className="quiz-form-input"
                            type='number'
                            defaultValue="10"
                            placeholder='Number of Questions'
                            min={2}
                            max={50}
                            {...register("amount")}
                        />
                    </div>

                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Difficulty</label>
                        <select className="quiz-form-select" {...register("diffcuilty")}>
                            <option value={"easy"}>Easy</option>
                            <option value={"medium"}>Medium</option>
                            <option value={"hard"}>Hard</option>
                        </select>
                    </div>

                    <div className="quiz-form-group">
                        <label className="quiz-form-label">Question Type</label>
                        <select className="quiz-form-select" {...register("type")}>
                            <option value={"multiple"}>Multiple Choice</option>
                            <option value={"boolean"}>True / False</option>
                        </select>
                    </div>

                    <input className="quiz-form-submit" type="submit" value="Start Quiz →" />
                </form>
            </section>

            <section ref={quizRef} className='quiz-section'>

                {/* Loading */}
                {data.length === 0 && (
                    <div className="quiz-loading">
                        <span className="quiz-loading-dot" />
                        <span className="quiz-loading-dot" />
                        <span className="quiz-loading-dot" />
                    </div>
                )}

                {/* Score screen */}
                {data.length > 0 && currentIndex >= data.length && (
                    <div className="quiz-score-screen">
                        <p className="quiz-score-label">Final Score</p>
                        <h2 className="quiz-score-value">{score}<span>/{data.length}</span></h2>
                        <p className="quiz-score-sub">{score >= data.length * 0.7 ? '🏆 Great job!' : '📚 Keep practicing!'}</p>
                    </div>
                )}

                {/* Question */}
                {data.length > 0 && currentIndex < data.length && (
                    <div className="quiz-card-wrap">
                        <div className="quiz-progress-bar">
                            <div
                                className="quiz-progress-fill"
                                style={{ width: `${((currentIndex) / data.length) * 100}%` }}
                            />
                        </div>
                        <p className="quiz-counter">{currentIndex + 1} / {data.length}</p>
                        <p className="quiz-question">{data[currentIndex].question}</p>
                        <div className="quiz-options">
                            {getOptions(data[currentIndex]).map((option, index) => (
                                <button
                                    key={index}
                                    className="quiz-option-btn"
                                    onClick={(e) => handleAnswer(option, e)}
                                >
                                    <span className="quiz-option-letter">{String.fromCharCode(65 + index)}</span>
                                    <span className="quiz-option-text">{option}</span>
                                </button>
                            ))}
                        </div>
                        {tapped && (
                            <button className="quiz-next-btn" onClick={handleNext}>
                                Next Question →
                            </button>
                        )}
                    </div>
                )}

            </section>



        </div>
    )
}

export default Quiz
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom'
import "./Quiz.css"


const Quiz = () => {
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
    const [answeredOption, setAnsweredOption] = useState(null) // claude changed this
    const [options, setOptions] = useState([])

    // useEffect(() => {
    //     const sections = document.querySelectorAll(".section");

    //     const observer = new IntersectionObserver((entries) => {
    //         entries.forEach((entry) => {
    //             if (entry.isIntersecting) {
    //                 // TODO: Add show class to the section
    //             }
    //         })
    //     }, { threshold: 0.3 });

    //     sections.forEach((section) => {
    //         observer.observe(section);
    //     })
    //     return () => {
    //         observer.disconnect();
    //     }
    // }, []);

    useEffect(() => {
        if (data.length > 0 && currentIndex < data.length) {
            const opts = [...data[currentIndex].incorrect_answers, data[currentIndex].correct_answer]
            setOptions(opts.sort(() => Math.random() - 0.5))
        }
    }, [currentIndex, data])

    function onSubmit(data) {
        const amount = data.amount;
        const category = params.id;
        const diffcuilty = data.diffcuilty;
        const type = data.type;
        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${diffcuilty}&type=${type}`;
        getData(url)
        quizRef.current.scrollIntoView({ behaviour: "smooth" });
        console.log(currentIndex)
    }

    // claude changed this
    function handleAnswer(option) {
        if (tapped) return;
        setTapped(true);
        setAnsweredOption(option); // claude changed this

        if (option === data[currentIndex].correct_answer) {
            setScore(prev => prev + 1);
        }
    }

    // claude changed this
    function handleNext() {
        setTapped(false);
        setAnsweredOption(null); // claude changed this
        setCurrentIndex(prev => prev + 1);
    }

    function restart() {
        setCurrentIndex(0);
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

                {data.length === 0 && (
                    <div className="quiz-loading">
                        <span className="quiz-loading-dot" />
                        <span className="quiz-loading-dot" />
                        <span className="quiz-loading-dot" />
                    </div>
                )}

                {data.length > 0 && currentIndex >= data.length && (
                    <div className="quiz-score-screen">
                        <p className="quiz-score-label">Final Score</p>
                        <h2 className="quiz-score-value">{score}<span>/{data.length}</span></h2>
                        <p className="quiz-score-sub">{score >= data.length * 0.7 ? '🏆 Great job!' : '📚 Keep practicing!'}</p>
                        <button className="quiz-restart-btn" onClick={restart}>Restart Quiz ↺</button>
                    </div>
                )}

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

                        {/* claude changed this — added disabled, correct, wrong classes */}
                        <div className="quiz-options">
                            {options.map((option, index) => (
                                <button
                                    key={index}
                                    className={`quiz-option-btn ${tapped // After user has selected an answer...
                                        ? option === data[currentIndex].correct_answer
                                            ? 'correct'         // ...always highlight the correct answer in green
                                            : option === answeredOption
                                                ? 'wrong'       // ...highlight what the user picked in red (if wrong)
                                                : 'dimmed'      // ...fade out all other irrelevant options
                                        : ''                    // Before any selection: no extra classes
                                        }`}
                                    onClick={() => handleAnswer(option)}
                                    disabled={tapped} // claude changed this
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
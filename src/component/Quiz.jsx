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
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    // I am using to add animation when the section is scrolled to.
    useEffect(() => {
        const sections = document.querySelectorAll(".section");

        const observer = new IntersectionObserver((entries) => {
            // Used a for loop because entries is an array.
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    // TODO: Add show class to the section
                }
            })
        }, { threshold: 0.3 });

        // Setting the observer on each section
        sections.forEach((section) => {
            observer.observe(section);
        })
        return () => {
            observer.disconnect();
        }
    }, []);

    // Function to handle submit button click
    function onSubmit(data) {
        const amount = data.amount;
        const category = params.id;
        const diffcuilty = data.diffcuilty;
        const type = data.type;
        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${diffcuilty}&type=${type}`;
        getData(url)

        // To scroll to the quiz section
        quizRef.current.scrollIntoView({ behaviour: "smooth" });
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
                            min={5}
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

            <section ref={quizRef} className='quiz' style={{ height: "100vh", backgroundColor: "#6310c2ff" }} >
                <p style={{}}>{`I am data ${data[0].type}`}</p>
            </section>



        </div>
    )
}

export default Quiz
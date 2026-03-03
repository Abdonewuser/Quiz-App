import React from 'react'
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom'


const Quiz = () => {
    // Here we are getting the id, which is also the category number to be used in the api
    const params = useParams();
    const {
        register,
        handleSubmit,
        watch,
        formState: { errors },
    } = useForm()

    function onSubmit(data) {
        const amount = data.amount;
        const category = params.id;
        const diffcuilty = data.diffcuilty;
        const type = data.type;

        const url = `https://opentdb.com/api.php?amount=${amount}&category=${category}&difficulty=${diffcuilty}&type=${type}`;

        getData(url)
    }
    async function getData(url) {
        console.log(url)
        try {
            const res = await fetch(url);
            if (!res.ok) { throw new Error("Internal Server Error") }
            const data = await res.json();
            console.log(data.results);

        } catch (err) {
            console.error(err.message);
        }
    }
    // console.log(watch("example")) // watch input value by passing the name of it

    return (
        <div>
            {/* This div is for test */}
            <div>This is the id{params.id}</div>
            {/* Create a proper CSS for this */}
            <form onSubmit={handleSubmit(onSubmit)}>

                <input type='number' defaultValue="10" placeholder='Number of Questions' min={5} max={50} {...register("amount")} />


                <select {...register("diffcuilty")}>
                    <option value={"easy"}>Easy</option>
                    <option value={"medium"}>Medium</option>
                    <option value={"hard"}>Hard</option>
                </select>

                <select {...register("type")}>
                    <option value={"multiple"}>Multiple Choice</option>
                    <option value={"boolean"}>True/False</option>
                </select>


                <input type="submit" />
            </form>

        </div>
    )
}

export default Quiz
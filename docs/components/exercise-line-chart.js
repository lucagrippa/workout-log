import * as Plot from "npm:@observablehq/plot";
import * as d3 from "npm:d3";

export function calculateMaxWeightPerExercisePerDay(workouts) {
    // maxWeightExercisePerDay is an array of objects with the date, exercise, and weight of the highest weight lifted per exercise per day
    const maxWeightPerExercisePerDay = []
    for (const date in workouts) {
        // iterate through each set in a workout and find the set with the highest weight lifted per exercise
        const maxWeightPerExercise = workouts[date].reduce((acc, workout) => {
            const key = workout.exercise;
            if (!acc[key] || acc[key] < workout.weight) {
                acc[key] = workout.weight;
            }
            return acc;
        }, {});

        // push the date, exercise, and weight of the highest weight lifted per exercise per day into the maxWeightPerExercisePerDay array
        for (const exercise in maxWeightPerExercise) {
            maxWeightPerExercisePerDay.push({ date, exercise, type: "maximum", weight: maxWeightPerExercise[exercise] });
        }

        // sort the maxWeightPerExercisePerDay array by date
        maxWeightPerExercisePerDay.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
    }

    return maxWeightPerExercisePerDay
}

export function calculateAverageWeightPerExercisePerDay(workouts) {
    // aExercisePerDay is an array of objects with the date, exercise, and weight of the highest weight lifted per exercise per day
    const averageWeightPerExercisePerDay = []
    for (const date in workouts) {
        // iterate through each set in a workout and calculate the average weight lifted per exercise
        const averageWeightPerExercise = workouts[date].reduce((acc, workout) => {
            const key = workout.exercise;
            if (!acc[key]) {
                acc[key] = { totalWeight: workout.weight, count: 1 };
            } else {
                acc[key].totalWeight += workout.weight;
                acc[key].count++;
            }
            return acc;
        }
        , {});

        // push the date, exercise, and weight of the average weight lifted per exercise per day into the averageWeightPerExercisePerDay array
        for (const exercise in averageWeightPerExercise) {
            averageWeightPerExercisePerDay.push({ date, exercise, type: "average", weight: averageWeightPerExercise[exercise].totalWeight / averageWeightPerExercise[exercise].count });
        }

        // sort the averageWeightPerExercisePerDay array by date
        averageWeightPerExercisePerDay.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
        });
    }

    return averageWeightPerExercisePerDay
}

export function capitalizeWords(str) {
    // Split the string into an array of words
    let words = str.split(" ");
    
    // Capitalize the first letter of each word
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }
    
    // Join the words back together
    return words.join(" ");
}

export function exerciseLineChart(workouts, exercise, color, { width }) {
    // get the max weight lifted per exercise per day
    const maxWeightPerExercisePerDay = calculateMaxWeightPerExercisePerDay(workouts)
        .filter(workout => workout.exercise === exercise);

    const averageWeightPerExercisePerDay = calculateAverageWeightPerExercisePerDay(workouts)
        .filter(workout => workout.exercise === exercise);
    
    // combine the max and average weight arrays
    const weightPerExercisePerDay = maxWeightPerExercisePerDay.concat(averageWeightPerExercisePerDay);
        
    // uppercase the first letter of every word in the exercise name
    const exerciseName = capitalizeWords(exercise)
    
    // get the max and min values of the weight lifted for the exercise
    // const maxWeight = Math.max(...maxWeightPerExercisePerDay.map(workout => workout.weight));
    const maxWeight = Math.max(...weightPerExercisePerDay.map(workout => workout.weight));
    // const minWeight = Math.min(...maxWeightPerExercisePerDay.map(workout => workout.weight));
    const minWeight = Math.min(...weightPerExercisePerDay.map(workout => workout.weight));
    
    // calulate the min and max domain of the y-axis, adding 15% padding to the min and max values
    const yMinDomain = minWeight - (minWeight * 0.15);
    const yMaxDomain = maxWeight + (maxWeight * 0.15);
    
    // convert the date string to a Date object
    // maxWeightPerExercisePerDay.forEach(workout => workout.date = new Date(workout.date));
    // maxWeightPerExercisePerDay.forEach(workout => {
    //     const dateParts = workout.date.split('/');
    //     const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Year, Month (0-indexed), Day
    //     workout.date = date;
    // });
    weightPerExercisePerDay.forEach(workout => {
        const dateParts = workout.date.split('/');
        const date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]); // Year, Month (0-indexed), Day
        workout.date = date;
    });
    // calculate the min and max domain of the x-axis, plus 1 day padding on each side
    const xMinDomain = d3.utcDay.offset(d3.min(weightPerExercisePerDay, d => d.date), -2);
    const xMaxDomain = d3.utcDay.offset(d3.max(weightPerExercisePerDay, d => d.date), 1);

    return Plot.plot({
        title: exerciseName,
        width,
        height: 300,
        marginBottom: 30,
        grid: true,
        // x: { domain: [xMinDomain, xMaxDomain], label: "Date", ticks: 5, tickFormat: "%b %d"},
        x: { domain: [xMinDomain, xMaxDomain], label: "Date", interval: d3.utcDay, ticks: 6, tickFormat: "%b %d" },
        // x: { grid: true, domain: [xMinDomain, xMaxDomain], label: "Date", interval: d3.utcDay, tickFormat: "%b %d"},
        y: { domain: [yMinDomain, yMaxDomain], label: "Exercise Weight (lb)" },
        color: { legend: true },
        marks: [
            Plot.ruleY([yMinDomain]),
            // Plot.lineY(maxPoundageWorkouts, {x: "date", y: "poundage", stroke: "exercise"})
            Plot.areaY(
                maxWeightPerExercisePerDay,
                {
                    x: "date",
                    y: "weight",
                    y1: yMinDomain,
                    stroke: color.apply(exercise),
                    // stroke: "exercise",
                    fill: color.apply(exercise),
                    // fill: "exercise",
                    fillOpacity: 0.2
                }),
            Plot.lineY(
                weightPerExercisePerDay, {
                x: "date",
                y: "weight",
                stroke: color.apply(exercise),
                stroke: "type",
                // interval: "day",
                marker: "circle-stroke",
                tip: {
                    format: {
                        y: (d) => `${d}lb`,
                        exercise: false,
                    }
                }
            }),
            // Plot.lineY(
            //     averageWeightPerExercisePerDay, {
            //     x: "date",
            //     y: "weight",
            //     stroke: color.apply("blue"),
                // stroke: "exercise",
                // interval: "day",
                // marker: "circle-stroke",
                // tip: {
                //     format: {
                //         y: (d) => `${d}lb`,
                //         exercise: false,
                //     }
                // }
            // })
        ]
    })
}

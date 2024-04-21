---
theme: dashboard
title: Leg day exercises
toc: false
---

<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<div class="flex flex-col font-sans">
  <h1 class="py-4 font-bold text-4xl">Leg day exercises 🏋️‍♂️</h1>
  <h2 class="font-normal text-xl not-italic">Progress for all exercises I perform on leg day</h2>
</div>

<!-- Imports -->
```js
import { exerciseLineChart } from "./components/exercise-line-chart.js";
```

<!-- Load and transform data -->
```js
const sets = FileAttachment("data/sets.json").json();
const workouts = FileAttachment("data/workouts.json").json();
const exercises = [
    "squat",
    "single-leg press",
    "dumbbell romanian deadlift",
    "single-leg lying leg curl",
    "glute bridge machine",
    "seated calf raises",
]
```

<!-- A shared color scale for consistency -->
```js
const color = Plot.scale({color: {scheme: "Tableau10", domain: exercises}});
// Observable10
```

<div class="grid grid-cols-1 md:grid-cols-2">
  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercises[0], color, {width}))}
  </div>

  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercises[1], color, {width}))}
  </div>

  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercises[2], color, {width}))}
  </div>

  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercises[3], color, {width}))}
  </div>

  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercises[4], color, {width}))}
  </div>

  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercises[5], color, {width}))}
  </div>
</div>











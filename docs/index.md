---
theme: dashboard
title: Weightlifting dashboard
toc: false
---
<head>
  <script src="https://cdn.tailwindcss.com"></script>
</head>

<div class="flex flex-col font-sans">
  <h1 class="py-4 font-bold text-4xl">Weightlifting dashboard 💪</h1>
  <h2 class="font-normal text-xl not-italic">Get quick stats on all of the exercises I'm performing at the gym.</h2>
</div>

<!-- Imports -->
```js
import { inject } from 'npm:@vercel/analytics';
import { calculateStreak, calculateDaysExercisedThisWeek, calculateDaysExercisedThisMonth, calculateDaysExercisedThisYear, calculatePRs } from "./components/calculate.js";
import { exerciseLineChart, capitalizeWords } from "./components/exercise-line-chart.js";
```

<!-- Vercel Analytics -->
```js
inject();
```

<!-- Load and transform data -->
```js
const sets = FileAttachment("data/sets.json").json();
const workouts = FileAttachment("data/workouts.json").json();
const target = 3
```

<!-- A shared color scale for consistency, sorted by the number of launches -->
```js
// const color = Plot.scale({
//   color: {
//     type: "categorical",
//     domain: d3.groupSort(launches, (D) => -D.length, (d) => d.state).filter((d) => d !== "Other"),
//     unknown: "var(--theme-foreground-muted)"
//   }
// });
```

<!-- A shared color scale for consistency -->
```js
// select all unique exercise names from sets
const exercises = Array.from(new Set(sets.map((d) => d.exercise)));
const color = Plot.scale({color: {scheme: "Tableau10", domain: exercises}});
// Observable10
```

<!-- Calculate workout streak -->
```js
const streak = calculateStreak(workouts, target)
const daysExercisedThisWeek = calculateDaysExercisedThisWeek(workouts)
const daysExercisedThisMonth = calculateDaysExercisedThisMonth(workouts)
const daysExercisedThisYear = calculateDaysExercisedThisYear(workouts)
```

<!-- Display workout streak on a card with big numbers -->
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
  <div class="card">
    <h2>Workout Streak 🔥</h2>
    <span class="big">${streak} weeks</span>
  </div>
  <div class="card">
    <h2>Days exercised this week</h2>
    <span class="big">${daysExercisedThisWeek}</span>
  </div>
  <div class="card">
    <h2>Days exercised this month</h2>
    <span class="big">${daysExercisedThisMonth}</span>
  </div>
  <div class="card">
    <h2>Days exercised this year</h2>
    <span class="big">${daysExercisedThisYear}</span>
  </div>
</div>

<!-- Caluclate and display PRs as a table -->
```js
const prs = calculatePRs(sets)
```

<div class="grid grid-cols-1">
  <div class="card">
    <h1 class="pb-3 font-sans font-semibold text-lg">Personal Records</h1>
    <div class="border border-neutral-300 dark:border-neutral-700">
      ${Inputs.table(prs, {
        columns: [
          "exercise",
          "weight",
          "reps",
          // "notes"
        ],
        header: {
          exercise: "Exercise",
          weight: "Weight (lb)",
          reps: "Repititions",
          // notes: "Notes"
        },
        sort: "weight",
        reverse: true,
        align: {
          exercise: "left",
          weight: "center",
          reps: "center",
          // notes: "center"
        },
        format: {
          exercise: (d) => capitalizeWords(d),
        }
      })}
    </div>
  </div>
</div>


<!-- Display exercise line chart with inputs -->
```js
const exercise = view(
  Inputs.select(
    sets.map((d) => d.exercise),
    {sort: true, unique: true, label: "Exercise"}
  )
);
```

<div class="grid grid-cols-1">
  <div class="card">
    ${resize((width) => exerciseLineChart(workouts, exercise, color, {width}))}
  </div>
</div>

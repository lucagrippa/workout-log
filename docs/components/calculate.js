
/**
 * Calculates the streak of workouts based on the provided workouts and target.
 *
 * @param {Object} workouts - The workouts object containing workout dates as keys.
 * @param {number} target - The target number of workouts per week.
 * @returns {number} - The streak of consecutive weeks with at least the target number of workouts.
 */
export function calculateStreak(workouts, target) {
    // return the current week number of the year.
    Date.prototype.getWeek = function() {
        let onejan = new Date(this.getFullYear(), 0, 1)
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7)
    }
    
    let workoutDates = Object.keys(workouts)

    // remove workout dates that are in the current week
    let today = new Date()
    let week = today.getWeek()
    workoutDates = workoutDates.filter(workoutDate => {
        return new Date(workoutDate).getWeek() !== week
    })

    let streak = 0
    let weeks = {}
    for (let i = 0; i < workoutDates.length; i++) {
        // convert the date string to a date object
        let date = new Date(workoutDates[i])
        // get the week number of the year
        let week = date.getWeek()

        // if the week number is in the weeks object, increment the count
        if (weeks[week]) {
            weeks[week]++
        } else {
            // if the week number is not in the weeks object, set the count to 1
            weeks[week] = 1
        }
    }

    // iterate over the weeks object and increment the streak if the count is greater than or equal to the target
    for (let week in weeks) {
        if (weeks[week] >= target) {
            streak++
        } else {
            break
        }
    }

    return streak
}


export function calculateDaysExercisedThisWeek(workouts) {
    let workoutDates = Object.keys(workouts)
    let days = {}
    let today = new Date()
    let week = today.getWeek()

    for (let i = 0; i < workoutDates.length; i++) {
        let date = new Date(workoutDates[i])
        let day = date.getDay()

        if (date.getWeek() === week) {
            days[day] = true
        }
    }
    return Object.keys(days).length
}

export function calculateDaysExercisedThisMonth(workouts) {
    let workoutDates = Object.keys(workouts)
    let days = {}
    let today = new Date()
    let month = today.getMonth()

    for (let i = 0; i < workoutDates.length; i++) {
        let date = new Date(workoutDates[i])

        if (date.getMonth() === month) {
            days[date] = true
        }
    }
    return Object.keys(days).length
}

export function calculateDaysExercisedThisYear(workouts) {
    let workoutDates = Object.keys(workouts)
    let days = {}
    let today = new Date()
    let year = today.getFullYear()

    for (let i = 0; i < workoutDates.length; i++) {
        let date = new Date(workoutDates[i])

        if (date.getFullYear() === year) {
            days[date] = true
        }
    }
    return Object.keys(days).length
}

export function calculatePRs(set) {
    let prs = {}
    for (let i=0; i < set.length; i++) {
        let exercise = set[i].exercise
        let weight = set[i].weight
        if (prs[exercise]) {
            if (weight > prs[exercise]["weight"]) {
                prs[exercise] = {
                    weight: weight,
                    reps: set[i].reps,
                    unit: set[i].unit,
                    notes: set[i].notes
                }
            }
        } else {
            prs[exercise] = {
                weight: weight,
                reps: set[i].reps,
                unit: set[i].unit,
                notes: set[i].notes
            }
        }
    }
    // convert the prs object to an array of objects
    let prArray = []
    for (let exercise in prs) {
        prArray.push({
            exercise: exercise,
            weight: prs[exercise].weight,
            reps: prs[exercise].reps,
            unit: prs[exercise].unit,
            notes: prs[exercise].notes
        })
    }

    // if notes contains just the word "each", double the weight
    for (let i=0; i < prArray.length; i++) {
        if (prArray[i].notes === "each") {
            prArray[i].weight *= 2
        }
    }

    return prArray
}
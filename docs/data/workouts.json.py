import os
import sys
import json

from fitdown_parser import parse

# Load all workouts
workouts_folder = "docs/data/workouts"
workouts = os.listdir(workouts_folder)

all_exercises = {}
for workout in workouts:
    # Extract the date from the filename
    workout_date = workout.split(".")[0]
    # Replace the dashes with slashes to fix javascript date parsing
    workout_date = workout_date.replace("-", "/")

    # Read the workout file
    workout_file = os.path.join(workouts_folder, workout)
    with open(workout_file, "r") as file:
        file_content = file.read()

    # Parse the workout file
    workout_data = parse(file_content)
    
    all_exercises[workout_date] = workout_data

json.dump(all_exercises, sys.stdout)

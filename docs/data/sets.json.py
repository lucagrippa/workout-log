import os
import sys
import json

from fitdown_parser import parse

# Load all workouts
workouts_folder = "docs/data/workouts"
workouts = os.listdir(workouts_folder)

all_exercises = []
for workout in workouts:
    workout_file = os.path.join(workouts_folder, workout)
    
    with open(workout_file, "r") as file:
        workout_content = file.read()

    # Parse the workout file
    workout_data = parse(workout_content)
    
    all_exercises.extend(workout_data)

json.dump(all_exercises, sys.stdout)

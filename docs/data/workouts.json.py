import os
import sys
import json

# import the fitdown parser like this due to dash in the module name
# import importlib  
# fitdown = importlib.import_module("fitdown-py.fitdown_parser")

import importlib.util
# import sys

# # Add the parent directory to the sys.path
# sys.path.append("..")

# Import the module
spec = importlib.util.spec_from_file_location("fitdown_parser", "docs/data/fitdown-py/fitdown_parser.py")
fitdown_parser = importlib.util.module_from_spec(spec)
spec.loader.exec_module(fitdown_parser)

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
    workout_data = fitdown_parser.parse(file_content)
    
    all_exercises[workout_date] = workout_data

json.dump(all_exercises, sys.stdout)

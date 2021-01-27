
function BuildWorkoutMessage(workout, weights) {
    var ret = "";
    var config = ReadInNamedRangeInverse("Config");
    ret = ret + workout["Name"] + " - set of: " + workout["Set"];
    for (var i = 0; i < 6; i++) {
      var reps = 10 - i * 2 >= workout["Set"] ? 10 - i * 2 : workout["Set"]; 
      ret = ret + "\n" + "Set-" + (i + 1) + ": " + reps + " " + find(config, "DEFAULT_UNIT")["Value"] + " at " + weights[i] + " lbs";
    }
    return ret;
  }
  
  function BuildMainWorkout() {
    var workoutAverages = ReadInNamedRangeInverse("WorkoutAverages");
    var workout = GetMainWorkout();
    var weights = [];
    var index = 0;
    if (workout["Set"] == "MAX") {
      return workout["Name"] + " beat previous max of " + workout["Max"] + " lbs"
    }
    for (var i = 0; i < 6; i++) {
      if (workout["Set"] == workoutAverages[i]["Name"]) {
        index = i;
        break;
      }
    }
    for (var i = 1; i <= 6; i++) {
      var av = workoutAverages[index][i];
      weights.push(RoundTo5(parseFloat(av) * workout["Max"]));
    }
  
    var ret = BuildWorkoutMessage(workout, weights);
    return ret;
  }
  
  function GetMainWorkout() {
    var mainWorkouts = ReadInNamedRange("MainWorkouts");
    var index = null;
    mainWorkouts.forEach((obj, i) => {
      if (obj["Iterator"] == 1) {
        WriteNamedRange("MainWorkouts", obj["Name"], "Iterator", 0);
        index = i;
      }
    });
    index = (index + 1) % mainWorkouts.length;
    WriteNamedRange("MainWorkouts", mainWorkouts[index]["Name"], "Iterator", 1);
    WriteNamedRange("MainWorkouts", mainWorkouts[index]["Name"], "Set", GetNextSet(mainWorkouts[index]["Set"]));
    var ret = mainWorkouts[index];
    return ret; 
  }
  
  function RoundTo5(number) {
    return 5 * Math.round(number / 5);
  }
  
  function GetNextSet(set) {
    if (set == 10) return 8;
    if (set == 8) return 6;
    if (set == 6) return 4;
    if (set == 4) return 2;
    if (set == 2) return 1;
    if (set == 1) return "MAX";
    if (set == "MAX") return 10;
  }
  
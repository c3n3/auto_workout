
function BuildAuxWorkoutMessage(supWorkout) {
    var val = supWorkout["Name"] + "\n";
    var config = ReadInNamedRangeInverse("Config");
    var unit  = "";
    if (supWorkout["Units"] == "") {
      unit = find(config, "DEFAULT_UNIT")["Value"];
    } else {
      unit = supWorkout["Units"];
    }
    val = val + supWorkout["Sets"] + " sets with " + supWorkout["Count"] + " " + unit + "\n\n";
    return val;
  }
  
  function BuildAux() {
    var config = ReadInNamedRangeInverse("Config");
    var numWorkoutsSup = find(config, "NUMBER_SUP_WORKOUTS")["Value"];
    var numWorkoutsVariationSup = find(config, "NUMBER_SUP_WORKOUTS_VARIATION")["Value"];
    var numWorkoutsOFB = find(config, "NUMBER_OUT_OF_BED_WORKOUTS")["Value"];
    var numWorkoutsVariationOFB = find(config, "NUMBER_OUT_OF_BED_WORKOUTS_VARIATION")["Value"];
    var ret =  "Sup workouts:\n" + BuildAuxWorkout("SupWorkouts", numWorkoutsSup, numWorkoutsVariationSup) + "-----------------------------\nOut of bed workouts:\n" + BuildAuxWorkout("OutOfBedWorkouts", numWorkoutsOFB, numWorkoutsVariationOFB);
    Logger.log(ret);
    return ret;
  }
  
  function BuildAuxWorkout(name, numWorkouts, numWorkoutsVariation) {
    var config = ReadInNamedRangeInverse("Config");
  
    var workouts = GetAuxWorkouts(numWorkouts, numWorkoutsVariation, name);
    var ret = "";
    GetMods();
    workouts.forEach(w => {
      this.mods.forEach(mod => {
        w["Count"] = Math.round(parseFloat(w["Count"]) * parseFloat(mod["PercentBoost"]));
      });
      ret = ret + BuildAuxWorkoutMessage(w);
    });
    return ret;
  }
  
  function GetAuxWorkouts(numWorkouts, numWorkoutsVariation, name) {
    var finalNum = GetVariation(numWorkouts, numWorkoutsVariation);
    var workoutsToGive = []
    var supWorkouts = ReadInNamedRange(name);
    while (finalNum != 0) {
      workoutsToGive.push(GetRandWorkout(supWorkouts))
      finalNum = finalNum - 1;
    }
    return workoutsToGive;
  }
  
  function GetRandWorkout(workouts) {
    var hasValid = false;
    workouts.forEach(w => {
      if (w["Valid"] == 1) hasValid = true;
    });
    if (!hasValid) throw "Not enough valid sup workouts"
    while (true) {
      var index = Math.round((workouts.length - 1) * Math.random());
      var workout = workouts[index];
      if (workout["Valid"] == 1) {
        workouts.splice(index, 1);
        return workout;
      }
    }
  }
  
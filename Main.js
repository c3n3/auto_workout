// A workout will consist of a main workout
// An array of sup workouts
// And one starting workout
function BuildAndSendWorkout() {
    var workout = BuildMainWorkout() + "\n\n----------------------------------\n" + BuildAux();
    this.mods.forEach(mod => {
      workout = workout + "\n\nMod: " + mod["Name"];
    });
    var config = ReadInNamedRangeInverse("Config");
  
    MailApp.sendEmail(find(config, "MY_EMAIL")["Value"], "Workout", workout);
  }
  
  function GetTodaysDay() { 
    var Todaysdate = new Date(); 
    var DayAsFloat = Todaysdate.getDay(); 
    var a = Todaysdate.toDateString();
    var b = Todaysdate.getUTCDay();
    Logger.log(DayAsFloat);
  }
  
  function createTriggers() {
     var days = [ScriptApp.WeekDay.MONDAY, ScriptApp.WeekDay.TUESDAY,
                 ScriptApp.WeekDay.WEDNESDAY, ScriptApp.WeekDay.THURSDAY,                                            
                 ScriptApp.WeekDay.FRIDAY, ScriptApp.WeekDay.SATURDAY];
     for (var i=0; i<days.length; i++) {
        ScriptApp.newTrigger("BuildAndSendWorkout")
                 .timeBased().onWeekDay(days[i])
                 .atHour(5).create();
     }
  }
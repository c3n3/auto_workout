function OpenMainSheet() {
    return SpreadsheetApp.openById("12oJdHEx7WWG2lyM8O6-ywOapaFkWUtVoNIHJpJoxHmo")
  }
  
  function ModWorkout()
  {
    var mods = ReadInNamedRange("Mods");
    var approvedMods = [];
    Object.keys(mods).forEach(key => {
      if (true || Math.random() < mods[key]["PercentChance"]) {
        approvedMods.push(mods[key]);
        approvedMods[approvedMods.length - 1]["Name"] = key;
      }
    });
    return approvedMods;
  }
  
  function ReadInNamedRange(name) {
    var sheet = OpenMainSheet();
    var range = sheet.getRangeByName(name);
    var vals = [];
    for (var i = 2; i <= range.getNumColumns(); i++) {
      vals.push({"Name": range.getCell(1, i).getValue()})
    }
    for (var i = 2; i <= range.getNumRows(); i++) {
      for (var j = 0; j < vals.length; j++) {
        vals[j][range.getCell(i, 1).getValue()] = range.getCell(i, j + 2).getValue();
      }
    }
    return vals;
  }
  
  function ReadInNamedRangeInverse(name) {
    var sheet = OpenMainSheet();
    var range = sheet.getRangeByName(name);
    var vals = [];
    for (var i = 2; i <= range.getNumRows(); i++) {
      vals.push({"Name": range.getCell(i, 1).getValue()})
    }
    for (var i = 2; i <= range.getNumColumns(); i++) {
      for (var j = 0; j < vals.length; j++) {
        vals[j][range.getCell(1, i).getValue()] = range.getCell(j + 2, i).getValue();
      }
    }
    return vals;
  }
  
  function WriteNamedRange(name, colName, rowName, value) {
    var sheet = OpenMainSheet();
    var range = sheet.getRangeByName(name);
    var index = null;
    for (var i = 2; i <= range.getNumColumns(); i++) {
      if (colName == range.getCell(1, i).getValue()) {
        index = i - 2;
        break;
      }
    }
    if (index === null) {
      throw "Column name not found";
    }
  
    for (var i = 2; i <= range.getNumRows(); i++) {
      if (rowName == range.getCell(i, 1).getValue()) {
        range.getCell(i, index + 2).setValue(value);
      }
    }
  }
  
  function find(array, name) {
    for (var i = 0; i < array.length; i++) {
      if (array[i]["Name"] == name) {
        return array[i];
      }
    }
  }
  
  // Only run once per workout build
  function GetMods() {
    var test = this.mods;
    var mods = ReadInNamedRange("Mods");
    if ("mods" in this) return;
    this.mods = [];
    mods.forEach(m => {
      if (Math.random() < parseFloat(m["PercentChance"])) {
        this.mods.push(m);
      }
    });
  }
  
  function GetVariation(base, variation) {
    return base + Math.round(Math.random() * variation * (Math.random() < 0.5 ? -1 : 1));
  }
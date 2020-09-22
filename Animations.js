windowWidth = 400;
windowHeight = 500;
var idx1 = 0;
var dict={};
var rightMargin;
var leftMargin;
var upperMargin;
var bottomMargin;
var hr;
var year;
var name = [];
var maxValueYear;
var maxValue;
var minValue;
var scaleRatio = 1;

function preload() {
  table = loadTable("baseball.csv", "csv", "header");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(3);
  numberOfRows = table.getRowCount();
  numberOfColumns = table.getColumnCount();
  hr = table.getColumn("hr");
  name = table.getColumn("name");
  year = table.getColumn("year");
  for(var i = 0; i < numberOfRows;i++) {
    var temp = table.getString(i, "name");
    if(!(temp in dict))
      dict[temp] = {};
    dict[table.getString(i, "name")][Number(year[i])] = Number(hr[i]);

  }
  print(dict);
  Object.values(dict).forEach((i) => {
    maxValue = max(Object.values(i));
    maxValueYear = max(Object.keys(i));
  });


}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
function draw() {
  leftMargin = 260;
  background(220);
  // referecence : https://stackoverflow.com/questions/25500316/sort-a-dictionary-by-value-in-javascript/25500461
  var items = Object.keys(dict).map(function(key) {
    return [key, dict[key][idx1]];
  });
  items.sort(function(first, second) {
    return second[1] - first[1];
  });
  items.forEach((p, idx) =>{
    fill(0);
    textSize(14);
    text(p[0], leftMargin - 125, (idx+1)*30 + 53);
    fill(51,51,255,196);
    rect( leftMargin, (idx+1)*30+43, p[1]*scaleRatio, 23);
    fill(0);
    text(p[1]*scaleRatio, leftMargin + p[1]*scaleRatio + 5,(idx+1)*30+60);
    line(leftMargin - 5,(idx+1)*30 + 55,leftMargin,(idx+1)*30 + 55);
    });

  upperMargin = 70;
  rightMargin = maxValue + 600;
  bottomMargin  =  25+ ((Object.keys(dict).length+2) * 30) ;
  fill(0);


  for (var k=0;k<maxValue/40 + 5;k=k+1){
    textSize(12);
    text(k*40,leftMargin+k*40,bottomMargin);
    if(k!=0)
      line(leftMargin + k*40 + 3, bottomMargin - 15, leftMargin+ k*40 + 3, bottomMargin - 10);
  }
  line(leftMargin,bottomMargin -15, rightMargin, bottomMargin - 15);
  triangle(rightMargin,bottomMargin - 23 , rightMargin, bottomMargin - 8, rightMargin+10, bottomMargin - 15);
  line(leftMargin,upperMargin - 50, leftMargin, bottomMargin - 15);
  triangle(leftMargin-10, upperMargin-50, leftMargin+10, upperMargin-50, leftMargin, upperMargin - 60);
  text("NAMES", leftMargin - 200,maxValue/2 + 50);
  line(leftMargin - 175, maxValue/2 + 30, leftMargin - 175, maxValue/2 +10);
  triangle(leftMargin - 165, maxValue/2 + 10, leftMargin - 185, maxValue/2 +10, leftMargin - 175, maxValue/2);
  textSize(14);
  text("Home Runs (Count)", rightMargin/2, bottomMargin + 30);
  line(rightMargin/2 + 140, bottomMargin + 25, rightMargin/2 +180, bottomMargin + 25);
  triangle(rightMargin/2+180, bottomMargin + 15, rightMargin/2 + 180, bottomMargin + 35, rightMargin/2 + 190, bottomMargin + 25);
  textSize(16);
  text("Top Home Runner - "+items[0][0] +"("+items[0][1]+")", rightMargin - 150 , upperMargin);
  textSize(20);
  text("Home Runs for the years( " +idx1+" )", rightMargin/2 - 50, upperMargin - 20);
  idx1 = (idx1+1)%(maxValueYear+1);


}
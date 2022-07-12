var isVictims = false;
var currentState = "US total";
var countOfWoman;
var countOfMan;
var precentsOfMan;
var precentsOfWoman;

$( document ).ready(function() {      
  // create 2 data_set



  //Initialize dropdown menu with states
  loadDropdown();



  var data1 = window.importSuspectsData("US total");
  
  // set the dimensions and margins of the graph
  var margin = {top: 10, right: 30, bottom: 40, left: 100},
  width = 800 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom ;
  
  // append the svg object to the body of the page
  var svg = d3.select("#genderBarchart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");
  
  // Initialize the X axis
  var x = d3.scaleBand()
    .range([ 0, width ])
    .padding(0.2);
  var xAxis = svg.append("g")
    .attr("transform", "translate(0," + height + ")")
  
  // Initialize the Y axis
  var y = d3.scaleLinear()
    .range([ height, 0]);
  var yAxis = svg.append("g")
    .attr("class", "myYaxis")

  // color palette = one color per subgroup
  var color = d3.scaleOrdinal()
  .domain(['Subject-Suspect','Victim'])

  .range(['#bf0a30','#002868'])



  // A function that create / update the plot for a given variable:
  function update(data) {
    svg.selectAll(".removeme").remove();
    svg.selectAll(".removeme").remove();

    svg.append("text")
    .attr("class", "x label")
    .attr("class" , "removeme")
    .attr("text-anchor", "end")
    .attr("x", width)
    .attr("y", "27em")
    .attr("style", "font-size: 14px")
    .text(function(d) {
      if(isVictims){
        return "Gender of Victims";
      }else{
        return "Gender of Suspects"
      }});
  
  svg.append("text")
    .attr("class", "y label")
    .attr("text-anchor", "end")
    .attr("class" , "removeme")
    .attr("y", -10)
    .attr("dy", "-4em")
    .attr("id", "yLabel")
    .attr("transform", "rotate(-90)")
    .text(function(d) {
      if(isVictims){
        return "Number of Victims";
      }else{
        return "Number of Suspects"
      } })
    .attr("style", "font-size: 14px");


    // Update the X axis
    x.domain(data.map(function(d) { return d.Gender; }))
    xAxis.call(d3.axisBottom(x))
  
    // Update the Y axis
    precentsOfIncreasingYaxis = (Math.random() * (15) + 10);
    y.domain([0, d3.max(data, function(d) { return d.count +(d.count/100)*precentsOfIncreasingYaxis})]);
    yAxis.transition().duration(1000).call(d3.axisLeft(y));
  
    //reset tooltip
    var maleBar = document.getElementById("Male");
    var femaleBar = document.getElementById("Female");
    if(maleBar != null && femaleBar){
      maleBar.remove();
      femaleBar.remove();
    }

    // Create the u variable
    var u = svg.selectAll("rect")
      .data(data)



  
    u
      .enter()
      .append("rect") // Add a new rect for each new elements
      .merge(u) // get the already existing elements as well
      .transition() // and apply changes to all of them
      .duration(1000)
        .attr("x", function(d) { return x(d.Gender); })
        .attr("y", function(d) {
          if(d.Gender == 'Male') {
            countOfMan = d.count;
          }
          else{
            countOfWoman = d.count;
          }
           return y(d.count);
        })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.count); })
        .attr("id", function(d) { return d.Gender ;  })
        .attr("title", function(d) { 
          {
            precentsOfMan = ((countOfMan/(countOfWoman+countOfMan))*100)
            precentsOfWoman = ((countOfWoman/(countOfWoman+countOfMan))*100)
            if(d.Gender == 'Male') {
              return "Count: " + d.count+` Gender: ` + d.Gender + ` Precents: ` + precentsOfMan.toFixed(2) +'%'; 
            }
            else{
              return "Count: " + d.count+` Gender: ` + d.Gender + ` Precents: ` + precentsOfWoman.toFixed(2) +'%';  
            } 
          }
        })
        .attr("fill", function(d) { return color(d.Gender); })
        .attr("onmouseover", function(d) {return  `toggToolTip()`})
        .attr("class","btn btn-secondary")
        .attr("data-toggle", "tooltip")
        .attr("data-placement","top")



    // If less group in the new dataset, I delete the ones not in use anymore
    u
      .exit()
      .remove()

      //change header
      var barchartHeader = document.getElementById('barchartHeader');
      if(isVictims){
        if(currentState == "US total"){
          barchartHeader.textContent = 'Gender of total Victims in USA';
        }else{
          barchartHeader.textContent = 'Gender of Victims in ' + currentState;
        }
      }else{
        if(currentState == "US total"){
          barchartHeader.textContent = 'Gender of total Suspects in USA';
        }else{
          barchartHeader.textContent = 'Gender of Suspects in ' + currentState;
        }
       
      }


  
  }

  
  // Initialize the plot with the first dataset
  update(data1)

  function reloadBarChart(){
    //find data to load
    if(isVictims){
      var data = window.importVictimsData("US total");
      update(data);
    }else{
      var data = window.importSuspectsData("US total");
      update(data);
    }
   }
  //set on click for radion buttons (victims/suspects)
  $("#radioVictims").click(function() {
    checkRadioBTN();
  });
  $("#radioSuspects").click(function() {
    checkRadioBTN();
  });

  function loadDropdown(){
    //reset
    statesButtonsList = document.getElementById("statesButtonsList");
    statesButtonsList.innerHTML = "";

    //load
    statedNames = importStatesNames();
    statedNames.forEach(function (arrayItem) {
      var stateName = arrayItem.State;
      //add state to list
      if(stateName == currentState){
        //if it's selected- color it with blue
        newBTN = `<button class="dropdown-item btn-primary stateBTN active" type="button" id="${stateName}">${stateName}</button>`
        statesButtonsList.innerHTML += `${newBTN}`;
      }else{
        newBTN = `<button class="dropdown-item stateBTN" type="button" id="${stateName}">${stateName}</button>`
        statesButtonsList.innerHTML += `${newBTN}`;
      }
    })

    $('.stateBTN').on('click', function(e) {
        currentState = this.id;
        loadDropdown();
        reloadBarChart();
    });
  
  }

  function checkRadioBTN(){
    if (document.getElementById('radioVictims').checked) {
      //clicked victims
      document.getElementById("buttonRadioSuspects").classList.remove('active');
      document.getElementById("buttonRadioVictims").classList.add('active');
      isVictims = true;
      reloadBarChart();
    } else {
      //clicked suspects
      document.getElementById("buttonRadioVictims").classList.remove('active');
      document.getElementById("buttonRadioSuspects").classList.add('active');
      isVictims = false;
      reloadBarChart();
    }
  };

  function reloadBarChart(){
      //find data to load
      var data;
      if(isVictims){
        data = window.importVictimsData(currentState);
      }else{
        data = window.importSuspectsData(currentState);
      }
      update(data);
  }


});


function toggToolTip () {
  $('[data-toggle="tooltip"]').tooltip()
};
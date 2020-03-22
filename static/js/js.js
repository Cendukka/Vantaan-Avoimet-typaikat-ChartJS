window.onload = (event) =>{
    //Assign events to elements
    document.getElementById("fetchAll").addEventListener("click", (event) =>{
        drawAllData();
    });
    document.getElementById("allJobs").addEventListener("click", (event) =>{
        getDataByCareer(event);
    });
    //declare arrays
    let allCareers = [];
    let individualCareersTitle = [];
    let careerJobAmount = []; 
    let pieChartBGC = [];
    let individualJobArr = [];
    //declare charts
    let careerChartAll;

    //function to fetch data and show it on the browser
    drawAllData();
    
    async function drawAllData(){
        //clean the arrays
        allCareers = [];
        individualCareersTitle = [];
        careerJobAmount = []; 
        pieChartBGC = [];

        //Fetch the json data of the jobs
        fetch('http://gis.vantaa.fi/rest/tyopaikat/v1/')
        .then((res)=>{return res.json()})
        .then((data)=>{
            //copy each element of the JSON to the arrays for better handling in the future
            data.forEach(element => { 
                allCareers.push(element);
                //check and don't push "kaikki" -element to the arrays
                if(element.ammattiala != "kaikki"){
                    individualCareersTitle.push(element.ammattiala);
                    careerJobAmount.push(element.lukumäärä);
                    pieChartBGC.push(randomColor(1));
                }
            });
            //create the pie chart
            const canvas = document.getElementById("allJobs");
            const ctx = canvas.getContext("2d");
            careerChartAll = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: individualCareersTitle,
                    datasets: [{
                        label: 'Vantaan työpaikkojen lukumäärä',
                        data: careerJobAmount,                  //data of the pie
                        backgroundColor: pieChartBGC,           //color of each pie segment
                        borderColor: pieChartBGC,               //color of the pie segments' borders
                        borderWidth: 1,                         //the width of the border
                        borderAlign: 'inner'                
                    }]
                },
                options: {
                    responsive: true,
                    title:{
                        display: true,
                        text: `Vantaan työpaikkojen kokonaismäärä: ${data[0].lukumäärä}`
                    },
                    plugins: {
                        labels: {
                          // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
                          render: 'value',
                          // identifies whether or not labels of value 0 are displayed, default is false
                          showZero: true,
                        }
                    }
                }
            })
           
        }).catch((err) => console.log(err))
    }

    function getDataByCareer(clickingSection){
        //clear array
        individualJobArr = [];
        //checking the activepoints of the chart on the event,
        //then identifies which segment was clicked
        let activePoints = careerChartAll.getElementsAtEvent(clickingSection);
        let clickedSegment;
        if (activePoints[0]) {
            let chartData = activePoints[0]['_chart'].config.data;
            var idx = activePoints[0]['_index'];
            clickedSegment = chartData.labels[idx];
        }
        //fetch data defined by clicked segment
        if(clickedSegment != null){
            fetch(`http://gis.vantaa.fi/rest/tyopaikat/v1/${clickedSegment}`)
            .then((res)=>{return res.json()})
            .then((data)=>{
                let output =`
                <section>
                <h2 class="textMiddle" style="color: black;">Työpaikat</h2>
                <h4 class="textMiddle" style="color: black;">Valittu toimiala: ${clickedSegment}</h4>
                    <div>
                        <table class="table table-bordered table-striped">
                            <thead>
                                <tr>
                                    <th>Organisaatio</th>
                                    <th>Työtehtävä</th>
                                    <th>Osoite</th>
                                    <th>Haku päättyy</th>
                                    <th>Linkki ilmoitukseen</th>
                                </tr>
                            </thead>
                            <tbody>
                        `;
                    //push jobs in the array
                    data.forEach((element) =>{
                        individualJobArr.push(element);
                    })
                    for(let objectKey = 0; objectKey<data.length; objectKey++){
                        output += `
                        <tr>
                            <td> ${individualJobArr[objectKey].organisaatio}</td>
                           <td> ${individualJobArr[objectKey].tyotehtava}</td>
                           <td>${individualJobArr[objectKey].osoite}</td>
                           <td>${individualJobArr[objectKey].haku_paattyy_pvm}</td>
                           <td><a href='${individualJobArr[objectKey].linkki}'>${individualJobArr[objectKey].linkki}</a></td>
                        </tr>
                        `;
                    }
                //add closing tags    
                output += '</tbody></table></div></section>'
                document.getElementById("tableDiv").innerHTML = output;
            }).catch((err) => console.log(err))
        }
    }


    //function for random color with opacity
    function randomColor(opacity){
        let r = randomNumber(255);
        let g = randomNumber(255);
        let b = randomNumber(255);
        let randomRGBAcolor = `rgba(${r},${g},${b},${opacity})`
        return randomRGBAcolor;
    }
    //function to generate random number between 0 and max
    function randomNumber(max){
        return Math.floor(Math.random() * Math.floor(max));
    }
    

    
};
/**
 * Author: Samuli Lehtonen
 * Version: 1.0
 * Project about: The purpose is to visualize fetched data about the jobs of different careers the city of Vantaa is recruiting for,
 * create a chart from the data and present basic information of individual jobs of the selected career in the table element.
 * 
 * This file handles the communication with the JSON API provided by the City and the visualization of the data and information. 
 
 */

window.onload = (event) =>{
    //declare variables
    let clickedSegment;
    let lengthOfJobJsonData;

    //declare arrays
    let individualCareersArr = [];
    let careerJobAmountArr = []; 
    let pieChartBGCArr = [];
    let individualJobArr = [];

    //declare charts
    let careerChart;

    //Assign events to elements
    document.getElementById("fetchAll").addEventListener("click", () =>{
        drawAllData();
    });
    document.getElementById("allJobsChart").addEventListener("click", (event) =>{
        getDataByCareer(event);
    });


    //function to fetch data and show it on the browser
    drawAllData();
    
    async function drawAllData(){

        //clean the arrays
        individualCareersArr = [];
        careerJobAmountArr = []; 
        pieChartBGCArr = [];

        //Fetch the json data of the jobs
        fetch('http://gis.vantaa.fi/rest/tyopaikat/v1/')
        .then((res)=>{return res.json()})
        .then((data)=>{

            //copy each element of the JSON to the arrays for better handling in the future
            data.forEach(job => {
                //check and push individual job -element to the arrays
                if(job.ammattiala != "kaikki"){
                    individualCareersArr.push(job.ammattiala);          //push the career's name
                    careerJobAmountArr.push(job.lukumäärä);            //push the amount of the career's 
                    pieChartBGCArr.push(randomColor(1));               //make random color for the job used later on the chart
                }
            });

            //create the pie chart
            const canvas = document.getElementById("allJobsChart");
            const ctx = canvas.getContext("2d");
            careerChart = new Chart(ctx, {
                type: 'pie',
                data: {
                    labels: individualCareersArr,
                    datasets: [{
                        label: 'Vantaan työpaikkojen lukumäärä',
                        data: careerJobAmountArr,                  //data of the pie
                        backgroundColor: pieChartBGCArr,           //color of each pie segment
                        borderColor: pieChartBGCArr,               //color of the pie segments' borders
                        borderWidth: 1,                         //the width of the border
                        borderAlign: 'inner'                
                    }]
                },
                options: {
                    responsive: true,
                    legend: {
                        position: 'top',     
                            labels: {
                                fontSize:15,  
                            }
                        },
                    title:{
                        display: true,
                        text: `Vantaan työpaikkojen kokonaismäärä: ${data[0].lukumäärä}`
                    },
                    plugins: {
                        labels: {
                          // render 'label', 'value', 'percentage', 'image' or custom function, default is 'percentage'
                          render: 'value',
                          fontSize: 20,
                          // identifies whether or not labels of value 0 are displayed, default is false
                          showZero: true,
                          fontColor: '#000',
                        }
                    }
                }
            })
           
        }).catch((err) => console.log(err)) //End of fetch
    }

    function getDataByCareer(clickingSection){
        //clear array
        individualJobArr = [];

        //checking the activepoints of the chart on the event,
        //then identifies which segment was clicked
        let activePoints = careerChart.getElementsAtEvent(clickingSection);
        if (activePoints[0]) {
            let chartData = activePoints[0]['_chart'].config.data;
            let idx = activePoints[0]['_index'];
            clickedSegment = chartData.labels[idx];
        }

         //fetch data defined by clicked segment
         if(clickedSegment != null){
            fetch(`http://gis.vantaa.fi/rest/tyopaikat/v1/${clickedSegment}`)
            .then((res)=>{return res.json()})
            .then((data)=>{
                //push jobs in the array
                data.forEach((element) =>{
                    individualJobArr.push(element);
                })
                lengthOfJobJsonData = data.length
                populateTable();
            }).catch((err) => console.log(err)) //End of fetch
        }
        
    }

    function populateTable(){
        let headerdata = `
        <h2 class="textAlignCenter" style="color: black;">Työpaikat</h2>
        <h4 class="textAlignCenter" style="color: black;">Valittu toimiala: ${clickedSegment}</h4>
        `;
            let bodyData = "";
            //iterate as many time as there was objects (job announcement) in the json data
            for(let objectKey = 0; objectKey<lengthOfJobJsonData; objectKey++){
                //Reformat the date
                const d = individualJobArr[objectKey].haku_paattyy_pvm.split("-");
                const ye = d[0];
                const mo = d[1];
                const da = d[2];
                bodyData += `
                <tr>
                    <td> ${individualJobArr[objectKey].organisaatio}</td>
                    <td> ${individualJobArr[objectKey].tyotehtava}</td>
                    <td>${individualJobArr[objectKey].osoite}</td>
                    <td>${da}.${mo}.${ye}</td>
                    <td><a href='${individualJobArr[objectKey].linkki}'>${individualJobArr[objectKey].linkki}</a></td>
                </tr>
                `;
            }
        document.getElementById("tableHeader").innerHTML = headerdata;
        document.getElementById("dataBody").innerHTML = bodyData;
    }

    //function for creating random rgba color
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
}
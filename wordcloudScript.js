var chart = echarts.init(document.getElementById('wordcloudVis'));
var precentsLabel =  document.getElementById("precents");
var totalNumOfCasesLabel = document.getElementById("totalNumOfCases");
var relationShipPrecLabel = document.getElementById("relationShipPrec");

//counted from the json with python
var sumCases = 20551;

//set header
totalNumOfCasesLabel.innerHTML= `${sumCases}`;
relationShipPrecLabel.innerHTML = `desired relation`

var option = {
    tooltip: {
show: true,
formatter: function(item) {
    var precents = ((item.value/sumCases)*100).toFixed(2);
    precentsLabel.innerHTML= `${precents}`;
    relationShipPrecLabel.innerHTML=`${item.name}`;
return '<div><b>' + item.name + `</b>  Count:`+item.value + '</div>'
}
},
    series: [ {
        type: 'wordCloud',
        gridSize: 35,
        sizeRange: [20, 50],
        rotationRange: [0, 0],
        shape: 'pentagon',
        width: 800,
        height: 400,
        // width: 600,
        // height: 600,
        drawOutOfBound: true,
        textStyle: {
            color: function () {
                min = 100;
                max = 350;
                rand = (Math.random() * (max - min + 1) + min);
                return 'rgb(' + [
                    //Math.round(Math.random() * 160),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255)
                ].join(',') + ')';
            }
        },
        emphasis: {
            textStyle: {
                shadowBlur: 10,
                shadowColor: '#333',
                color: '#002868'
            }
        },
        data: [
            {
                "name": "Friends",
                "value": 1092,
                "precent":"15",
                textStyle:{color: '#C12C53'}
            },
            {
                "name": "Mass shooting - Random victims",
                "value": 13,
                textStyle:{color: '#a632a8'}
                
            },
            {
                "name": "Significant others - current or former",
                "value": 3471,
                textStyle:{color: '#75863E'}
            },
            {
                "name": "Armed Robbery",
                "value": 7969,
                textStyle: {
                    color: 'black'
                },
                emphasis: {
                    textStyle: {
                        color: 'red'
                    }
                }
            },
            {
                "name": "Home Invasion - Perp Knows Victim",
                "value": 525,
                textStyle:{color: '#3a00c2'}
            },
            {
                "name": "Family",
                "value": 3558,
                textStyle:{color: '#73968F'}
            },
            {
                "name": "Aquaintance",
                "value": 1020,
                textStyle:{color: '#e84371'}
            },
            {
                "name": "Drive by - Random victims",
                "value": 46,
                textStyle:{color: '#FA8072'}
            },
            {
                "name": "Mass shooting - Perp Knows Victims",
                "value": 13,
                textStyle:{color: '#5ADCA7'}
            },
            {
                "name": "Gang vs Gang",
                "value": 602,
                textStyle:{color: '#d19602'}
            },
            {
                "name": "Co-worker",
                "value": 141,
                textStyle:{color: '#02d118'}
            },
            {
                "name": "Neighbor",
                "value": 727,
                textStyle:{color: '#c200a1'}
            },
            {
                "name": "Home Invasion - Perp Does Not Know Victim",
                "value": 1374,
                textStyle:{color: '#ac89bc'}
            }
        ]
    } ]
};


chart.setOption(option);

window.onresize = chart.resize;



/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.7075471698113207, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.7368421052631579, 500, 1500, "021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()"], "isController": false}, {"data": [0.7105263157894737, 500, 1500, "039 - /actions/Order.action ()"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "024 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "023 - /actions/Account.action ()-0"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.6842105263157895, 500, 1500, "Preceed to checkout"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "038 - /actions/Order.action ()"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "023 - /actions/Account.action ()-1"], "isController": false}, {"data": [0.39473684210526316, 500, 1500, "Signout"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "Click on continue"], "isController": true}, {"data": [0.7894736842105263, 500, 1500, "042 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "030 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.15789473684210525, 500, 1500, "Login"], "isController": true}, {"data": [0.75, 500, 1500, "Launch"], "isController": true}, {"data": [0.7631578947368421, 500, 1500, "Click on fish"], "isController": true}, {"data": [0.5526315789473685, 500, 1500, "023 - /actions/Account.action ()"], "isController": false}, {"data": [0.7631578947368421, 500, 1500, "026 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.8421052631578947, 500, 1500, "041 - /actions/Account.action ()-1"], "isController": false}, {"data": [0.8947368421052632, 500, 1500, "041 - /actions/Account.action ()-0"], "isController": false}, {"data": [0.6842105263157895, 500, 1500, "036 - /actions/Order.action ()"], "isController": false}, {"data": [0.8157894736842105, 500, 1500, "033 - /actions/Cart.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "041 - /actions/Account.action ()"], "isController": false}, {"data": [0.7368421052631579, 500, 1500, "select product ID"], "isController": true}, {"data": [0.7105263157894737, 500, 1500, "Click on confirm"], "isController": true}, {"data": [0.75, 500, 1500, "003 - /actions/Catalog.action ()"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 306, 0, 0.0, 856.0130718954247, 176, 23506, 450.0, 1376.6000000000008, 2369.1499999999983, 17960.100000000093, 0.5095974180397487, 2.174615061913588, 0.5194951977521092], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()", 19, 0, 0.0, 688.4736842105262, 228, 2273, 448.0, 2035.0, 2273.0, 2273.0, 0.03416799142563247, 0.13663508618875836, 0.028558792997719736], "isController": false}, {"data": ["039 - /actions/Order.action ()", 19, 0, 0.0, 841.7894736842107, 236, 3599, 451.0, 2394.0, 3599.0, 3599.0, 0.03341652288768003, 0.17840637756537767, 0.027314091461902525], "isController": false}, {"data": ["024 - /actions/Catalog.action ()", 19, 0, 0.0, 1520.9473684210532, 234, 18931, 431.0, 2474.0, 18931.0, 18931.0, 0.034025666097184465, 0.17278658564976485, 0.02930376547720101], "isController": false}, {"data": ["023 - /actions/Account.action ()-0", 19, 0, 0.0, 433.5789473684211, 179, 3041, 260.0, 599.0, 3041.0, 3041.0, 0.03415632089683713, 0.007671829888938026, 0.03895604238799424], "isController": false}, {"data": ["Add to cart", 19, 0, 0.0, 595.7368421052631, 228, 3312, 383.0, 1582.0, 3312.0, 3312.0, 0.033493160344098154, 0.15912521979886476, 0.028783184670709352], "isController": true}, {"data": ["Preceed to checkout", 19, 0, 0.0, 805.8421052631579, 232, 2865, 451.0, 1884.0, 2865.0, 2865.0, 0.03342692873378794, 0.1837828210656505, 0.028073397178767216], "isController": true}, {"data": ["038 - /actions/Order.action ()", 19, 0, 0.0, 741.5263157894735, 234, 4430, 463.0, 1427.0, 4430.0, 4430.0, 0.03336787200786779, 0.15546691147415748, 0.04767304369874081], "isController": false}, {"data": ["023 - /actions/Account.action ()-1", 19, 0, 0.0, 1531.5789473684208, 219, 20464, 463.0, 852.0, 20464.0, 20464.0, 0.03413128689322656, 0.1733229412546661, 0.03232788624940271], "isController": false}, {"data": ["Signout", 19, 0, 0.0, 1401.7894736842104, 779, 5389, 1140.0, 1958.0, 5389.0, 5389.0, 0.03350136914806018, 0.33537356946949703, 0.08264107272265628], "isController": true}, {"data": ["Click on continue", 19, 0, 0.0, 741.5263157894735, 234, 4430, 463.0, 1427.0, 4430.0, 4430.0, 0.03336787200786779, 0.15546691147415748, 0.04767304369874081], "isController": true}, {"data": ["042 - /actions/Catalog.action ()", 19, 0, 0.0, 528.578947368421, 222, 2430, 359.0, 779.0, 2430.0, 2430.0, 0.03353240995665495, 0.16284831515082526, 0.027474308548470217], "isController": false}, {"data": ["030 - /actions/Catalog.action ()", 19, 0, 0.0, 733.7368421052631, 237, 2555, 498.0, 1291.0, 2555.0, 2555.0, 0.03367588204224728, 0.14147816850170683, 0.028874437922942493], "isController": false}, {"data": ["Login", 19, 0, 0.0, 4175.368421052632, 1190, 44710, 1661.0, 5672.0, 44710.0, 44710.0, 0.03394602938654165, 0.4881364350103268, 0.128477067223858], "isController": true}, {"data": ["Launch", 20, 0, 0.0, 802.8499999999999, 255, 3508, 440.5, 2162.800000000001, 3443.649999999999, 3508.0, 0.033297871100611186, 0.16283276799791555, 0.02417184812757746], "isController": true}, {"data": ["Click on fish", 19, 0, 0.0, 771.8947368421052, 236, 5061, 408.0, 2181.0, 5061.0, 5061.0, 0.033733818863596415, 0.13585768456393715, 0.02786993238144782], "isController": true}, {"data": ["023 - /actions/Account.action ()", 19, 0, 0.0, 1965.9473684210527, 442, 23506, 765.0, 1163.0, 23506.0, 23506.0, 0.03412019286887969, 0.1809303196074382, 0.07123221597184186], "isController": false}, {"data": ["026 - /actions/Catalog.action ()", 19, 0, 0.0, 771.8947368421052, 236, 5061, 408.0, 2181.0, 5061.0, 5061.0, 0.03373387875688881, 0.13585792577481393, 0.0278699818636015], "isController": false}, {"data": ["041 - /actions/Account.action ()-1", 19, 0, 0.0, 519.6842105263158, 241, 1810, 394.0, 1176.0, 1810.0, 1810.0, 0.033536316300414794, 0.16532355926220105, 0.027477509156296886], "isController": false}, {"data": ["041 - /actions/Account.action ()-0", 19, 0, 0.0, 352.52631578947364, 176, 1147, 254.0, 744.0, 1147.0, 1147.0, 0.03353951307687963, 0.0075332890700022595, 0.02777490926679094], "isController": false}, {"data": ["036 - /actions/Order.action ()", 19, 0, 0.0, 805.8421052631579, 232, 2865, 451.0, 1884.0, 2865.0, 2865.0, 0.03342645827322435, 0.18378023445141903, 0.028073002065403262], "isController": false}, {"data": ["033 - /actions/Cart.action ()", 19, 0, 0.0, 595.7368421052631, 228, 3312, 383.0, 1582.0, 3312.0, 3312.0, 0.033493160344098154, 0.15912521979886476, 0.028783184670709352], "isController": false}, {"data": ["041 - /actions/Account.action ()", 19, 0, 0.0, 873.2105263157895, 484, 2959, 661.0, 1599.0, 2959.0, 2959.0, 0.03352176091574394, 0.1727811075325161, 0.05522579166490236], "isController": false}, {"data": ["select product ID", 19, 0, 0.0, 733.7368421052631, 237, 2555, 498.0, 1291.0, 2555.0, 2555.0, 0.0336759417299863, 0.14147841926015728, 0.028874489100515596], "isController": true}, {"data": ["Click on confirm", 19, 0, 0.0, 841.7894736842107, 236, 3599, 451.0, 2394.0, 3599.0, 3599.0, 0.03341658165957297, 0.1784066913407084, 0.02731413950103767], "isController": true}, {"data": ["003 - /actions/Catalog.action ()", 20, 0, 0.0, 802.8, 255, 3508, 440.5, 2162.800000000001, 3443.649999999999, 3508.0, 0.033307020786911674, 0.16287751166162065, 0.024178490138623818], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 306, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

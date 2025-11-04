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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9228896103896104, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.98, 500, 1500, "021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()"], "isController": false}, {"data": [1.0, 500, 1500, "039 - /actions/Order.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "024 - /actions/Catalog.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "023 - /actions/Account.action ()-0"], "isController": false}, {"data": [0.96, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.94, 500, 1500, "Preceed to checkout"], "isController": true}, {"data": [0.9791666666666666, 500, 1500, "038 - /actions/Order.action ()"], "isController": false}, {"data": [0.96, 500, 1500, "023 - /actions/Account.action ()-1"], "isController": false}, {"data": [0.5208333333333334, 500, 1500, "Signout"], "isController": true}, {"data": [0.9791666666666666, 500, 1500, "Click on continue"], "isController": true}, {"data": [1.0, 500, 1500, "042 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.98, 500, 1500, "030 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": true}, {"data": [0.88, 500, 1500, "Launch"], "isController": true}, {"data": [1.0, 500, 1500, "Click on fish"], "isController": true}, {"data": [0.8, 500, 1500, "023 - /actions/Account.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "026 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.9791666666666666, 500, 1500, "041 - /actions/Account.action ()-1"], "isController": false}, {"data": [1.0, 500, 1500, "041 - /actions/Account.action ()-0"], "isController": false}, {"data": [0.94, 500, 1500, "036 - /actions/Order.action ()"], "isController": false}, {"data": [0.96, 500, 1500, "033 - /actions/Cart.action ()"], "isController": false}, {"data": [0.8541666666666666, 500, 1500, "041 - /actions/Account.action ()"], "isController": false}, {"data": [0.98, 500, 1500, "select product ID"], "isController": true}, {"data": [1.0, 500, 1500, "Click on confirm"], "isController": true}, {"data": [0.88, 500, 1500, "003 - /actions/Catalog.action ()"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 394, 0, 0.0, 277.4086294416245, 150, 2187, 214.0, 454.0, 593.25, 859.5500000000009, 0.6573042517909038, 2.8027284121848193, 0.6709160880846087], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()", 25, 0, 0.0, 241.32, 171, 539, 214.0, 472.2, 519.5, 539.0, 0.042667504087546895, 0.17063168226448389, 0.03565403310315637], "isController": false}, {"data": ["039 - /actions/Order.action ()", 24, 0, 0.0, 233.79166666666666, 172, 402, 215.0, 370.5, 401.5, 402.0, 0.04278753670368383, 0.22843697574124952, 0.034973797090804074], "isController": false}, {"data": ["024 - /actions/Catalog.action ()", 25, 0, 0.0, 199.67999999999995, 150, 272, 196.0, 246.40000000000006, 269.9, 272.0, 0.04270919819459677, 0.21688264708193672, 0.03677328697676961], "isController": false}, {"data": ["023 - /actions/Account.action ()-0", 25, 0, 0.0, 200.52, 154, 350, 185.0, 273.0000000000002, 345.8, 350.0, 0.04269038202769069, 0.00958866002575084, 0.04868037625595104], "isController": false}, {"data": ["Add to cart", 25, 0, 0.0, 265.08000000000004, 170, 748, 212.0, 499.60000000000025, 695.7999999999998, 748.0, 0.04273752662547908, 0.20304498733687085, 0.03672756194377109], "isController": true}, {"data": ["Preceed to checkout", 25, 0, 0.0, 297.80000000000007, 160, 1140, 210.0, 699.4000000000001, 1010.6999999999997, 1140.0, 0.042767209525112905, 0.23513612268201728, 0.03591777362460655], "isController": true}, {"data": ["038 - /actions/Order.action ()", 24, 0, 0.0, 248.08333333333331, 173, 561, 232.0, 298.5, 495.75, 561.0, 0.04277381030884474, 0.19929086814794747, 0.061111410626796724], "isController": false}, {"data": ["023 - /actions/Account.action ()-1", 25, 0, 0.0, 282.44000000000005, 160, 718, 213.0, 484.0000000000002, 665.7999999999998, 718.0, 0.042705039707145925, 0.2168615297628504, 0.04043967080393092], "isController": false}, {"data": ["Signout", 24, 0, 0.0, 645.4999999999999, 487, 943, 603.5, 860.5, 937.5, 943.0, 0.042765502494654314, 0.42811441999287236, 0.10549380791161796], "isController": true}, {"data": ["Click on continue", 24, 0, 0.0, 248.08333333333331, 173, 561, 232.0, 298.5, 495.75, 561.0, 0.04277373407569525, 0.1992905129640059, 0.061111301711662264], "isController": true}, {"data": ["042 - /actions/Catalog.action ()", 24, 0, 0.0, 182.45833333333334, 156, 224, 186.0, 202.5, 219.5, 224.0, 0.04279844784295823, 0.20784832140921022, 0.03506630638695503], "isController": false}, {"data": ["030 - /actions/Catalog.action ()", 25, 0, 0.0, 236.99999999999997, 159, 589, 215.0, 389.00000000000006, 531.6999999999998, 589.0, 0.04271408727684025, 0.17944922213375658, 0.03662399280182201], "isController": false}, {"data": ["Login", 25, 0, 0.0, 925.2399999999999, 666, 1318, 874.0, 1202.6000000000004, 1304.8, 1318.0, 0.0426317063937328, 0.6130422726408467, 0.16131438027141048], "isController": true}, {"data": ["Launch", 25, 0, 0.0, 409.08, 163, 2187, 234.0, 760.6000000000004, 1787.699999999999, 2187.0, 0.04250768113798163, 0.20758360410726218, 0.030879505707931423], "isController": true}, {"data": ["Click on fish", 25, 0, 0.0, 228.52, 164, 373, 218.0, 323.6000000000001, 363.4, 373.0, 0.042711460168146476, 0.17201373216155866, 0.03528700713110539], "isController": true}, {"data": ["023 - /actions/Account.action ()", 25, 0, 0.0, 484.24, 325, 927, 446.0, 695.6000000000001, 866.3999999999999, 927.0, 0.042678284264687304, 0.22631160503637895, 0.08908091567966021], "isController": false}, {"data": ["026 - /actions/Catalog.action ()", 25, 0, 0.0, 228.52, 164, 373, 218.0, 323.6000000000001, 363.4, 373.0, 0.04271138719751796, 0.17201343828375396, 0.035286946844824404], "isController": false}, {"data": ["041 - /actions/Account.action ()-1", 24, 0, 0.0, 232.83333333333334, 155, 526, 194.5, 411.0, 501.25, 526.0, 0.042795318905367065, 0.21096754866630174, 0.0350637427359404], "isController": false}, {"data": ["041 - /actions/Account.action ()-0", 24, 0, 0.0, 229.66666666666669, 151, 398, 212.5, 380.0, 396.25, 398.0, 0.04278997787401561, 0.009611030186546474, 0.035435450426919174], "isController": false}, {"data": ["036 - /actions/Order.action ()", 25, 0, 0.0, 297.80000000000007, 160, 1140, 210.0, 699.4000000000001, 1010.6999999999997, 1140.0, 0.042767209525112905, 0.23513612268201728, 0.03591777362460655], "isController": false}, {"data": ["033 - /actions/Cart.action ()", 25, 0, 0.0, 265.08000000000004, 170, 748, 212.0, 499.60000000000025, 695.7999999999998, 748.0, 0.042737599685451266, 0.20304533444308634, 0.03672762472968468], "isController": false}, {"data": ["041 - /actions/Account.action ()", 24, 0, 0.0, 463.04166666666663, 330, 749, 405.5, 672.0, 746.5, 749.0, 0.04277754606606992, 0.22048817200851273, 0.07047433614595698], "isController": false}, {"data": ["select product ID", 25, 0, 0.0, 236.99999999999997, 159, 589, 215.0, 389.00000000000006, 531.6999999999998, 589.0, 0.04271401429723487, 0.179448915533891, 0.036623930227511925], "isController": true}, {"data": ["Click on confirm", 24, 0, 0.0, 233.79166666666666, 172, 402, 215.0, 370.5, 401.5, 402.0, 0.04278746042159911, 0.2284365684813304, 0.03497373473913912], "isController": true}, {"data": ["003 - /actions/Catalog.action ()", 25, 0, 0.0, 409.08, 163, 2187, 234.0, 760.6000000000004, 1787.699999999999, 2187.0, 0.04251787451444587, 0.20763338282413926, 0.030886910638482416], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 394, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

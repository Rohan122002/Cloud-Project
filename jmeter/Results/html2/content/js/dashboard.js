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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.44, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.5, 500, 1500, "021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()"], "isController": false}, {"data": [0.5, 500, 1500, "039 - /actions/Order.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "024 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "023 - /actions/Account.action ()-0"], "isController": false}, {"data": [0.5, 500, 1500, "Add to cart"], "isController": true}, {"data": [0.5, 500, 1500, "Preceed to checkout"], "isController": true}, {"data": [0.5, 500, 1500, "038 - /actions/Order.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "023 - /actions/Account.action ()-1"], "isController": false}, {"data": [0.0, 500, 1500, "Signout"], "isController": true}, {"data": [0.5, 500, 1500, "Click on continue"], "isController": true}, {"data": [0.5, 500, 1500, "042 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "030 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.0, 500, 1500, "Login"], "isController": true}, {"data": [0.25, 500, 1500, "Launch"], "isController": true}, {"data": [0.5, 500, 1500, "Click on fish"], "isController": true}, {"data": [0.5, 500, 1500, "023 - /actions/Account.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "026 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "041 - /actions/Account.action ()-1"], "isController": false}, {"data": [0.5, 500, 1500, "041 - /actions/Account.action ()-0"], "isController": false}, {"data": [0.5, 500, 1500, "036 - /actions/Order.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "033 - /actions/Cart.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "041 - /actions/Account.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "select product ID"], "isController": true}, {"data": [0.5, 500, 1500, "Click on confirm"], "isController": true}, {"data": [0.25, 500, 1500, "003 - /actions/Catalog.action ()"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 0, 0.0, 756.8750000000001, 551, 3684, 586.0, 1176.3999999999999, 2080.449999999995, 3684.0, 0.5628253834247925, 2.4102316872889404, 0.575587201658576], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()", 2, 0, 0.0, 558.0, 551, 565, 558.0, 565.0, 565.0, 565.0, 0.06666666666666667, 0.26666666666666666, 0.05621744791666667], "isController": false}, {"data": ["039 - /actions/Order.action ()", 2, 0, 0.0, 587.0, 561, 613, 587.0, 613.0, 613.0, 613.0, 0.06678465288676663, 0.35655439192573546, 0.05458862740842155], "isController": false}, {"data": ["024 - /actions/Catalog.action ()", 2, 0, 0.0, 562.0, 560, 564, 562.0, 564.0, 564.0, 564.0, 0.0668493883280968, 0.33946955010361657, 0.05806887784945518], "isController": false}, {"data": ["023 - /actions/Account.action ()-0", 2, 0, 0.0, 600.5, 559, 642, 600.5, 642.0, 642.0, 642.0, 0.06665111473989403, 0.014970465224780884, 0.07651209509447796], "isController": false}, {"data": ["Add to cart", 2, 0, 0.0, 629.5, 580, 679, 629.5, 679.0, 679.0, 679.0, 0.06678242286630158, 0.31728172582476294, 0.05739114465072793], "isController": true}, {"data": ["Preceed to checkout", 2, 0, 0.0, 573.0, 560, 586, 573.0, 586.0, 586.0, 586.0, 0.06698596644003081, 0.3682919834544663, 0.05625774525236963], "isController": true}, {"data": ["038 - /actions/Order.action ()", 2, 0, 0.0, 575.0, 558, 592, 575.0, 592.0, 592.0, 592.0, 0.06691201070592172, 0.31175508113081296, 0.09559792154566744], "isController": false}, {"data": ["023 - /actions/Account.action ()-1", 2, 0, 0.0, 566.5, 563, 570, 566.5, 570.0, 570.0, 570.0, 0.06683598449405159, 0.33940148375885576, 0.06380095199505414], "isController": false}, {"data": ["Signout", 2, 0, 0.0, 1760.5, 1727, 1794, 1760.5, 1794.0, 1794.0, 1794.0, 0.06426941739773129, 0.643384568109515, 0.15853959799479417], "isController": true}, {"data": ["Click on continue", 2, 0, 0.0, 575.0, 558, 592, 575.0, 592.0, 592.0, 592.0, 0.06691424938940747, 0.3117655115594366, 0.09560111997724915], "isController": true}, {"data": ["042 - /actions/Catalog.action ()", 2, 0, 0.0, 594.5, 587, 602, 594.5, 602.0, 602.0, 602.0, 0.06682705159048383, 0.3245419214448009, 0.05475380496524993], "isController": false}, {"data": ["030 - /actions/Catalog.action ()", 2, 0, 0.0, 635.5, 580, 691, 635.5, 691.0, 691.0, 691.0, 0.06655795533961197, 0.2796214100302839, 0.05706824686345636], "isController": false}, {"data": ["Login", 2, 0, 0.0, 2290.0, 2252, 2328, 2290.0, 2328.0, 2328.0, 2328.0, 0.06311736674345947, 0.9076819752579922, 0.24075823681636002], "isController": true}, {"data": ["Launch", 2, 0, 0.0, 2141.5, 599, 3684, 2141.5, 3684.0, 3684.0, 3684.0, 0.05962495900784068, 0.30968295359687564, 0.041894685552872436], "isController": true}, {"data": ["Click on fish", 2, 0, 0.0, 585.5, 585, 586, 585.5, 586.0, 586.0, 586.0, 0.06679357445813713, 0.2690006846341382, 0.05518297264803126], "isController": true}, {"data": ["023 - /actions/Account.action ()", 2, 0, 0.0, 1170.0, 1123, 1217, 1170.0, 1217.0, 1217.0, 1217.0, 0.06542147787118512, 0.3469127195708351, 0.13755121275064602], "isController": false}, {"data": ["026 - /actions/Catalog.action ()", 2, 0, 0.0, 585.5, 585, 586, 585.5, 586.0, 586.0, 586.0, 0.06679357445813713, 0.2690006846341382, 0.05518297264803126], "isController": false}, {"data": ["041 - /actions/Account.action ()-1", 2, 0, 0.0, 601.5, 586, 617, 601.5, 617.0, 617.0, 617.0, 0.06676013084985646, 0.3291065825489018, 0.05469897439748982], "isController": false}, {"data": ["041 - /actions/Account.action ()-0", 2, 0, 0.0, 564.0, 553, 575, 564.0, 575.0, 575.0, 575.0, 0.06678688305616777, 0.015000960061443932, 0.05530788753088893], "isController": false}, {"data": ["036 - /actions/Order.action ()", 2, 0, 0.0, 573.0, 560, 586, 573.0, 586.0, 586.0, 586.0, 0.0669882100750268, 0.36830431906484457, 0.05625962955519828], "isController": false}, {"data": ["033 - /actions/Cart.action ()", 2, 0, 0.0, 629.5, 580, 679, 629.5, 679.0, 679.0, 679.0, 0.06678242286630158, 0.31728172582476294, 0.05739114465072793], "isController": false}, {"data": ["041 - /actions/Account.action ()", 2, 0, 0.0, 1166.0, 1140, 1192, 1166.0, 1192.0, 1192.0, 1192.0, 0.06550289850325877, 0.33762138505878886, 0.10791346657714604], "isController": false}, {"data": ["select product ID", 2, 0, 0.0, 635.5, 580, 691, 635.5, 691.0, 691.0, 691.0, 0.06656017039403621, 0.2796307158546326, 0.05707014609957402], "isController": true}, {"data": ["Click on confirm", 2, 0, 0.0, 587.0, 561, 613, 587.0, 613.0, 613.0, 613.0, 0.06678465288676663, 0.35655439192573546, 0.05458862740842155], "isController": true}, {"data": ["003 - /actions/Catalog.action ()", 2, 0, 0.0, 2141.5, 599, 3684, 2141.5, 3684.0, 3684.0, 3684.0, 0.060362780309661065, 0.31351508503606673, 0.04241310589140736], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 32, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});

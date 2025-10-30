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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.89, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()"], "isController": false}, {"data": [1.0, 500, 1500, "039 - /actions/Order.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "024 - /actions/Catalog.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "023 - /actions/Account.action ()-0"], "isController": false}, {"data": [1.0, 500, 1500, "Add to cart"], "isController": true}, {"data": [1.0, 500, 1500, "Preceed to checkout"], "isController": true}, {"data": [1.0, 500, 1500, "038 - /actions/Order.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "023 - /actions/Account.action ()-1"], "isController": false}, {"data": [0.5, 500, 1500, "Signout"], "isController": true}, {"data": [1.0, 500, 1500, "Click on continue"], "isController": true}, {"data": [1.0, 500, 1500, "042 - /actions/Catalog.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "030 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.5, 500, 1500, "Login"], "isController": true}, {"data": [0.5, 500, 1500, "Launch"], "isController": true}, {"data": [1.0, 500, 1500, "Click on fish"], "isController": true}, {"data": [0.75, 500, 1500, "023 - /actions/Account.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "026 - /actions/Catalog.action ()"], "isController": false}, {"data": [0.75, 500, 1500, "041 - /actions/Account.action ()-1"], "isController": false}, {"data": [1.0, 500, 1500, "041 - /actions/Account.action ()-0"], "isController": false}, {"data": [1.0, 500, 1500, "036 - /actions/Order.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "033 - /actions/Cart.action ()"], "isController": false}, {"data": [0.75, 500, 1500, "041 - /actions/Account.action ()"], "isController": false}, {"data": [1.0, 500, 1500, "select product ID"], "isController": true}, {"data": [1.0, 500, 1500, "Click on confirm"], "isController": true}, {"data": [0.5, 500, 1500, "003 - /actions/Catalog.action ()"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 32, 0, 0.0, 322.65625000000006, 158, 1777, 213.5, 511.5, 1096.4499999999978, 1777.0, 0.6913537570755736, 2.9606389148446612, 0.7070298996996932], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["021 - /actions/Account.action;jsessionid=BF49D44EA8540FCE37C1A1D090F491C6 ()", 2, 0, 0.0, 252.5, 198, 307, 252.5, 307.0, 307.0, 307.0, 0.07745333436604446, 0.30981333746417783, 0.0653134318604291], "isController": false}, {"data": ["039 - /actions/Order.action ()", 2, 0, 0.0, 243.5, 185, 302, 243.5, 302.0, 302.0, 302.0, 0.07885502503647045, 0.42099650573670305, 0.06445474214406813], "isController": false}, {"data": ["024 - /actions/Catalog.action ()", 2, 0, 0.0, 180.5, 167, 194, 180.5, 194.0, 194.0, 194.0, 0.07821666014861164, 0.39719397731716855, 0.06794308515838873], "isController": false}, {"data": ["023 - /actions/Account.action ()-0", 2, 0, 0.0, 194.5, 175, 214, 194.5, 214.0, 214.0, 214.0, 0.07785130400934215, 0.017486132736473335, 0.08936934361619307], "isController": false}, {"data": ["Add to cart", 2, 0, 0.0, 208.0, 201, 215, 208.0, 215.0, 215.0, 215.0, 0.07928327915642591, 0.3766730010703243, 0.06813406802505352], "isController": true}, {"data": ["Preceed to checkout", 2, 0, 0.0, 210.5, 192, 229, 210.5, 229.0, 229.0, 229.0, 0.07935563226600008, 0.4363009859937309, 0.0666463317858985], "isController": true}, {"data": ["038 - /actions/Order.action ()", 2, 0, 0.0, 347.0, 305, 389, 347.0, 389.0, 389.0, 389.0, 0.0788488074117879, 0.3673707618766016, 0.11265215355805244], "isController": false}, {"data": ["023 - /actions/Account.action ()-1", 2, 0, 0.0, 234.0, 187, 281, 234.0, 281.0, 281.0, 281.0, 0.0779483981604178, 0.39583170940837165, 0.07440874922051602], "isController": false}, {"data": ["Signout", 2, 0, 0.0, 734.0, 543, 925, 734.0, 925.0, 925.0, 925.0, 0.08017960230917254, 0.802657327413406, 0.19778679241500963], "isController": true}, {"data": ["Click on continue", 2, 0, 0.0, 347.0, 305, 389, 347.0, 389.0, 389.0, 389.0, 0.0788488074117879, 0.3673707618766016, 0.11265215355805244], "isController": true}, {"data": ["042 - /actions/Catalog.action ()", 2, 0, 0.0, 193.0, 191, 195, 193.0, 195.0, 195.0, 195.0, 0.08260025606079378, 0.4011436263577417, 0.06767735823731054], "isController": false}, {"data": ["030 - /actions/Catalog.action ()", 2, 0, 0.0, 349.5, 212, 487, 349.5, 487.0, 487.0, 487.0, 0.07839448102853559, 0.3293486888523048, 0.06721714291313892], "isController": false}, {"data": ["Login", 2, 0, 0.0, 865.0, 755, 975, 865.0, 975.0, 975.0, 975.0, 0.07581213752321746, 1.0902436886395512, 0.2891818448883666], "isController": true}, {"data": ["Launch", 2, 0, 0.0, 974.0, 171, 1777, 974.0, 1777.0, 1777.0, 1777.0, 0.07250842910488343, 0.3765977345647682, 0.0509470847079723], "isController": true}, {"data": ["Click on fish", 2, 0, 0.0, 262.5, 209, 316, 262.5, 316.0, 316.0, 316.0, 0.07809449433814916, 0.31451337368215543, 0.06451947481452558], "isController": true}, {"data": ["023 - /actions/Account.action ()", 2, 0, 0.0, 432.0, 363, 501, 432.0, 501.0, 501.0, 501.0, 0.07728572532653219, 0.40982567238581036, 0.16249625647267948], "isController": false}, {"data": ["026 - /actions/Catalog.action ()", 2, 0, 0.0, 262.5, 209, 316, 262.5, 316.0, 316.0, 316.0, 0.07809144508219125, 0.3145010932802311, 0.06451695560501347], "isController": false}, {"data": ["041 - /actions/Account.action ()-1", 2, 0, 0.0, 337.0, 158, 516, 337.0, 516.0, 516.0, 516.0, 0.08150291372916582, 0.4017838950242471, 0.06677826622926769], "isController": false}, {"data": ["041 - /actions/Account.action ()-0", 2, 0, 0.0, 203.0, 193, 213, 203.0, 213.0, 213.0, 213.0, 0.08132064731235261, 0.018265379767422946, 0.067343661055542], "isController": false}, {"data": ["036 - /actions/Order.action ()", 2, 0, 0.0, 210.5, 192, 229, 210.5, 229.0, 229.0, 229.0, 0.0793493354493156, 0.43626636580043643, 0.06664104344376116], "isController": false}, {"data": ["033 - /actions/Cart.action ()", 2, 0, 0.0, 208.0, 201, 215, 208.0, 215.0, 215.0, 215.0, 0.07928327915642591, 0.3766730010703243, 0.06813406802505352], "isController": false}, {"data": ["041 - /actions/Account.action ()", 2, 0, 0.0, 541.0, 352, 730, 541.0, 730.0, 730.0, 730.0, 0.08079828707631398, 0.41645835858279806, 0.13311202177513837], "isController": false}, {"data": ["select product ID", 2, 0, 0.0, 349.5, 212, 487, 349.5, 487.0, 487.0, 487.0, 0.07840677434530344, 0.32940033518896034, 0.06722768347185197], "isController": true}, {"data": ["Click on confirm", 2, 0, 0.0, 243.5, 185, 302, 243.5, 302.0, 302.0, 302.0, 0.07885502503647045, 0.42099650573670305, 0.06445474214406813], "isController": true}, {"data": ["003 - /actions/Catalog.action ()", 2, 0, 0.0, 974.0, 171, 1777, 974.0, 1777.0, 1777.0, 1777.0, 0.07287567409998542, 0.37850514912184813, 0.05120512452630812], "isController": false}]}, function(index, item){
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

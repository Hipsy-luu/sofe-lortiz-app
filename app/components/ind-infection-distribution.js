//import Component from '@glimmer/component';
import Component from "@ember/component";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";

import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';

am4core.useTheme(am4themes_dark);
am4core.useTheme(am4themes_animated);

export default class IndInfectionDistributionComponent extends Component {
    @tracked chart = null;
    @service individualapi;

    async didInsertElement() {
        this._super(...arguments);
        var chart = am4core.create("chartdiv40", am4charts.PieChart);
        await this.individualapi.sleep(2000);

        // Set data
        let selected;
        let fixedData = [{
            "category": "Critical",
            "value": this.individualapi.rateCritical ,
            "color": chart.colors.getIndex(1)
        }, {
            "category": "Death",
            "value": this.individualapi.rateDeaths ,
            "color": chart.colors.getIndex(2)
        }, {
            "category": "Recovered",
            "value": this.individualapi.rateRecoveries ,
            "color": chart.colors.getIndex(3)
        }, {
            "category": "Active",
            "value": this.individualapi.rateActive ,
            "color": chart.colors.getIndex(4)
        }];
        console.log(fixedData)

        let fixedTotalCases = this.individualapi.allData.cases;
        chart.data = fixedData;

        // Add and configure Series
        let pieSeries = chart.series.push(new am4charts.PieSeries());
        pieSeries.dataFields.value = "value";
        pieSeries.dataFields.category = "category";
        pieSeries.slices.template.propertyFields.fill = "color";
        /* pieSeries.slices.template.propertyFields.isActive = "pulled"; */
        pieSeries.slices.template.strokeWidth = 0;
        pieSeries.labels.template.disabled = true;
        pieSeries.ticks.template.disabled = true;



        /* function generateChartData() {
            let chartData = [];
            for (var i = 0; i < fixedData.length; i++) {
                if (i == selected) {
                    chartData.push({
                        category: fixedData[i].category,
                        value: (fixedData[i].cases / (fixedTotalCases / 100)).toFixed(0),
                        color: chart.colors.getIndex(i),
                        pulled: true
                    });
                } else {
                    chartData.push({
                        category: fixedData[i].category,
                        value: (fixedData[i].cases / (fixedTotalCases / 100)).toFixed(0),
                        color: chart.colors.getIndex(i),
                        id: i
                    });
                }
            }
            return chartData;
        } */

        /* pieSeries.slices.template.events.on("hit", function (event) {
            if (event.target.dataItem.dataContext.id != undefined) {
                selected = event.target.dataItem.dataContext.id;
            } else {
                selected = undefined;
            }
            chart.data = generateChartData();
        }); */

        this.chart = chart;
    };

    willDestroyElement() {
        if (this.chart) {
            this.chart.dispose();
        }
        this._super(...arguments);
    }
}

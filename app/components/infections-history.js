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

export default class InfectionsHistoryComponent extends Component {
    @tracked chart = null;
    @service api;

    async didInsertElement() {
        var chart = am4core.create("chartdiv3", am4charts.XYChart);
        await this.api.sleep(3500);

        let dataFixed = [];
        for (var key in this.api.globalTimeLine) {
            if (this.api.globalTimeLine.hasOwnProperty(key)) {
                //console.log(this.api.globalTimeLine[key]);
                dataFixed.push({ date: new Date(key) ,cases: this.api.globalTimeLine[key].cases,deaths: this.api.globalTimeLine[key].deaths,recovered: this.api.globalTimeLine[key].recovered})
            }
        }
        // Create axes
        let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

        /* for (var i = 0; i < 3; i++) {
            createSeries("value" + i, "Series #" + i);
        } */

        createSeries("cases", "Cases" );
        createSeries("deaths", "Deaths" );
        createSeries("recovered", "Recovered" );

        // Create series
        function createSeries(s, name) {
            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.valueY = "value" + s;
            series.dataFields.dateX = "date";
            series.tooltipText = "{value"+s+"} "+ name;
            series.name = name;

            let segment = series.segments.template;
            segment.interactionsEnabled = true;

            let hoverState = segment.states.create("hover");
            hoverState.properties.strokeWidth = 3;

            let dimmed = segment.states.create("dimmed");
            dimmed.properties.stroke = am4core.color("#dadada");

            segment.events.on("over", function (event) {
                processOver(event.target.parent.parent.parent);
            });

            segment.events.on("out", function (event) {
                processOut(event.target.parent.parent.parent);
            });

            let data = [];
            let value = Math.round(Math.random() * 100) + 100;
            for (var i = 0; i < dataFixed.length ; i++) {
                value = dataFixed[i][s];
                let dataItem = { date: dataFixed[i].date };
                dataItem["value" + s] = value;
                data.push(dataItem);
            }

            series.data = data;
            return series;
        }

        chart.legend = new am4charts.Legend();
        chart.legend.position = "down";
        chart.legend.scrollable = true;
        chart.legend.itemContainers.template.events.on("over", function (event) {
            processOver(event.target.dataItem.dataContext);
        })

        chart.legend.itemContainers.template.events.on("out", function (event) {
            processOut(event.target.dataItem.dataContext);
        })

        function processOver(hoveredSeries) {
            hoveredSeries.toFront();

            hoveredSeries.segments.each(function (segment) {
                segment.setState("hover");
            })

            chart.series.each(function (series) {
                if (series != hoveredSeries) {
                    series.segments.each(function (segment) {
                        segment.setState("dimmed");
                    })
                    series.bulletsContainer.setState("dimmed");
                }
            });
        }

        function processOut(hoveredSeries) {
            chart.series.each(function (series) {
                series.segments.each(function (segment) {
                    segment.setState("default");
                })
                series.bulletsContainer.setState("default");
            });
        }
        chart.cursor = new am4charts.XYCursor();
        /* chart.cursor.snapToSeries = series; */
        chart.cursor.xAxis = dateAxis;
        
        this.chart = chart;
    };

    willDestroyElement() {
        if (this.chart) {
            this.chart.dispose();
        }
        this._super(...arguments);
    }
}

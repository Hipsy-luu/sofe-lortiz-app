import { A } from '@ember/array';
import Service from '@ember/service';
import axios from 'axios';
import Ember from 'ember';
import { tracked } from '@glimmer/tracking';

export default class IndividualapiService extends Service {
    //items = A([]);
    @tracked dataReady = false;
    
    @tracked allData = {};
    @tracked allCountriesData = [];
    @tracked filteredCountriesData = [];
    @tracked topListData = [{
        title: "Infections",
        total: 0,
        percent: "",//este no lleva nada
        aditionalData: 0 + " today",
        color: "#21afdd"
    },{
        title: "Deaths",
        total: 0,
        percent:  ((0)).toFixed(2) + "%",
        aditionalData: 0+ " today",
        color: "#ff5b5b"
    },{
        title: "Recoveries",
        total: 0,
        percent: (0).toFixed(2) + "%",
        aditionalData: 0 + " remaining",
        color: "#10c469"
    },{
        title: "Critical",
        total: 0,
        percent: ((0)).toFixed(2) + "%",
        aditionalData: 0 + "  per million",
        color: "#f9c851"
    }];
    @tracked globalTimeLine = [];
    @tracked globalCountrieTimeLine = [];

    @tracked rateInfections = 0;
    @tracked rateDeaths = 0;
    @tracked rateRecoveries = 0;
    @tracked rateCritical = 0;

    async initService(name) {
        this.allData = await this.getIndividualGeneralDataApi(name);
        console.log(this.allData);
        /* this.allCountriesData = await this.getAllCountriesDataApi(); */
        this.globalTimeLine = await this.getIndividualTimelineDataApi(name);
        console.log(this.globalTimeLine)
        //this.globalCountrieTimeLine = await this.getAllGlobalContrieTimeLineApi();

        let totalCritical = 0;
        let totalCriticalPerMillion = 0;
        let totalActive = 0;
        let todayInfections = 0;
        let todayDeaths = 0;
        
        
        totalCritical = this.allData.critical + totalCritical;
        totalCriticalPerMillion = this.allData.casesPerOneMillion + totalCriticalPerMillion;
        totalActive = this.allData.active + totalActive;
        todayInfections = this.allData.todayCases + todayInfections;
        todayDeaths = this.allData.todayDeaths + todayDeaths;
        
        this.rateActive = (100-((totalCritical)/(this.allData.cases/100))).toFixed(2);
        this.rateDeaths = ((this.allData.recovered/(this.allData.cases/100))).toFixed(2);
        this.rateRecoveries = (100-(this.allData.recovered/(this.allData.cases/100))).toFixed(2);
        this.rateCritical = ((totalCritical/(totalActive/100))).toFixed(2);

        this.topListData = [{
            title: "Infections",
            total: this.allData.cases,
            percent: "",//este no lleva nada
            aditionalData: (todayInfections).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " today",
            color: "#21afdd"
        },{
            title: "Deaths",
            total: this.allData.deaths,
            percent: this.rateDeaths  + "%",
            aditionalData: (todayDeaths).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " today",
            color: "#ff5b5b"
        },{
            title: "Recoveries",
            total: this.allData.recovered,
            percent: this.rateRecoveries + "%",
            aditionalData: (this.allData.cases-this.allData.recovered-this.allData.deaths).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + " remaining",
            color: "#10c469"
        },{
            title: "Critical",
            total: totalCritical,
            percent: this.rateCritical + "%",
            aditionalData: (totalCriticalPerMillion.toFixed(2)).toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,') + "  per million",
            color: "#f9c851"
        }];
        /* this.filteredCountriesData = Array.from(this.allCountriesData); */
        //await this.sleep(5000);
        //console.log(this.filteredCountriesData)
        
        this.dataReady = true;
    }

    async getIndividualGeneralDataApi(name) {
        return new Promise((resolve, reject) => {
            axios.get("http://api.coronastatistics.live/countries/"+name).then((response) => {
                resolve(response.data);
            })
        });
    }

    async getIndividualTimelineDataApi(name) {
        return new Promise((resolve, reject) => {
            axios.get("http://api.coronastatistics.live/timeline/"+name).then((response) => {
                resolve(response.data);
            })
        });
    }

    async sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class DataTableComponent extends Component {

    @tracked searchValue;
    @service api;

    @action
    filterByName(event) {
        let ssearchValue = event.target.value.charAt(0).toLowerCase() + event.target.value.slice(1);

        if(this.searchValue==""){
            this.api.filteredCountriesData = Array.from(this.api.allCountriesData)
        }else{
            this.api.filteredCountriesData = this.api.allCountriesData.filter(function(contrie) {
                let fixed = contrie.country.charAt(0).toUpperCase() + event.target.value.slice(1);
                return contrie.country.toLowerCase().includes( ssearchValue );
            });
        }
    }

    @action
    shortByOpc(event) {
        switch (event) {
            //Por total de casos
            case "cases":
                this.api.allCountriesData.sort((a, b) => (a.cases > b.cases) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
             //Por casos de hoy
             case "todayCases":
                this.api.allCountriesData.sort((a, b) => (a.todayCases > b.todayCases) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
             //Por total de muertes
             case "deaths":
                this.api.allCountriesData.sort((a, b) => (a.deaths > b.deaths) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
             //Por muertes de hoy
             case "todayDeaths":
                this.api.allCountriesData.sort((a, b) => (a.todayDeaths > b.todayDeaths) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
             //Por total de recuperados
             case "recovered":
                this.api.allCountriesData.sort((a, b) => (a.recovered > b.recovered) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
             //Por total de casos activos
             case "active":
                this.api.allCountriesData.sort((a, b) => (a.active > b.active) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
             //Por total de casos criticos
             case "critical":
                this.api.allCountriesData.sort((a, b) => (a.critical > b.critical) ? -1 : 1);
                this.api.filteredCountriesData = this.api.allCountriesData;
                break;
        }

        console.log(event);
    }


}

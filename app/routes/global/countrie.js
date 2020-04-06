import Route from '@ember/routing/route';
import { inject as service } from '@ember/service';

export default class GlobalCountrieRoute extends Route {
    @service api;
    @service individualapi;

    async model(params) {
        console.log(params.countrie);
        this.api.initService();
        this.individualapi.initService(params.countrie);
        return {name : params.countrie};
    }
}

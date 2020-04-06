import Route from '@ember/routing/route';
import { tracked } from '@glimmer/tracking';
import { getOwner } from '@ember/application';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class HomeRoute extends Route {
    @tracked dataReady = 0;

    @service api;

    async model() {
        this.api.initService();
        return {};
    }
}

import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';

export default class TopBoxComponent extends Component {
  @service api;

  @action
  showPerson(person) {
    alert(`The person's name is ${person}!`);
  }
}
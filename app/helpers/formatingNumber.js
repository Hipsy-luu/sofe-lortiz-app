import { helper } from '@ember/component/helper';

export default helper(function formating(params/*, hash*/) {
  return params.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
});

//      
import { RulesFileValidationError } from '../../util/errors';

function validatePathAliasRules(location        , rules     ) {
  if (!Array.isArray(rules)) {
    return new RulesFileValidationError(location, 'rules must be an array');
  } if (rules.length === 0) {
    return new RulesFileValidationError(location, 'empty rules');
  }

  for (const rule of rules) {
    if (!(rule instanceof Object)) {
      return new RulesFileValidationError(
        location,
        'all rules must be objects'
      );
    } if (!rule.dest) {
      return new RulesFileValidationError(
        location,
        'all rules must have a dest field'
      );
    }
  }
}

export default validatePathAliasRules;

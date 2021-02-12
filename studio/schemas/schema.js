import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import program from './documents/program';
import location from './documents/location';
import topic from './documents/topic';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([program, location, topic]),
});

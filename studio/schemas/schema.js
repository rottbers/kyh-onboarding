import createSchema from 'part:@sanity/base/schema-creator';
import schemaTypes from 'all:part:@sanity/base/schema-type';

import location from './documents/location';
import program from './documents/program';
import topic from './documents/topic';

import figure from './objects/figure';
import youtube from './objects/youtube';

export default createSchema({
  name: 'default',
  types: schemaTypes.concat([location, program, topic, figure, youtube]),
});

import assert from 'node:assert/strict';
import { PageBlockTreeSchema } from '../packages/shared/src/builder-schema';
import { createAboutPageTree } from '../packages/shared/src/page-trees/about';

const tree = createAboutPageTree();
PageBlockTreeSchema.parse(tree);

assert.equal(
  Object.values(tree.nodes).some((node) => node.type === 'badge'),
  false,
  'The live About page does not contain invented OUR GENESIS / OUR PATH / OUR PEOPLE badges',
);

const journey = Object.values(tree.nodes).find((node) => node.type === 'journey-carousel');
assert.ok(journey, 'About must use the live horizontal journey carousel');
assert.equal(journey.content.title, 'Our Journey');
assert.equal(journey.content.milestones.length, 7, 'All seven live journey milestones must remain editable');

const teamHeading = tree.nodes.h2_team;
assert.equal(teamHeading.content.text, "A team you'll be proud to call your own");

const foundersGrid = tree.nodes.grid_about_founders;
assert.equal(foundersGrid.styles.gridColumns, 'minmax(0, 520px) minmax(0, 1fr)');
assert.equal(foundersGrid.styles.gap, '64px');

console.log('About live-parity tree contracts pass.');

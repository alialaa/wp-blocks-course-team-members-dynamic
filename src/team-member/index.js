import { registerBlockType } from '@wordpress/blocks';

registerBlockType( 'blocks-course/team-member', {
	title: 'Team Member',
	description: 'Team member item.',
	icon: 'admin-users',
	parent: [ 'blocks-course/team-members' ],
	edit: () => null,
	save: () => null,
} );

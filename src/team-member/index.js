import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';

registerBlockType( 'blocks-course/team-member', {
	title: 'Team Member',
	description: 'Team member item.',
	icon: 'admin-users',
	parent: [ 'blocks-course/team-members' ],
	supports: {
		html: false,
		reusable: false,
	},
	attributes: {
		name: {
			type: 'string',
			source: 'html',
			selector: 'h4',
		},
		bio: {
			type: 'string',
			source: 'html',
			selector: 'p',
		},
	},
	edit: Edit,
	save: Save,
} );

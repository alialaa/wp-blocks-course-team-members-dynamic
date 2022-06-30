import { registerBlockType } from '@wordpress/blocks';
import Edit from './edit';
import Save from './save';

registerBlockType( 'blocks-course/team-member', {
	edit: Edit,
	save: Save,
} );

import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';

export default function Edit( { attributes, setAttributes } ) {
	const { name, bio } = attributes;
	const onChangeName = ( value ) => {
		setAttributes( { name: value } );
	};
	const onChangeBio = ( value ) => {
		setAttributes( { bio: value } );
	};
	return (
		<div { ...useBlockProps() }>
			<MediaPlaceholder
				icon="admin-users"
				onSelect={ ( val ) => console.log( val ) }
				onSelectURL={ ( val ) => console.log( val ) }
				onError={ ( val ) => console.log( val ) }
				accept="image/*"
				allowedTypes={ [ 'image' ] }
			/>
			<RichText
				onChange={ onChangeName }
				value={ name }
				placeholder={ __( 'Member Name', 'team-members' ) }
				tagName="h4"
				allowedFormats={ [] }
			/>
			<RichText
				onChange={ onChangeBio }
				value={ bio }
				placeholder={ __( 'Member Bio', 'team-members' ) }
				tagName="p"
				allowedFormats={ [] }
			/>
		</div>
	);
}

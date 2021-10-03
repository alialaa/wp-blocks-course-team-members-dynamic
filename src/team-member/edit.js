import { useBlockProps, RichText } from '@wordpress/block-editor';
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

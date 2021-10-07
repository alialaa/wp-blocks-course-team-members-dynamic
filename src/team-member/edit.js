import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { isBlobURL } from '@wordpress/blob';
import { Spinner } from '@wordpress/components';

export default function Edit( { attributes, setAttributes } ) {
	const { name, bio, url, alt } = attributes;
	const onChangeName = ( value ) => {
		setAttributes( { name: value } );
	};
	const onChangeBio = ( value ) => {
		setAttributes( { bio: value } );
	};
	const onSelectImage = ( image ) => {
		if ( ! image || ! image.url ) {
			setAttributes( { url: undefined, id: undefined, alt: '' } );
			return;
		}
		setAttributes( { url: image.url, id: image.id, alt: image.alt } );
	};
	return (
		<div { ...useBlockProps() }>
			{ url && (
				<div
					className={ `wp-block-blocks-course-team-member-img${
						isBlobURL( url ) ? ' is-loading' : ''
					}` }
				>
					<img src={ url } alt={ alt } />
					{ isBlobURL( url ) && <Spinner /> }
				</div>
			) }
			<MediaPlaceholder
				icon="admin-users"
				onSelect={ onSelectImage }
				onSelectURL={ ( val ) => console.log( val ) }
				onError={ ( val ) => console.log( val ) }
				accept="image/*"
				allowedTypes={ [ 'image' ] }
				disableMediaButtons={ url }
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

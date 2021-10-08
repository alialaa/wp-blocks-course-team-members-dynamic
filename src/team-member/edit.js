import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { isBlobURL } from '@wordpress/blob';
import { Spinner, withNotices } from '@wordpress/components';

function Edit( { attributes, setAttributes, noticeUI, noticeOperations } ) {
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

	const onSelectURL = ( newURL ) => {
		setAttributes( {
			url: newURL,
			id: undefined,
			alt: '',
		} );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
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
				onSelectURL={ onSelectURL }
				onError={ onUploadError }
				notices={ noticeUI }
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

export default withNotices( Edit );

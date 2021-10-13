import { useEffect, useState, useRef } from '@wordpress/element';
import {
	useBlockProps,
	RichText,
	MediaPlaceholder,
	BlockControls,
	MediaReplaceFlow,
	InspectorControls,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { usePrevious } from '@wordpress/compose';
import { isBlobURL, revokeBlobURL } from '@wordpress/blob';
import {
	Spinner,
	withNotices,
	Icon,
	Tooltip,
	ToolbarButton,
	PanelBody,
	TextareaControl,
	SelectControl,
	TextControl,
	Button,
} from '@wordpress/components';
import {
	SortableContext,
	horizontalListSortingStrategy,
	arrayMove,
} from '@dnd-kit/sortable';
import {
	DndContext,
	useSensor,
	useSensors,
	PointerSensor,
} from '@dnd-kit/core';
import { restrictToHorizontalAxis } from '@dnd-kit/modifiers';
import { SortableItem } from './sortable-item';

function Edit( {
	attributes,
	setAttributes,
	noticeUI,
	noticeOperations,
	isSelected,
} ) {
	const [ blobURL, setBlobURL ] = useState();
	const [ selectedLink, setSelectedLink ] = useState();

	const sensors = useSensors(
		useSensor( PointerSensor, {
			activationConstraint: { distance: 5 },
		} )
	);

	const titleRef = useRef();

	const { name, bio, url, alt, id, socialLinks } = attributes;

	const prevURL = usePrevious( url );
	const prevIsSelected = usePrevious( isSelected );

	const imageObject = useSelect(
		( select ) => {
			const { getMedia } = select( 'core' );

			return id ? getMedia( id ) : null;
		},
		[ id ]
	);

	const imageSizes = useSelect( ( select ) => {
		return select( blockEditorStore ).getSettings().imageSizes;
	}, [] );

	const getImageSizeOptions = () => {
		if ( ! imageObject ) return [];
		const options = [];
		const sizes = imageObject.media_details.sizes;
		for ( const key in sizes ) {
			const size = sizes[ key ];
			const imageSize = imageSizes.find( ( s ) => s.slug === key );
			if ( imageSize ) {
				options.push( {
					label: imageSize.name,
					value: size.source_url,
				} );
			}
		}
		return options;
	};

	const onChangeName = ( value ) => {
		setAttributes( { name: value } );
	};
	const onChangeBio = ( value ) => {
		setAttributes( { bio: value } );
	};
	const onChangeAltText = ( value ) => {
		setAttributes( { alt: value } );
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

	const onChangeImageSize = ( newURL ) => {
		setAttributes( {
			url: newURL,
		} );
	};

	const removeImage = () => {
		setAttributes( {
			url: undefined,
			id: undefined,
			alt: '',
		} );
	};

	const onUploadError = ( message ) => {
		noticeOperations.removeAllNotices();
		noticeOperations.createErrorNotice( message );
	};

	const addNewSocialLink = () => {
		setAttributes( {
			socialLinks: [ ...socialLinks, { icon: 'wordpress', link: '' } ],
		} );
		setSelectedLink( socialLinks.length );
	};

	const updateSocialItem = ( type, value ) => {
		const socialLinksCopy = [ ...socialLinks ];
		socialLinksCopy[ selectedLink ][ type ] = value;
		setAttributes( { socialLinks: socialLinksCopy } );
	};

	const removeSocialItem = () => {
		setAttributes( {
			socialLinks: [
				...socialLinks.slice( 0, selectedLink ),
				...socialLinks.slice( selectedLink + 1 ),
			],
		} );
		setSelectedLink( undefined );
	};

	const handleDragEnd = ( event ) => {
		const { active, over } = event;
		if ( active.id !== over.id ) {
			const oldIndex = socialLinks.findIndex(
				( i ) => i.icon === active.id
			);
			const newIndex = socialLinks.findIndex(
				( i ) => i.icon === over.id
			);
			setAttributes( {
				socialLinks: arrayMove( socialLinks, oldIndex, newIndex ),
			} );
			setSelectedLink( newIndex );
		}
	};

	useEffect( () => {
		if ( ! id && isBlobURL( url ) ) {
			setAttributes( {
				url: undefined,
				alt: '',
			} );
		}
	}, [] );

	useEffect( () => {
		if ( isBlobURL( url ) ) {
			setBlobURL( url );
		} else {
			revokeBlobURL( blobURL );
			setBlobURL();
		}
	}, [ url ] );

	useEffect( () => {
		if ( url && ! prevURL ) {
			titleRef.current.focus();
		}
	}, [ url, prevURL ] );

	useEffect( () => {
		if ( prevIsSelected && ! isSelected ) {
			setSelectedLink( undefined );
		}
	}, [ isSelected, prevIsSelected ] );

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Image Settings', 'team-members' ) }>
					{ id && (
						<SelectControl
							label={ __( 'Image Size', 'team-members' ) }
							value={ url }
							onChange={ onChangeImageSize }
							options={ getImageSizeOptions() }
						/>
					) }

					{ url && ! isBlobURL( url ) && (
						<TextareaControl
							label={ __(
								'Alt Text (Alternative Text)',
								'team-members'
							) }
							value={ alt }
							onChange={ onChangeAltText }
							help={ __(
								"Alternative text describes your image to people can't see it. Add a short description with its key details.",
								'team-members'
							) }
						/>
					) }
				</PanelBody>
			</InspectorControls>
			{ url && (
				<BlockControls group="inline">
					<MediaReplaceFlow
						name={
							<Tooltip
								text={ __( 'Replace Image', 'team-members' ) }
							>
								<div>
									<Icon icon="format-image" />
									<span className="screen-reader-text">
										{ __(
											'Replace Image',
											'team-members'
										) }
									</span>
								</div>
							</Tooltip>
						}
						mediaId={ id }
						mediaURL={ url }
						allowedTypes={ [ 'image' ] }
						accept="image/*"
						onSelect={ onSelectImage }
						onSelectURL={ onSelectURL }
						onError={ onUploadError }
					/>
					<ToolbarButton
						title={ __( 'Remove Image', 'team-members' ) }
						icon="trash"
						onClick={ removeImage }
					/>
				</BlockControls>
			) }

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
					ref={ titleRef }
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
				<div className="wp-block-blocks-course-team-member-social-links">
					<ul>
						<DndContext
							sensors={ sensors }
							onDragEnd={ handleDragEnd }
							modifiers={ [ restrictToHorizontalAxis ] }
						>
							<SortableContext
								items={ socialLinks.map(
									( item ) => `${ item.icon }`
								) }
								strategy={ horizontalListSortingStrategy }
							>
								{ socialLinks.map( ( item, index ) => (
									<SortableItem
										key={ item.icon }
										id={ `${ item.icon }` }
										index={ index }
										selectedLink={ selectedLink }
										setSelectedLink={ setSelectedLink }
										icon={ item.icon }
									/>
								) ) }
							</SortableContext>
						</DndContext>

						{ isSelected && (
							<li
								className={
									'wp-block-blocks-course-team-member-add-icon-li'
								}
							>
								<Tooltip
									text={ __(
										'Add Social Link',
										'team-members'
									) }
								>
									<button
										aria-label={ __(
											'Add Social Link',
											'team-members'
										) }
										onClick={ addNewSocialLink }
									>
										<Icon icon="plus" size={ 14 } />
									</button>
								</Tooltip>
							</li>
						) }
					</ul>
				</div>
				{ selectedLink !== undefined && (
					<div className="wp-block-blocks-course-team-member-link-form">
						<TextControl
							label={ __( 'Icon', 'team-members' ) }
							value={ socialLinks[ selectedLink ].icon }
							onChange={ ( icon ) =>
								updateSocialItem( 'icon', icon )
							}
						/>
						<TextControl
							label={ __( 'URL', 'team-members' ) }
							value={ socialLinks[ selectedLink ].link }
							onChange={ ( link ) =>
								updateSocialItem( 'link', link )
							}
						/>
						<br />
						<Button isDestructive onClick={ removeSocialItem }>
							{ __( 'Remove Link', 'team-members' ) }
						</Button>
					</div>
				) }
			</div>
		</>
	);
}

export default withNotices( Edit );

import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
} from '@wordpress/block-editor';
import { PanelBody, RangeControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';

import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { columns } = attributes;

	const onChangeColumns = ( value ) => {
		setAttributes( { columns: value } );
	};
	return (
		<div
			{ ...useBlockProps( {
				className: `has-${ columns }-columns`,
			} ) }
		>
			<InspectorControls>
				<PanelBody>
					<RangeControl
						label={ __( 'Columns', 'team-members' ) }
						value={ columns }
						onChange={ onChangeColumns }
						min={ 1 }
						max={ 6 }
					/>
				</PanelBody>
			</InspectorControls>
			<InnerBlocks
				orientation="horizontal"
				allowedBlocks={ [ 'blocks-course/team-member' ] }
				template={ [
					[ 'blocks-course/team-member' ],
					[ 'blocks-course/team-member' ],
					[ 'blocks-course/team-member' ],
				] }
			/>
		</div>
	);
}

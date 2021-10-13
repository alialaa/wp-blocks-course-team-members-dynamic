import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { __ } from '@wordpress/i18n';
import { Icon } from '@wordpress/components';

export function SortableItem( props ) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
	} = useSortable( { id: props.id } );
	const style = {
		/* stylelint-disable-next-line */
		transform: CSS.Transform.toString( transform ),
		transition,
	};

	return (
		<li
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
			className={
				props.selectedLink === props.index ? 'is-selected' : null
			}
		>
			<button
				aria-label={ __( 'Edit Link', 'team-members' ) }
				onClick={ () => props.setSelectedLink( props.index ) }
			>
				<Icon icon={ props.icon } size={ 16 } />
			</button>
		</li>
	);
}

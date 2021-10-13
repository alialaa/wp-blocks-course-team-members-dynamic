import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
		background: '#f03',
		height: '40px',
		marginBottom: 20,
	};

	return (
		<div
			ref={ setNodeRef }
			style={ style }
			{ ...attributes }
			{ ...listeners }
		></div>
	);
}

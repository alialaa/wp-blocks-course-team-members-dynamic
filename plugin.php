<?php
/**
 * Plugin Name:       Team Members
 * Description:       Team members grid
 * Requires at least: 5.7
 * Requires PHP:      7.0
 * Version:           0.1.0
 * Author:            Ali Alaa
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       team-members
 *
 * @package           blocks-course
 */

/**
 * Registers the block using the metadata loaded from the `block.json` file.
 * Behind the scenes, it registers also all assets so they can be enqueued
 * through the block editor in the corresponding context.
 *
 * @see https://developer.wordpress.org/block-editor/tutorials/block-tutorial/writing-your-first-block-type/
 */
function blocks_course_render_team_members($attributes, $content) {
	$members = '<div ' . get_block_wrapper_attributes(array(
		'class' => 'has-' . $attributes['columns'] . '-columns'
	)) . '>';
	$members .= $content;
	$members .= '</div>';
	return $members;
}
function blocks_course_render_team_member($attributes) {
	$member = '<div ' . get_block_wrapper_attributes() . '>';
	if(isset( $attributes['id'] )) {
		$member .= wp_get_attachment_image($attributes['id'], 'large');
	}
	if(isset( $attributes['name'] )) {
		$member .= '<h4>' .  $attributes['name'] . '</h4>';
	}
	if(isset( $attributes['bio'] )) {
		$member .= '<p>' .  $attributes['bio'] . '</p>';
	}
	if(isset( $attributes['socialLinks'] ) && !empty( $attributes['socialLinks'] )) {
		$member .= '<div class="wp-block-blocks-course-team-member-social-links">';
		$member .='<ul>';
		foreach ($attributes['socialLinks'] as $socialLink) {
			$member .= '<li>';
			$member .= '<a href="' . $socialLink['link'] . '">';
			$member .= '<span class="dashicon dashicons dashicons-' . $socialLink['icon'] . '"></span>';
			$member .= '</a>';
			$member .= '</li>';
		}
		$member .='</ul>';
		$member .= '</div>';
	}

	$member .= '</div>';
	return $member;
}

function blocks_course_team_members_block_init() {
	register_block_type_from_metadata( __DIR__ . '/child-block.json', array(
		'render_callback' => 'blocks_course_render_team_member',
	) );
	register_block_type_from_metadata( __DIR__, array(
		'render_callback' => 'blocks_course_render_team_members',
	) );
}
add_action( 'init', 'blocks_course_team_members_block_init' );

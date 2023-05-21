<template>
<div class="mkw-polls">
	<ui-container :show-header="!props.compact">
		<template #header><fa icon="chart-pie"/>{{ $t('title') }}</template>

		<div class="mkw-polls--body">
			<p class="empty"><fa icon="exclamation-circle"/>this widget has been abolished</p>
		</div>
	</ui-container>
</div>
</template>

<script lang="ts">
import define from '../../../common/define-widget';
import i18n from '../../../i18n';

export default define({
	name: 'polls',
	props: () => ({
		compact: false
	})
}).extend({
	i18n: i18n('desktop/views/widgets/polls.vue')
});
</script>

<style lang="stylus" scoped>
.mkw-polls
	.mkw-polls--body
		> .empty
			margin 0
			padding 16px
			text-align center
			color var(--text)

			> [data-icon]
				margin-right 4px

</style>

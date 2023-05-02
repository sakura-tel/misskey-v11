<template>
	<div class="mk-admin" v-if="isModerator" :class="{ isMobile }">
		<header v-show="isMobile">
			<button class="nav" @click="navOpend = true"><fa icon="bars"/></button>
			<span>Areionskey Admin</span>
		</header>
		<div class="nav-backdrop"
			v-if="navOpend && isMobile"
			@click="navOpend = false"
			@touchstart="navOpend = false"
		></div>
		<nav v-show="navOpend">
			<div class="mi">
				<img svg-inline src="../assets/header-icon.svg"/>
			</div>
			<div class="me" v-if="i">
				<img class="avatar" :src="i.avatarUrl" alt="avatar"/>
				<div class="info">
					<div class="name"><mk-user-name :user="$store.state.i"/></div>
					<span class="role">{{ $store.getters.role }}</span>
				</div>
			</div>
			<ul>
				<li><router-link to="/dashboard" active-class="active"><fa icon="home" fixed-width/>{{ $t('dashboard') }}</router-link></li>
				<li><router-link to="/instance" active-class="active" v-if="$store.getters.isAdmin"><fa icon="cog" fixed-width/>{{ $t('instance') }}</router-link></li>
				<li><router-link to="/queue" active-class="active"><fa :icon="faTasks" fixed-width/>{{ $t('queue') }}</router-link></li>
				<li><router-link to="/db" active-class="active" v-if="$store.getters.isAdmin"><fa :icon="faDatabase" fixed-width/>{{ $t('db') }}</router-link></li>
				<li><router-link to="/moderators" active-class="active" v-if="$store.getters.isAdmin"><fa :icon="faHeadset" fixed-width/>{{ $t('moderators') }}</router-link></li>
				<li><router-link to="/users" active-class="active"><fa icon="users" fixed-width/>{{ $t('users') }}</router-link></li>
				<li><router-link to="/drive" active-class="active"><fa icon="cloud" fixed-width/>{{ $t('@.drive') }}</router-link></li>
				<li><router-link to="/federation" active-class="active"><fa :icon="faGlobe" fixed-width/>{{ $t('federation') }}</router-link></li>
				<li><router-link to="/relays" active-class="active"><fa :icon="faProjectDiagram" fixed-width/>{{ $t('relays') }}</router-link></li>
				<li><router-link to="/emoji" active-class="active"><fa :icon="faGrin" fixed-width/>{{ $t('emoji') }}</router-link></li>
				<li><router-link to="/announcements" active-class="active" v-if="$store.getters.isAdmin"><fa icon="broadcast-tower" fixed-width/>{{ $t('announcements') }}</router-link></li>
				<li><router-link to="/abuse" active-class="active"><fa :icon="faExclamationCircle" fixed-width/>{{ $t('abuse') }}</router-link></li>
			</ul>
			<div class="back-to-misskey">
				<a href="/"><fa :icon="faArrowLeft"/> {{ $t('back-to-misskey') }}</a>
			</div>
			<div class="version">
				<small>Areionskey {{ version }}</small>
			</div>
		</nav>
		<main>
			<div class="page">
				<template>
					<div v-if="page == 'dashboard'"><x-dashboard/></div>
					<div v-if="page == 'instance'"><x-instance/></div>
					<div v-if="page == 'queue'"><x-queue/></div>
					<div v-if="page == 'db'"><x-db/></div>
					<div v-if="page == 'moderators'"><x-moderators/></div>
					<div v-if="page == 'users'"><x-users/></div>
					<div v-if="page == 'emoji'"><x-emoji/></div>
					<div v-if="page == 'announcements'"><x-announcements/></div>
					<div v-if="page == 'drive'"><x-drive/></div>
					<div v-if="page == 'federation'"><x-federation/></div>
					<div v-if="page == 'relays'"><x-relays/></div>
					<div v-if="page == 'abuse'"><x-abuse/></div>
				</template>
			</div>
		</main>
	</div>
	<div v-else class="denied">
		<h1>{{ $t('permission-denied') }}</h1>
		<p>{{ $t('permission-denied-text') }}</p>
		<p><a href="/">{{ $t('back-to-misskey') }}</a></p>
	</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../i18n';
import { version } from '../../config';
import XDashboard from './dashboard.vue';
import XInstance from './instance.vue';
import XQueue from './queue.vue';
import XDb from './db.vue';
import XModerators from './moderators.vue';
import XEmoji from './emoji.vue';
import XAnnouncements from './announcements.vue';
import XUsers from './users.vue';
import XDrive from './drive.vue';
import XAbuse from './abuse.vue';
import XFederation from './federation.vue';
import XRelays from "./relays.vue";

import { faHeadset, faArrowLeft, faGlobe, faProjectDiagram, faExclamationCircle, faTasks, faDatabase } from '@fortawesome/free-solid-svg-icons';
import { faGrin } from '@fortawesome/free-regular-svg-icons';

// Detect the user agent
const ua = navigator.userAgent.toLowerCase();
const isMobile = /mobile|iphone|ipad|android/.test(ua);

export default Vue.extend({
	i18n: i18n('admin/views/index.vue'),
	components: {
		XDashboard,
		XInstance,
		XQueue,
		XDb,
		XModerators,
		XEmoji,
		XAnnouncements,
		XUsers,
		XDrive,
		XAbuse,
		XFederation,
		XRelays,
	},
	provide: {
		isMobile
	},
	data() {
		return {
			version,
			isMobile,
			navOpend: !isMobile,
			faGrin,
			faArrowLeft,
			faHeadset,
			faGlobe,
			faProjectDiagram,
			faExclamationCircle,
			faTasks,
			faDatabase,
		};
	},
	computed: {
		page() {
			return this.$route.params.page;
		},
		i() {
			return this.$store.state.i;
		},
		isModerator() {
			if (this.i) {
				return this.i.isAdmin || this.i.isModerator;
			}
		}
	}
});
</script>

<style lang="stylus" scoped>
.mk-admin
	$headerHeight = 48px

	display flex
	height 100%

	> header
		position fixed
		top 0
		z-index 10000
		width 100%
		color var(--mobileHeaderFg)
		background-color var(--mobileHeaderBg)
		box-shadow 0 1px 0 rgba(#000, 0.075)

		&, *
			user-select none

		> span
			display block
			line-height $headerHeight
			text-align center

		> .nav
			display block
			position absolute
			top 0
			left 0
			z-index 10001
			padding 0
			width $headerHeight
			font-size 1.4em
			line-height $headerHeight
			border-right solid 1px rgba(#000, 0.1)

			> [data-icon]
				transition all 0.2s ease

	> nav
		position fixed
		z-index 20001
		top 0
		left 0
		width 250px
		height 100vh
		overflow auto
		background #333
		color #fff

		> .mi
			text-align center

			> svg
				width 24px
				height 82px
				vertical-align top
				fill #fff
				opacity 0.7

		> .me
			display flex
			margin 0 16px 16px 16px
			padding 16px 0
			align-items center

			> .avatar
				height 48px
				border-radius 100%
				vertical-align middle

			> .info
				overflow hidden

				> .name
					margin 0 16px
					padding 0
					color #fff
					overflow hidden
					text-overflow ellipsis
					white-space nowrap
					font-size 15px

				> .role
					margin 0 16px
					padding 1px 6px
					border-radius 3px
					font-size 80%
					color var(--noteHeaderAdminFg)
					background var(--noteHeaderAdminBg)
					overflow hidden
					text-overflow ellipsis
					white-space nowrap

		> .back-to-misskey
			margin 16px 16px 0 16px
			padding 0

			> a
				display block
				padding 16px 4px
				color inherit
				text-decoration none
				color #eee
				font-size 15px

				&:hover
					color #fff

				> [data-icon]
					margin-right 6px

		> .version
			margin 0 16px 16px 16px
			padding-top 16px
			text-align center

			> small
				opacity 0.7

		> ul
			margin 0
			padding 0
			list-style none
			font-size 15px

			> li > a
				display block
				padding 10px 16px
				margin 0
				user-select none
				color #eee
				transition margin-left 0.2s ease

				&:hover
					color #fff

				> [data-icon]
					margin-right 6px

				&.active
					margin-left 8px
					color var(--primary) !important

					&:after
						content ""
						display block
						position absolute
						top 0
						right 0
						bottom 0
						margin auto 0
						height 0
						border-top solid 16px transparent
						border-right solid 16px var(--bg)
						border-bottom solid 16px transparent
						border-left solid 16px transparent

	> .nav-backdrop
		position fixed
		top 0
		left 0
		z-index 20000
		width 100%
		height 100%
		background var(--mobileNavBackdrop)

	> main
		width 100%
		padding 0 0 0 250px

		> .page
			max-width 1150px
			color var(--text)

			@media (min-width 500px)
				padding 16px

	&.isMobile
		> main
			padding $headerHeight 0 0 0

.denied
	padding 16px
	height 100%

	>	h1
	> p
		color var(--text)

		> a
			color var(--primary)

</style>

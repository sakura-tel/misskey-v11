<template>
<div style="position:initial">
	<mk-menu :source="source" :items="items" @closed="closed"/>
</div>
</template>

<script lang="ts">
import Vue from 'vue';
import i18n from '../../../i18n';
import { url } from '../../../config';
import copyToClipboard from '../../../common/scripts/copy-to-clipboard';
import { faCopy, faEye, faEyeSlash } from '@fortawesome/free-regular-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';

export default Vue.extend({
	i18n: i18n('common/views/components/note-menu.vue'),
	props: ['note', 'source', 'actualNote'],
	data() {
		return {
			isFavorited: false,
			isWatching: false
		};
	},
	computed: {
		items(): any[] {
			if (this.$store.getters.isSignedIn) {
				return [{
					icon: 'info-circle',
					text: this.$t('detail'),
					action: this.detail
				}, {
					icon: faCopy,
					text: this.$t('copy-content'),
					action: this.copyContent
				}, {
					icon: 'link',
					text: this.$t('copy-link'),
					action: this.copyLink
				},
				...(this.note.uri ? [
					{
						icon: 'link',
						text: this.$t('copy-remote-link'),
						action: this.copyRemoteLink
					}, {
						icon: 'external-link-square-alt',
						text: this.$t('remote'),
						action: () => {
							window.open(this.note.uri, '_blank');
						}
					}]
					: []
				),
				null,
				this.isFavorited ? {
					icon: 'star',
					text: this.$t('unfavorite'),
					action: () => this.toggleFavorite(false)
				} : {
					icon: 'star',
					text: this.$t('favorite'),
					action: () => this.toggleFavorite(true)
				},
				this.note.userId != this.$store.state.i.id ? this.isWatching ? {
					icon: faEyeSlash,
					text: this.$t('unwatch'),
					action: () => this.toggleWatch(false)
				} : {
					icon: faEye,
					text: this.$t('watch'),
					action: () => this.toggleWatch(true)
				} : undefined,
				this.note.userId == this.$store.state.i.id ? (this.$store.state.i.pinnedNoteIds || []).includes(this.note.id) ? {
					icon: 'thumbtack',
					text: this.$t('unpin'),
					action: () => this.togglePin(false)
				} : {
					icon: 'thumbtack',
					text: this.$t('pin'),
					action: () => this.togglePin(true)
				} : undefined,
				...(this.note.userId == this.$store.state.i.id || this.$store.state.i.isAdmin || this.$store.state.i.isModerator ? [
					null,
					this.note.userId == this.$store.state.i.id ? {
						icon: faEdit,
						text: this.$t('delete-and-edit'),
						action: this.deleteAndEdit
					} : undefined,
					{
						icon: ['far', 'trash-alt'],
						text: this.note.userId == this.$store.state.i.id ? this.$t('delete') : this.$t('deleteAsAdmin'),
						action: this.del
					}]
					: []
				),
				...(this.actualNote.userId == this.$store.state.i.id && this.actualNote && this.actualNote.renote ? [{
					icon: 'undo-alt',
					text: this.$t('undo-renote'),
					action: this.undoRenote
				}] : []),
				]
				.filter(x => x !== undefined);
			} else {
				return [{
					icon: 'info-circle',
					text: this.$t('detail'),
					action: this.detail
				}, {
					icon: faCopy,
					text: this.$t('copy-content'),
					action: this.copyContent
				}, {
					icon: 'link',
					text: this.$t('copy-link'),
					action: this.copyLink
				},
				...(this.note.uri ? [
					{
						icon: 'link',
						text: this.$t('copy-remote-link'),
						action: this.copyRemoteLink
					}, {
						icon: 'external-link-square-alt',
						text: this.$t('remote'),
						action: () => {
							window.open(this.note.uri, '_blank');
						}
					}]
					: []
				),]
				.filter(x => x !== undefined);
			}
		}
	},

	created() {
		this.$root.api('notes/state', {
			noteId: this.note.id
		}).then(state => {
			this.isFavorited = state.isFavorited;
			this.isWatching = state.isWatching;
		});
	},

	methods: {
		mention() {
			this.$post({ mention: this.note.user });
		},

		detail() {
			this.$router.push(`/notes/${this.note.id}`);
		},

		copyContent() {
			copyToClipboard(this.note.text);
			this.$root.dialog({
				type: 'success',
				splash: true
			});
		},

		copyLink() {
			copyToClipboard(`${url}/notes/${this.note.id}`);
			this.$root.dialog({
				type: 'success',
				splash: true
			});
		},

		copyRemoteLink() {
			copyToClipboard(this.note.url);
			this.$root.dialog({
				type: 'success',
				splash: true
			});
		},

		togglePin(pin: boolean) {
			this.$root.api(pin ? 'i/pin' : 'i/unpin', {
				noteId: this.note.id
			}).then(() => {
				this.$root.dialog({
					type: 'success',
					splash: true
				});
				this.destroyDom();
			}).catch(e => {
				if (e.id === '72dab508-c64d-498f-8740-a8eec1ba385a') {
					this.$root.dialog({
						type: 'error',
						text: this.$t('pin-limit-exceeded')
					});
				}
			});
		},

		del() {
			this.$root.dialog({
				type: 'warning',
				text: this.note.userId == this.$store.state.i.id ? this.$t('delete-confirm') : this.$t('deleteAsAdmin-confirm'),
				showCancelButton: true
			}).then(({ canceled }) => {
				if (canceled) return;

				this.$root.api('notes/delete', {
					noteId: this.note.id
				}).then(() => {
					this.destroyDom();
				});
			});
		},

		deleteAndEdit() {
			this.$root.dialog({
				type: 'warning',
				text: this.$t('delete-and-edit-confirm'),
				showCancelButton: true
			}).then(({ canceled }) => {
				if (canceled) return;
				this.$root.api('notes/delete', {
					noteId: this.note.id
				}).then(() => {
					this.destroyDom();
				});
				this.$post({
					initialNote: this.note,
					reply: this.note.reply,
				});
			});
		},

		undoRenote() {
			this.$root.dialog({
				type: 'warning',
				text: this.$t('undo-renote-confirm'),
				showCancelButton: true
			}).then(({ canceled }) => {
				if (canceled) return;

				this.$root.api('notes/delete', {
					noteId: this.actualNote.id
				}).then(() => {
					this.destroyDom();
				});
			});
		}

		toggleFavorite(favorite: boolean) {
			this.$root.api(favorite ? 'notes/favorites/create' : 'notes/favorites/delete', {
				noteId: this.note.id
			}).then(() => {
				this.$root.dialog({
					type: 'success',
					splash: true
				}).then(() => {
					this.destroyDom();
				});
			});
		},

		toggleWatch(watch: boolean) {
			this.$root.api(watch ? 'notes/watching/create' : 'notes/watching/delete', {
				noteId: this.note.id
			}).then(() => {
				this.$root.dialog({
					type: 'success',
					splash: true
				}).then(() => {
					this.destroyDom();
				});
			});
		},

		closed() {
			this.$emit('closed');
			this.$nextTick(() => {
				this.destroyDom();
			});
		}
	}
});
</script>

<template>
<div>
	<b-navbar toggleable="md">
		<b-navbar-brand>Developers</b-navbar-brand>
		<b-navbar-nav>
			<b-nav-item to="/">Home</b-nav-item>
			<b-nav-item to="/apps">Apps</b-nav-item>
		</b-navbar-nav>
	</b-navbar>
	<main>
		<slot></slot>
	</main>
</div>
</template>

<style lang="stylus" scoped>
.navbar
	--bs-navbar-padding-x 1rem
	--bs-navbar-padding-y 0.5rem
main
	padding 32px
	max-width 700px
</style>

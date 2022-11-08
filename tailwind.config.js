/* eslint-disable no-undef */
/** @type {import('tailwindcss').Config} */

let colors = require('tailwindcss/colors');

delete colors['lightBlue'];
delete colors['warmGray'];
delete colors['trueGray'];
delete colors['coolGray'];
delete colors['blueGray'];

colors = { ...colors, ...{ transparent: 'transparent' } };

const plugin = require('tailwindcss/plugin');
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
		'./layouts/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		colors: {
			...colors,
			'linkedin': '#0072b1',
			'tahiti': {
				100: '#cffafe',
				200: '#a5f3fc',
				300: '#67e8f9',
				400: '#22d3ee',
				500: '#06b6d4',
				600: '#0891b2',
				700: '#0e7490',
				800: '#155e75',
				900: '#063f58',
			}
		},
		screens: {
			'3xs': '320px',
			'xxs': '375px',
			'xs': '475px',
			...defaultTheme.screens,
		},
		extend: {

		},
	},
	plugins: [
		// require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
		plugin(function ({ addComponents, theme }) {
			const screens = theme('screens', {});
			addComponents([
				{
					'.container': { width: '100%' },
				},
				{
					[`@media (min-width: ${screens.sm})`]: {
						'.container': {
							'max-width': '640px',
						},
					},
				},
				{
					[`@media (min-width: ${screens.md})`]: {
						'.container': {
							'max-width': '768px',
						},
					},
				},
				{
					[`@media (min-width: ${screens.lg})`]: {
						'.container': {
							'max-width': '1024px',
						},
					},
				},
				{
					[`@media (min-width: ${screens.xl})`]: {
						'.container': {
							'max-width': '1280px',
						},
					},
				},
				{
					[`@media (min-width: ${screens['2xl']})`]: {
						'.container': {
							'max-width': '1280px',
						},
					},
				},
			]);
		}),
		plugin(function ({addUtilities}) {
			addUtilities({
				'.rotate-y-180': {
					transform: 'rotateY(180deg)'
				}
			});
		})
	],
	safelist: [
		'lg:pr-2',
		'lg:pl-2',
		'xl:pr-2',
		'xl:pl-2',
		'text-yellow-500',
		'text-emerald-600',
		'text-slate-500',
		'text-amber-500',
		'text-indigo-600',
		'text-green-500',
		'text-yellow-600',
		'text-blue-500'
	]
};
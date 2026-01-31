// INTERACTIVO MAGIC - TEMPLATES REGISTRY
// All templates are imported from their dedicated specialized files.

import { LOVE_TEMPLATE } from './love/love-proposal';
import { GALAXY_TEMPLATE } from './love/galaxy';
import { BOOK_LOVE_TEMPLATE } from './love/book-love';
import { LOVE_INITIALS_TEMPLATE } from './love/love-initials';
import { ENOJONA_TEMPLATE } from './love/enojona';
import { LOVE_CERTIFICATE_TEMPLATE } from './love/love-certificate';
import { MUSICAL_SPHERE_TEMPLATE } from './love/musical-sphere';
import { FLOWERS_BOUQUET_TEMPLATE } from './love/flowers-bouquet';
import { LOVE_VITAMINS_TEMPLATE } from './love/love-vitamins';

import { BIRTHDAY_TEMPLATE } from './eventos/birthday';
import { DATE_COUNTER_TEMPLATE } from './eventos/date-counter';

import { PUZZLE_LOVE_TEMPLATE } from './juegos/puzzle-love';
import { RULETA_LOVE_TEMPLATE } from './juegos/ruleta-love';
import { SCRATCH_MESSAGE_TEMPLATE } from './juegos/scratch-message';

import { MARVEL_BOOK_TEMPLATE } from './fun/marvel-book';
import { FORGIVE_ME_CATS_TEMPLATE } from './fun/forgive-me-cats';
import { FORGIVE_ME_PENGUINS_TEMPLATE } from './fun/forgive-me-penguins';
import { ENCHANTED_LETTER_TEMPLATE } from './halloween/enchanted-letter';

// --- EXPORTS ---
export {
    LOVE_TEMPLATE,
    GALAXY_TEMPLATE,
    BOOK_LOVE_TEMPLATE,
    LOVE_INITIALS_TEMPLATE,
    ENOJONA_TEMPLATE,
    LOVE_CERTIFICATE_TEMPLATE,
    MUSICAL_SPHERE_TEMPLATE,
    FLOWERS_BOUQUET_TEMPLATE,
    LOVE_VITAMINS_TEMPLATE,
    BIRTHDAY_TEMPLATE,
    DATE_COUNTER_TEMPLATE,
    PUZZLE_LOVE_TEMPLATE,
    RULETA_LOVE_TEMPLATE,
    SCRATCH_MESSAGE_TEMPLATE,
    MARVEL_BOOK_TEMPLATE,
    FORGIVE_ME_CATS_TEMPLATE,
    ENCHANTED_LETTER_TEMPLATE,
    FORGIVE_ME_PENGUINS_TEMPLATE
};

// --- ALIASES AND SPECIALIZATIONS ---
export const GALAXY_GENERATOR_TEMPLATE = GALAXY_TEMPLATE;
export const PROPOSAL_TEMPLATE = LOVE_TEMPLATE.replace('SÍ ❤️', '¡SÍ, ACEPTO! 💍');
export const FLOWERS_RAMO_TEMPLATE = FLOWERS_BOUQUET_TEMPLATE;
export const COUPLE_INITIALS_TEMPLATE = LOVE_INITIALS_TEMPLATE;
export const BIRTHDAY_LAMP_TEMPLATE = BIRTHDAY_TEMPLATE;
// LOVE_VITAMINS_TEMPLATE is now imported directly from love-vitamins.js
export const SOCCER_CARD_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '⚽').replace('#ff4d94', '#4caf50');
export const DEDICATE_SONG_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🎧');
export const POCOYO_DANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🕺').replace('#0a0514', '#03a9f4');
export const BE_MY_BOYFRIEND_TEMPLATE = LOVE_TEMPLATE.replace('SÍ ❤️', 'SÍ, ¡ACEPTO! 💍');
export const TE_AMO_TEMPLATE = GALAXY_TEMPLATE;
export const BE_FRIENDS_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🤝');
export const HEART_PHOTO_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '📸');
export const OUR_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '📅');
export const CHRISTMAS_TREE_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '🎄').replace('#00f2ff', '#2e7d32');
export const NEW_YEAR_TEMPLATE = BIRTHDAY_TEMPLATE.replace('🎂', '🥂');
export const LAST_CHANCE_TEMPLATE = LOVE_TEMPLATE.replace('🎁', '🔓');
export const HIDDEN_MESSAGE_TEMPLATE = GALAXY_TEMPLATE.replace('🎁', '🕵️‍♀️');

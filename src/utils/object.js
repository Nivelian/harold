import { map, zipObject } from 'lodash';

export let keymap = (ks, f) => zipObject(ks, map(ks, f));

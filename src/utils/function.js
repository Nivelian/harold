import { flowRight } from 'lodash';

export let identity = x => x;
export let bool = x => !!x;
export let let_ = f => f();
export let when = (x, f) => x && (f(x) || true);
export let comp = (...fs) => flowRight(fs);

# Will it Scale? - Finding Svelte's Inflection Point

from [#2546](https://github.com/sveltejs/svelte/issues/2546)
> Theoretically, yes there is an inflection point. Where that inflection point is is the only thing that really matters. In practice, you're unlikely to hit that inflection point on any given page of your app, as long as you're using code-splitting (which Sapper gives you OOTB)

We can work out this inflection point given sufficient data.

**TLDR: Inflection is at 120 KB of component source (for react 16)**

## Finding the Svelte Bundle Size Formula

To find the inflection point, we need to determine the relationship between a projects svelte component source, and its generated bundle size.

We use the components from: 
 * [Svelte Website](https://github.com/sveltejs/svelte/tree/master/site/src)
 * [Svelte Realworld](https://github.com/sveltejs/realworld/)
 * [Svelte HN](https://github.com/sveltejs/hn.svelte.dev)

After removing the style tags, and bundling and minification we get a graph:

![Svelte source vs bundle size](https://raw.githubusercontent.com/halfnelson/svelte-it-will-scale/master/img/Source%20size%20vs%20Bundle%20size%20-%20Svelte.svg)

The yellow line is our final zipped and minified bundle, each data point is a bundle built with rollup by the scripts in this repository.

We can see the relationship is mostly linear, and a linear regression gives 

`Svelte Bundle Bytes = 0.493 * Source_Size + 2811`

## Finding the React Bundle Size Formula

We will compare our Svelte bundle size formula with reacts.

We will use the react components from:
 * [React Native Website](https://github.com/facebook/react-native-website/)
 * [React Redux Realworld](https://github.com/gothinkster/react-redux-realworld-example-app)
 * [Builder Book](https://github.com/builderbook/builderbook)

After ensuring that we only include react components and not util/library code, we end up with the following graph:
![React source vs bundle size](https://raw.githubusercontent.com/halfnelson/svelte-it-will-scale/master/img/Source%20size%20vs%20Bundle%20size%20-%20React.svg)

The lines certainly look flatter than Svelte's, so we have a good chance of finding an inflection point. Linear regression on our data determines the relationship between React component source code and gzipped minified bundle size to be:

`React Bundle Bytes = 0.153 * Source_Size + 43503`

## Calculating the Inflection Point

With our two bundle size formulas, we are able to find an inflection point using basic algebra.... but that isn't as pretty as graphs:

![Source size vs Bundle Size Comparison](https://raw.githubusercontent.com/halfnelson/svelte-it-will-scale/master/img/Source%20size%20vs%20Bundle%20size.svg)

Examining the graph shows __the inflection point is about 120KB of component source__.


## What does it mean?

It would seem that at about 120KB, the size advantage of going with a compiler over a runtime has vanished. 

Should this be a concern? 

from [#2546](https://github.com/sveltejs/svelte/issues/2546)
> In practice, you're unlikely to hit that inflection point on any given page of your app, 
as long as you're using code-splitting (which Sapper gives you OOTB)

We should be able to check this assertion by looking at the amount of svelte code in each of the projects we used:

![Svelte Project Size Examples](https://raw.githubusercontent.com/halfnelson/svelte-it-will-scale/master/img/Project%20Component%20Source%20Size.svg)

It turns out that svelte projects tend to be lean already. None of the projects we used came close to the inflection point, even all three projects combined falls short (we get just over half way there).

If these projects didn't come close, the odds are most projects won't. Indeed, even the figures above ignore code splitting, which would reduce the first payload significantly.

## Summary

It is good to have an answer to "Will it Scale", and we can be assured that yes "It Will Scale"

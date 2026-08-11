# Image and video prompts

Every photographic slot on the site, with a prompt to generate it. Run these,
drop the files in, and the drawn composition steps aside.

Nothing here is blocking. Each slot already renders a finished composition
built from the studio's own geometry — seven of them, two showing the robot
itself — chosen by the slot's position so no two on a page repeat. A specimen
page, not a grey box. Real photography is an upgrade to a page that already
works, and the three meaning states have shipping procedural versions too.

---

## How to drop a file in

Put the file in `public/work/` (or `public/studio/`) and set one field.

For the four capability pieces, `lib/content.ts`:

```ts
{
  slug: "brand-identity-hospitality",
  discipline: "Brand identity",
  // …
  image: "/work/brand-identity-hospitality.jpg",   // ← this line
}
```

That one field feeds the corridor on the homepage, the `/work` grid and the
piece's own page. For the `/studio` slot, set `src` on the `<Plate>` in
`app/studio/page.tsx`.

For a video slot, keep `image` as the poster and add the video beside it:

```tsx
<Plate
  seed="brand-identity-hospitality"
  ratio="3/2"
  src="/work/brand-identity-hospitality.jpg"
  video="/work/brand-identity-hospitality.mp4"
/>
```

The poster is not optional. It is what a reader with reduced motion set sees,
and what shows before the video has decoded a frame.

---

## Rules that apply to every prompt

These are constraints on the brief, not preferences.

**No people.** No faces, no hands, no figures, identifiable or otherwise. If a
prompt needs human presence, it gets it through evidence — a chair pushed
back, a cup half-finished, a light left on.

**No third-party brands.** No real logos, wordmarks, product packaging or
recognisable brand shapes anywhere in frame, including reflections and blurred
backgrounds. Where a mock-up needs a mark on it, leave the surface blank; the
Loomie mark is composited in afterwards, not generated.

**No text.** Generated lettering is unreliable and any legible word in a
photograph will read as a claim about a client.

**It has to sit on `--void` (`#0A0B0D`).** Every image is placed on a
near-black page with a living grain over it. That means:

- The image's own darkest values should approach `#0A0B0D` at the edges, so
  the frame dissolves into the page rather than sitting on it as a rectangle.
- Overall exposure low-key. A bright, evenly-lit photograph will look like a
  window cut into the page.
- One light source, warm — around `--ember` (`#F0B45A`) — or one cold, around
  `--frost` (`#BFD9E3`). Not both in the same frame. Warm and cold are the two
  poles of the brand story (snow, and the sun that turns it into a river), and
  mixing them in a single image collapses the distinction.
- Saturation restrained. The only chromatic events on this site are ember and
  frost; a green plant or a blue sky in frame will be the loudest thing on the
  page.

**Grain.** Shoot for fine, even film grain — the site lays two animated noise
layers over everything at low opacity, and an image that arrives already
clean-digital will look plastic against a page that is not. Do not generate
heavy grain; the page supplies most of it.

**Delivery.** JPEG or WebP, sRGB, longest edge 2400px, quality ~82. Video:
H.264 MP4, no audio track at all, under 6MB, 8–14 seconds, cut so the loop
point is invisible.

---

## The four capability pieces

Sector pieces, not client stories. **These images must not read as case-study
documentation of work that happened** — no client deliverables, no "before and
after", no branded mock-ups. Each page describes a brand problem a sector
arrives with; the image is the sector's atmosphere, not evidence of a job.

One file per slot serves three places at three crops: 3/2 in the homepage
corridor, 4/5 in the `/work` grid, 16/9 on the piece's own page. **Compose for the
centre** and leave the outer thirds quiet, or the 4/5 crop will cut the
subject in half.

### 1 — `brand-identity-hospitality` · Brand identity · Hospitality

> A close, low-key still life of unbranded hospitality materials on a dark
> stone surface: a stack of blank uncoated cards, a folded linen napkin, a
> small ceramic cup with no logo. Single warm light source from the upper
> left at a shallow angle, colour around #F0B45A, falling off hard into
> near-black at the right and bottom edges. Deep shadows that reach #0A0B0D.
> Shallow depth of field, focus on the top card's edge. Muted palette — warm
> greys, bone, a single amber highlight. Fine film grain. No text, no logos,
> no people. Aspect ratio 3:2, subject centred.

**Video alternative:** the same set-up with the warm light slowly drifting
across the surface, as if a door were opening somewhere off frame. 10 seconds,
no camera movement, only the light moves.

### 2 — `identity-and-website-professional-services` · Identity and website · Professional services

> A dark tabletop with a blank matte screen at a slight angle, unbranded and
> switched off, catching one cold specular highlight along its top edge. Cold
> light source, colour around #BFD9E3, raking from the right. Everything else
> falls to near-black #0A0B0D. Charcoal and slate palette, no warm tones.
> Macro-adjacent framing so the screen edge and the surface texture are the
> subject rather than the object. Fine film grain. No reflections of people,
> no interface visible, no text, no logos. Aspect ratio 3:2, subject centred.

### 3 — `marketing-design-retail` · Marketing design · Retail

> A stack of blank uncoated poster paper on a dark floor, edges catching a
> single warm light from a high window off frame. Colour around #F0B45A on
> the top edges only; the body of the stack sits in shadow approaching
> #0A0B0D. Slight dust in the air catching the beam. Paper is completely
> blank — no print, no text, no marks. Muted warm-grey palette. Fine film
> grain. No people. Aspect ratio 3:2, stack centred with quiet space either
> side.

**Video alternative:** dust drifting through the light beam, everything else
still. 12 seconds. This is the slot that most suits motion — the drift echoes
the site's own grain.

### 4 — `website-design-product` · Website design · Product

> An architectural interior detail in near-darkness: the corner where a pale
> wall meets a dark floor, with one cold shaft of daylight crossing it
> diagonally. Light colour around #BFD9E3. Extremely low-key — most of the
> frame is between #0A0B0D and #1C1F23, with the lit wedge the only bright
> value. No furniture, no objects, no signage, no people. Composition
> geometric and quiet, the diagonal running through the centre. Fine film
> grain. Aspect ratio 3:2.

---

## The studio slot

### 5 — `studio-name` · `/studio`, beside the three meanings

The one image on the site that carries an idea rather than atmosphere: snow,
river, lights — the three meanings of the name, and the studio's own story
about snow becoming a river.

> A macro photograph of snow beginning to melt, water gathering into a single
> thin channel through it. Shot from directly above. Cold light, colour around
> #BFD9E3, from a low winter sun off frame; one small warm highlight around
> #F0B45A where the water catches it, and no other warm tone. The snow's
> shadowed areas fall to #1C1F23 and the frame's corners approach #0A0B0D.
> Almost monochrome — white, blue-grey, near-black, one amber glint. Very
> shallow depth of field. Fine film grain. No people, no footprints, no
> objects. Aspect ratio 3:2, the channel running through the centre.

**Video alternative, and this is the strongest candidate on the site:** the
same frame with the meltwater actually moving through the channel, everything
else static. 8–12 seconds, no camera movement, cut so the loop is seamless.
The studio's whole story is snow becoming a river; showing it move is worth
more here than anywhere else.

---

---

## The three meaning states

`/` — the section the hero's camera push opens onto. Each state is a short
loop behind the word it belongs to, cross-fading with the ambient field over
800ms. **Procedural versions of all three ship today** — a canvas snowfield,
an SMIL-displaced water surface, and a CSS bokeh field — so these replace
something that already works rather than filling a hole.

Deliver as MP4, no audio track, 8–14 seconds, cut so the loop point is
invisible, 1920×1080. Each needs a poster still from its own first frame.

### 5 — `snow` · Finnish · cold

> Fine snow drifting across a near-black field, shot against darkness with a
> single cold light source off to the upper left, colour around #BFD9E3. No
> ground, no horizon, no landmarks — only the particles and the dark. Shallow
> depth of field so the nearest flakes are soft and the far ones resolve.
> Slow: individual flakes should take three or four seconds to cross the
> frame. Overall exposure very low-key, corners falling to #0A0B0D. Fine film
> grain. No people, no structures, no text. 16:9.

### 6 — `river` · Albanian · deep

> Dark water moving slowly, shot from directly above, filling the frame. High
> contrast between the near-black body of the water and the specular
> highlights on its surface. One cold light source, colour around #BFD9E3,
> raking from the right so the ripples catch as thin bright lines. No banks,
> no sky, no objects in the water. The darkest areas reach #0A0B0D. Slow,
> continuous motion with no obvious start or end. Fine film grain. No people.
> 16:9.

### 7 — `lights` · Italian · warm

> Warm points of light thrown far out of focus, filling the frame as soft
> overlapping discs. Colour around #F0B45A, no other hue. Very shallow depth
> of field — nothing in the frame is sharp. The lights drift and change
> intensity slowly, as if seen from a moving vehicle at a distance. Between
> the discs the frame falls to #0A0B0D. No visible source, no filaments, no
> street furniture, no text. Fine film grain. 16:9.

---

## What is deliberately not a photographic slot

- **The hero.** It is the robot, and the scroll pushes the camera into its
  eye. A photograph there would compete with the one thing the homepage is
  for, and there is nothing to push into.
- **The exploded assembly.** The robot taking itself apart and resolving into
  the mark. Photographing a brand system defeats the point of showing it as
  drawings.
- **The work corridor.** The same four plates as `/work`, at depth. It takes
  whatever those slots are given.
- **The ticker, the tone sections, the CTA.** Type and light only.
- **`/clients`, `/process`, `/services`, `/studio/principles`.** These pages
  are lists and sequences; an image on any of them would be decoration hunting
  for a reason.

---

## Once the files are in

Check each one at 390px as well as 1440px. The reveal opens from a different
edge for each slot in a run and the picture parallaxes 12% of its own height
inside the frame, so an image with its subject hard against one edge will
drift out of view at one end of the scroll. Subject in the centre third,
vertically as well as horizontally.

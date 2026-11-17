// Design options behind URL switches. Without a parameter the page is exactly as designed.
//   ?pal=poppy | ultra | moss        colour palette (default: cobalt)
export const PALS = {
  cobalt: { name: 'Cobalt', ground: '#f6f1ea', sky: '#efe6d8', side: '#1836cc', face: '#2a4cf0', deep: '#1f3fe0', accent: '#f6c21a', onAccent: '#15151a', ink: '#15151a', paper: '#fbf8f3', robot: '#f6c21a', trim: '#8b8d92', night: '#0e1230' },
  poppy:  { name: 'Poppy',  ground: '#f4ede2', sky: '#f1e4d3', side: '#d93a1c', face: '#ff5533', deep: '#e8401f', accent: '#2f5bff', onAccent: '#ffffff', ink: '#1a1413', paper: '#fffaf2', robot: '#f7f1e3', trim: '#2f5bff', night: '#1d0f14' },
  ultra:  { name: 'Ultra',  ground: '#f0edf7', sky: '#e6e0f3', side: '#5a2fe0', face: '#7650ff', deep: '#5a2fe0', accent: '#c9f24a', onAccent: '#16132a', ink: '#16132a', paper: '#fbfaff', robot: '#ff7a1a', trim: '#f3efe6', night: '#0f0b24' },
  moss:   { name: 'Moss',   ground: '#efe9dc', sky: '#e7dfcd', side: '#0c5a43', face: '#12785a', deep: '#0f6b4f', accent: '#ff8a3c', onAccent: '#14201b', ink: '#14201b', paper: '#fbf7ee', robot: '#f6efe0', trim: '#ff8a3c', night: '#0a1a16' },
};
const q = new URLSearchParams(location.search);
export const PAL = PALS[q.get('pal')] || PALS.cobalt;
if (PAL !== PALS.cobalt) {
  const r = document.documentElement.style;
  r.setProperty('--ground', PAL.ground); r.setProperty('--paper', PAL.paper); r.setProperty('--ink', PAL.ink);
  r.setProperty('--blue', PAL.deep); r.setProperty('--yellow', PAL.accent); r.setProperty('--on-accent', PAL.onAccent);
}

const fs = require('fs');
const html = fs.readFileSync('scratch_live_journey.html', 'utf8');

// Find swiper init in scratch_live_journey.html or script
const scriptMatches = [...html.matchAll(/new Swiper\([^)]*\)|swiper[^{;]*\{[^}]*\}/gis)].map(m => m[0]);
console.log('Swiper script matches:');
console.log(scriptMatches.slice(0, 10));

// Also check any js config for swiper
const allScripts = [...html.matchAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi)].map(m => m[0]);
allScripts.forEach(s => {
  if (s.includes('swiper') || s.includes('journey')) {
    console.log('\n--- Script with swiper/journey ---');
    console.log(s.slice(0, 1500));
  }
});
